import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./MongoDB/mongodb.js";
import bcrypt from "bcryptjs";
import { genreateToken } from "./utils/jwtUtils.js";
import { sendEmail, sendOTP, sendTicket } from "./Email/emailservices.js";
import secretKey from "./configuration/jwtConfig.js";
import jwt from "jsonwebtoken";
import User from "./Model/UserSchema.js";
import modelOtp from "./Model/OtpSchema.js";
import Ferry from "./Model/FerrySchema.js";
import Schedule from "./Model/ScheduleSchema.js";
import Booking from "./Model/BookingSchema.js";
import Feedback from "./Model/FeedbackSchema.js";
import Contact from "./Model/ContactSchema.js";
import BookingPayment from "./Model/BookingPayment.js";
import authenticationToken from "./utils/authMiddleware.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import cron from "node-cron";
import axios from "axios";
import Stripe from "stripe";
import PDFDocument from "pdfkit";
import path from "path";
import os from "os";
import fs from "fs";
import generateTicketPDF from "./utils/ticketUtils.js";



import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(bodyParser.json());

dayjs.extend(utc);
dayjs.extend(timezone);

connectDB();


const updateFerryStatuses = async () => {
    try {
        const currentTime = new Date();

        const schedules = await Schedule.find({
            $or: [
                { onwardStatus: "scheduled" },
                { returnStatus: "scheduled" }
            ]
        });

        for (const schedule of schedules) {
            const updates = {};

            if (schedule.onwardStatus === "scheduled" && schedule.departureDate && schedule.arrivalTime) {
                const arrivalDateTime = new Date(`${schedule.departureDate.toDateString()} ${schedule.arrivalTime}`);
                if (arrivalDateTime <= currentTime) {
                    updates.onwardStatus = "departed";
                }
            }

            if (schedule.tripType === "round-trip" && schedule.returnStatus === "scheduled" && schedule.returnDate && schedule.returnTime) {
                const returnDateTime = new Date(`${schedule.returnDate.toDateString()} ${schedule.returnTime}`);
                if (returnDateTime <= currentTime) {
                    updates.returnStatus = "departed";
                }
            }

            if (Object.keys(updates).length > 0) {
                await Schedule.findByIdAndUpdate(schedule._id, updates);
                console.log(`Schedule ${schedule._id} updated with:`, updates);
            }
        }
    } catch (error) {
        console.error("Error updating ferry statuses:", error);
    }
};

cron.schedule("* * * * *", async () => {
    console.log("Running ferry schedule status check...");
    await updateFerryStatuses();
});

// User Register
app.post("/api/register", async (req, res) => {
    try {
        const { fullName, email, password, phone } = req.body;

        if (!fullName || !email || !password || !phone) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const firstLetter = fullName.charAt(0).toUpperCase();
        const profilePhoto = `https://ui-avatars.com/api/?name=${firstLetter}&background=random&color=fff`;

        const newUser = new User({ fullName, email, password: hashedPassword, phone, profilePhoto });
        await newUser.save();
        await sendEmail(email)
        console.log("Sending email to:", email);


        res.json({ message: "User registered successfully", User: newUser });
    } catch (error) {
        console.error("Error in /register:", error);
        res.status(500).json({ error: "Server Error" });
    }
});

// User Login
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "missing fields" });
        }

        console.log("Looking for user:", email);

        const finduser = await User.findOne({ email });
        console.log("User found:", finduser);

        if (!finduser) {
            console.error("Email not found in database");
            return res.status(400).json({ error: "email" }); 
        }

        if (!finduser.password) {
            console.error("User password is missing in the database");
            return res.status(500).json({ error: "server_error" });
        }

        console.log("Comparing passwords...");
        const isMatch = await bcrypt.compare(password, finduser.password);

        if (!isMatch) {
            console.error("Password is incorrect");
            return res.status(400).json({ error: "password" }); 
        }

        console.log("Password match successful");

        const Token = genreateToken(finduser);
       

        console.log("Token generated:", Token);
       

        res.status(200).json({
            message: "Logged In Successfully",
            token: Token,
            user: {
                fullName: finduser.fullName,
                email: finduser.email,
                profilePhoto: finduser.profilePhoto,
                phone: finduser.phone,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "server_error" });
    }
});

//Update Profile
app.patch("/api/profile", authenticationToken, async (req, res) => {
    try {
        console.log("User ID from token:", req.user.id);
        const userId = req.user.id;
        const { fullName, email, phone } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { fullName, email, phone },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

//forgot-password
app.post("/api/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        console.log("Checking email:", email);

        const finduser = await User.findOne({ email });
        console.log("User found:", finduser);

        if (!finduser) {
            return res.status(400).json({ error: "User not found" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        finduser.otp = otp;
        await modelOtp.create({ email, otp, otpExpires: Date.now() + 1 * 60 * 1000 });
        await finduser.save();

        await sendOTP(email, otp);
        const token = jwt.sign({ email }, secretKey, { expiresIn: "10m" });
        res.json({ message: "OTP sent and verified successfully!", token });
    } catch (error) {
        console.error("Error in /forgot-password:", error.message);
        res.status(500).json({ error: error.message });
    }
});

//verify-otp
app.post("/api/verify-otp", async (req, res) => {
    try {
        const { otp } = req.body;

        const otpRecord = await modelOtp.findOne({ otp });

        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (Date.now() > otpRecord.otpExpires) {
            return res.status(400).json({ message: "OTP has expired. Please request a new one." });
        }

        const token = jwt.sign({ email: otpRecord.email, otp }, secretKey, { expiresIn: "10m" });

        res.json({ message: "OTP verified successfully", token });
    } catch (error) {
        console.error("Error in /verify-otp:", error.message);
        res.status(500).json({ error: "Server error" });
    }
});

// resend-otp
app.post("/api/resend-otp", async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

        user.otp = newOtp;
        user.otpExpires = Date.now() + 1 * 60 * 1000;
        await user.save();

        await modelOtp.create({ email, otp: newOtp });

        await sendOTP(email, newOtp);

        res.json({ message: "New OTP sent successfully" });
    } catch (err) {
        console.error("Error in /resend-otp:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

//reset-password
app.post("/api/reset-password", async (req, res) => {
    try {
        console.log("Received reset-password request:", req.body);

        const { password } = req.body;
        if (!password) {
            console.log("Error: Missing password");
            return res.status(400).json({ error: "Password is required" });
        }

        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            console.log("Error: No token provided");
            return res.status(401).json({ error: "Unauthorized, token required" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, secretKey);
            console.log("Decoded Token:", decoded);
        } catch (err) {
            console.log("Error: Invalid or expired token");
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        console.log("Full Decoded Token Data:", decoded);

        if (!decoded.email) {
            console.log("Error: Token missing email", decoded);
            return res.status(400).json({ error: "Invalid token data" });
        }

        console.log("Finding user with email:", decoded.email);
        const findUser = await User.findOne({ email: decoded.email });

        if (!findUser) {
            console.log("Error: User not found");
            return res.status(400).json({ message: "User not found" });
        }

        const salt = await bcrypt.genSalt(10);
        findUser.password = await bcrypt.hash(password, salt);

        await findUser.save();

        console.log("Password reset successful for:", decoded.email);
        res.json({ message: "Password reset successful" });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ error: "Server error, please try again later" });
    }
});

// admin-login
app.post("/api/admin-login", (req, res) => {
    const { email, password } = req.body;

    const correctEmail = "admin@gmail.com";
    const correctPassword = "Admin@2025";

    if (email !== correctEmail) {
        return res.status(401).json({ field: "email", message: "Please Enter Correct Email" });
    }

    if (password !== correctPassword) {
        return res.status(401).json({ field: "password", message: "Please Enter Correct Password" });
    }

    const token = jwt.sign({ email, role: "admin" }, secretKey, { expiresIn: "1h" });
    return res.json({ message: "Login successful", token });
});

//Get all register user
app.get("/api/get-user", async (req, res) => {
    try {
        const findUser = await User.find();
        res.status(200).json({ message: "User Fetch Successfully!", findUser });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

//count User
app.get('/api/total-users', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        res.json({ totalUsers });
    } catch (error) {
        res.status(500).json({ message: "Error fetching total users", error });
    }
});

//add - ferrires
app.post("/api/add-ferries", async (req, res) => {
    try {
        const { name, ferryCode, classes, categories } = req.body;

        if (!name || !ferryCode || !classes || !categories) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingFerry = await Ferry.findOne({ ferryCode });
        if (existingFerry) {
            return res.status(400).json({ message: "Ferry code must be unique" });
        }

        const newFerry = new Ferry({ name, ferryCode, classes, categories });
        const savedFerry = await newFerry.save();

        res.status(201).json({ message: "Ferry added successfully", ferry: savedFerry });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//get-ferrires
app.get("/api/ferries", async (req, res) => {
    try {
        const ferries = await Ferry.find();
        res.status(200).json({ message: "Ferry Display successfully ", data: ferries });
    } catch (error) {
        res.status(500).json({ error: "Error retrieving ferries", details: error.message });
    }
});

//get-ferrires/id
app.get("/api/ferry/:ferryId", async (req, res) => {
    try {
        const { ferryId } = req.params;
        console.log("Received ferryId:", ferryId);

        if (!mongoose.Types.ObjectId.isValid(ferryId)) {
            return res.status(400).json({ error: "Invalid Ferry ID format" });
        }

        const ferry = await Ferry.findById(ferryId);
        if (!ferry) {
            return res.status(404).json({ error: "Ferry not found" });
        }

        res.status(200).json({ message: "Ferry fetched successfully", data: ferry });
    } catch (error) {
        console.error("Error retrieving ferry:", error.message);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

//update-ferrires
app.patch("/api/ferry/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedFerry = await Ferry.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

        if (!updatedFerry) {
            return res.status(404).json({ message: "Ferry not found" });
        }

        res.status(200).json(updatedFerry);
    } catch (error) {
        res.status(500).json({ message: "Error updating ferry", error: error.message });
    }
});

//delete -ferrires
app.delete("/api/delete-ferries/:id", async (req, res) => {
    try {
        const ferryId = req.params.id;

        const ferryToDelete = await Ferry.findById(ferryId);
        if (!ferryToDelete) {
            return res.status(400).json({ error: "Ferry Not Found!" });
        }

        await Ferry.findByIdAndDelete(ferryToDelete);
        res.status(200).json({ message: "Ferry deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting ferry", details: error.message });
    }
})

//count Ferry
app.get("/api/ferry-count", async (req, res) => {
    try {
        const totalFerries = await Ferry.countDocuments();
        res.json({ totalFerries });
    } catch (error) {
        console.error("Error fetching ferry count:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//add-schedules
app.post("/api/add-schedules", async (req, res) => {
    try {
        console.log("Received Data:", req.body);

        const {
            ferryName,
            from,
            to,
            departureDate,
            arrivalTime,
            tripType,
            returnDate,
            returnTime,
            onwardStatus,
            returnStatus
        } = req.body;

        
        if (!ferryName || !from || !to || !tripType) {
            return res.status(400).json({ error: "Missing required fields: ferryName, from, to, or tripType" });
        }

       
        if (tripType === "one-way") {
            if (!departureDate || !arrivalTime) {
                return res.status(400).json({ error: "Missing required fields for one-way trip: departureDate or arrivalTime" });
            }
        } else if (tripType === "round-trip") {
            if (!returnDate || !returnTime) {
                return res.status(400).json({ error: "Missing required fields for round-trip: returnDate or returnTime" });
            }
        } else {
            return res.status(400).json({ error: "Invalid trip type" });
        }

        
        const ferry = await Ferry.findOne({ name: ferryName });
        if (!ferry) {
            return res.status(404).json({ error: "Ferry not found" });
        }

        
        const scheduleData = {
            ferry: ferry._id,
            from,
            to,
            tripType
        };

        if (tripType === "one-way") {
            scheduleData.departureDate = new Date(departureDate);
            scheduleData.arrivalTime = arrivalTime;
            scheduleData.onwardStatus = onwardStatus || "scheduled"; 
        }

        if (tripType === "round-trip") {
            scheduleData.returnDate = new Date(returnDate);
            scheduleData.returnTime = returnTime;
            scheduleData.returnStatus = returnStatus || "scheduled"; 
        }

        const newSchedule = new Schedule(scheduleData);

        console.log("Saving Schedule:", newSchedule);
        await newSchedule.save();

        res.status(201).json({ message: "Schedule added successfully", data: newSchedule });

    } catch (error) {
        console.error("Error adding schedule:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//get-schedules
app.get("/api/get-schedules", async (req, res) => {
    try {
        const { tripType } = req.query;

        let query = {};
        if (tripType && tripType !== "all") {
           
            if (tripType !== "one-way" && tripType !== "round-trip") {
                return res.status(400).json({ error: "Invalid tripType value. Must be 'one-way', 'round-trip', or 'all'." });
            }
            query.tripType = tripType;
        }
      

        const schedules = await Schedule.find(query);
        res.status(200).json(schedules);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving schedules", details: error.message });
    }
});

//get-one-way
app.get("/api/one-way", async (req, res) => {
    try {
        const { from, to, departureDate } = req.query;

        if (!from || !to || !departureDate) {
            return res.status(400).json({ error: "Missing required query parameters" });
        }

        console.log("Query Params:", { from, to, departureDate });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const userDate = new Date(departureDate);
        userDate.setHours(0, 0, 0, 0);

        if (userDate < today) {
            return res.status(400).json({ error: "Cannot select past dates" });
        }

        const startOfDay = new Date(userDate);
        const endOfDay = new Date(userDate);
        endOfDay.setDate(endOfDay.getDate() + 1);

        const query = {
            from,
            to,
            departureDate: {
                $gte: startOfDay,
                $lt: endOfDay,
            },
        };

        console.log("Database Query:", query);

        const schedules = await Schedule.find(query).populate("ferry");

        console.log("Schedules Found:", schedules.length);

        res.status(200).json({ message: "One-Way Trip", data: schedules });
    } catch (error) {
        console.error("Error fetching one-way trips:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//get-round-trip
app.get("/api/round-trip", async (req, res) => {
    try {
        const { from, to, returnDate } = req.query;

        if (!from || !to || !returnDate) {
            return res.status(400).json({ error: "Missing required query parameters" });
        }

        console.log("Fetching Round-Trips:", { from, to, returnDate });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const returnTripDate = new Date(returnDate);
        if (returnTripDate < today) {
            return res.status(400).json({ error: "Cannot select past return dates" });
        }

        const startOfDay = new Date(returnDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(returnDate);
        endOfDay.setHours(23, 59, 59, 999);

        const returnTrips = await Schedule.find({
            from: to,
            to: from,
            tripType: "round-trip",
            returnDate: { $gte: startOfDay, $lte: endOfDay }
        }).populate("ferry");

        console.log("Round-Trip Results Found:", returnTrips.length);

        if (returnTrips.length === 0) {
            return res.status(404).json({ error: "No return trips found" });
        }

        res.status(200).json({ returnTrips });

    } catch (error) {
        console.error("Error fetching return trips:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// get - schedules by id
app.get("/api/get-schedule/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Find the schedule by ID
        const schedule = await Schedule.findById(id).populate("ferry");

        if (!schedule) {
            return res.status(404).json({ success: false, message: "Schedule not found" });
        }

        res.status(200).json({ success: true, status: schedule.status, schedule });
    } catch (error) {
        console.error("Error fetching schedule:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

//update schedules
app.patch("/api/schedules/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updateFields = req.body;

        let existingSchedule = await Schedule.findById(id);
        if (!existingSchedule) {
            return res.status(404).json({ message: "Schedule not found" });
        }

        const tripType = updateFields.tripType || existingSchedule.tripType;

        if (tripType === 'one-way') {
            if (!updateFields.departureDate && !existingSchedule.departureDate) {
                return res.status(400).json({ message: "departureDate is required for one-way trips" });
            }
            if (!updateFields.arrivalTime && !existingSchedule.arrivalTime) {
                return res.status(400).json({ message: "arrivalTime is required for one-way trips" });
            }
            if (!updateFields.onwardStatus && !existingSchedule.onwardStatus) {
                return res.status(400).json({ message: "onwardStatus is required for one-way trips" });
            }

            delete updateFields.returnDate;
            delete updateFields.returnTime;
            delete updateFields.returnStatus;
        } else if (tripType === 'round-trip') {
            if (!updateFields.returnDate && !existingSchedule.returnDate) {
                return res.status(400).json({ message: "returnDate is required for round-trip" });
            }
            if (!updateFields.returnTime && !existingSchedule.returnTime) {
                return res.status(400).json({ message: "returnTime is required for round-trip" });
            }
            if (!updateFields.returnStatus && !existingSchedule.returnStatus) {
                return res.status(400).json({ message: "returnStatus is required for round-trip" });
            }

            delete updateFields.departureDate;
            delete updateFields.arrivalTime;
            delete updateFields.onwardStatus;
        }

        const updatedSchedule = await Schedule.findByIdAndUpdate(id, updateFields, {
            new: true,
            runValidators: true,
        });

        res.status(200).json(updatedSchedule);
    } catch (error) {
        console.error("Error updating schedule:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

//delete schedules
app.delete("/api/schedules/:id", async (req, res) => {
    try {
        const scheduleId = req.params.id;

        const schedule = await Schedule.findById(scheduleId);
        if (!schedule) {
            return res.status(404).json({ error: "Schedule not found" });
        }

        await Schedule.findByIdAndDelete(scheduleId);

        res.status(200).json({ message: "Schedule deleted successfully" });
    } catch (error) {
        console.error("Error deleting schedule:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//count Schedule
app.get("/api/schedule-count", async (req, res) => {
    try {
        const totalSchedule = await Schedule.countDocuments();
        res.json({ totalSchedule });
    } catch (error) {
        console.error("Error fetching schedule count:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/api/ferry/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Fetching ferry details for ID:", id);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid ferry ID format" });
        }

        const ferry = await Ferry.findById(id)
            .populate("categories")
            .populate("classes")
            .populate("seats");

        if (!ferry) {
            return res.status(404).json({ success: false, message: "Ferry not found" });
        }

        const schedules = await Schedule.find({ ferry: id }).populate("ferry");

        console.log("Fetched Schedules:", schedules);

        const bookedSeats = await Booking.find({ ferryId: id }).select("seatNumber");
        const bookedSeatNumbers = bookedSeats.map(seat => seat.seatNumber);

        ferry.classes.forEach(ferryClass => {
            ferryClass.seats.forEach(seat => {
                seat.isBooked = bookedSeatNumbers.includes(seat.seatNumber);
            });
        });

        res.status(200).json({ success: true, ferry, schedules });

    } catch (error) {
        console.error("Error fetching ferry:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

app.post("/api/book-seat", authenticationToken, async (req, res) => {
    try {
        const {
            ferryId,
            className,
            seatNumber,
            category,
            passengers,
            contactNumber,
            proofType,
            proofNumber,
            totalAmount,
            vehicles
        } = req.body;

        const userId = req.user.id;

        // Check ferry
        const ferry = await Ferry.findById(ferryId);
        if (!ferry) {
            return res.status(404).json({ error: "Ferry not found" });
        }

        // Check class
        const ferryClass = ferry.classes.find(cls => cls.name === className);
        if (!ferryClass) {
            return res.status(400).json({ error: "Class not found" });
        }

        // Check seat
        const seat = ferryClass.seats.find(s => s.seatNumber === seatNumber);
        if (!seat) {
            return res.status(400).json({ error: "Seat not found" });
        }

        if (seat.isBooked) {
            return res.status(400).json({ error: "Seat already booked" });
        }

        // Get schedule
        const schedule = await Schedule.findOne({
            ferry: ferryId,
            $or: [
                { departureDate: { $gte: new Date() } },
                { returnDate: { $exists: true, $gte: new Date() } }
            ]
        }).sort({ departureDate: 1 });


        if (!schedule) {
            return res.status(404).json({ error: "No upcoming schedule found for this ferry" });
        }

        // Validate passengers
        if (!Array.isArray(passengers) || passengers.length === 0) {
            return res.status(400).json({ error: "Passenger details are required" });
        }

        // Validate vehicles
        if (!Array.isArray(vehicles)) {
            return res.status(400).json({ error: "Vehicles must be an array" });
        }

        for (const vehicle of vehicles) {
            const { vehicleType, vehicleName, vehicleNumber } = vehicle;
            if (!vehicleType || !vehicleName || !vehicleNumber) {
                return res.status(400).json({ error: "Each vehicle must include type, name, and number" });
            }
        }

        // Mark seat as booked
        seat.isBooked = true;
        await ferry.save();

        // Create booking
        const newBooking = new Booking({
            userId,
            ferryId,
            scheduleId: schedule._id,
            category,
            className,
            seatNumber,
            passengers,
            vehicles, // <-- vehicles with vehicleType, vehicleName, vehicleNumber
            contactNumber,
            proofType,
            proofNumber,
            totalAmount,
        });

        await newBooking.save();

        res.status(201).json({
            message: "Booking successful",
            bookingId: newBooking._id
        });

    } catch (error) {
        console.error("❌ Error booking seat:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//My - Booking
app.get("/api/my-bookings", authenticationToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const bookings = await Booking.find({ userId })
            .populate("ferryId", "name")
            .populate("scheduleId", "from to tripType departureDate arrivalTime returnDate returnTime");

        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// E - Ticket
app.get("/api/ticket/:bookingId", async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId)
            .populate("ferryId")
            .populate("scheduleId");

        if (!booking) return res.status(404).json({ message: "Booking not found" });

        // Create a temporary file path to save the PDF
        const tempPath = path.join('temp', `ticket_${booking._id}.pdf`);

        // Ensure temp directory exists
        if (!fs.existsSync('temp')) fs.mkdirSync('temp');

        await generateTicketPDF(booking, tempPath);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename=ticket_${booking._id}.pdf`);

        const stream = fs.createReadStream(tempPath);
        stream.pipe(res);

        // Clean up the file after sending
        stream.on('end', () => fs.unlink(tempPath, () => { }));

    } catch (err) {
        console.error("Error generating ticket:", err);
        res.status(500).json({ message: "Failed to generate ticket" });
    }
});

app.get("/api/bookings/:id", async (req, res) => {
    try {
        const bookingId = req.params.id;

        // Check if bookingId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({ error: "Invalid booking ID" });
        }

        // Fetch the booking details from the database
        const booking = await Booking.findById(bookingId).populate('ferryId');

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        // Return the booking details
        res.status(200).json({
            bookingId: booking._id,
            ferryName: booking.ferryId.name,  // Ensure the ferryName is included
            category: booking.category,
            className: booking.className,
            seatNumber: booking.seatNumber,
            passengers: booking.passengers,
            contactNumber: booking.contactNumber,
            proofType: booking.proofType,
            proofNumber: booking.proofNumber,
            totalAmount: booking.totalAmount,
            ticketPath: `/tickets/${booking._id}.pdf`,  // Path to the generated ticket
        });
    } catch (error) {
        console.error("❌ Error fetching booking:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/api/bookings", async (req, res) => {
    try {
        const bookings = await Booking.find().populate('ferryId').populate('scheduleId'); 
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//get-book
app.get("/api/booked-seats/:ferryId", async (req, res) => {
    try {
        const { ferryId } = req.params;
        const ferry = await Ferry.findById(ferryId);
        if (!ferry) return res.status(404).json({ error: "Ferry not found" });

        // Get booked seats from all classes
        const bookedSeats = ferry.classes.flatMap(cls =>
            cls.seats.filter(seat => seat.isBooked).map(seat => seat.seatNumber)
        );

        res.json({ bookedSeats });
    } catch (error) {
        console.error("Error fetching booked seats:", error);
        res.status(500).json({ error: "Server error" });
    }
});

//add feedBack
app.post("/api/feedback", async (req, res) => {
    try {
        const { fullName, email, rating, review } = req.body;

        if (!fullName || !email || !rating || !review) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newFeedback = new Feedback({ fullName, email, rating, review });

        await newFeedback.save();
        res.status(201).json({ message: "Feedback submitted successfully." });

    } catch (error) {
        console.error("Error saving feedback:", error);
        res.status(500).json({ message: "Server error.", error });
    }
});

//get feedback
app.get("/api/get-feedback", async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: "Server error.", error });
    }
});

//count feedback
app.get("/api/total-feedback", async (req, res) => {
    try {
        const totalFeedback = await Feedback.countDocuments();
        res.json({ totalFeedback });
    } catch (error) {
        console.error("Error fetching contact count:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// delete feedback
app.delete("/api/feedback/:id", async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);
        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }
        res.status(200).json({ message: "Feedback deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error });
    }
});

// add Contact
app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        const newContact = new Contact({ name, email, phone, message });
        await newContact.save();
        res.status(201).json({ success: true, message: "Contact submitted successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, error: "Failed to submit contact" });
    }
});

// get Contact
app.get("/api/get-contacts", async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ success: false, error: "Failed to fetch contacts" });
    }
});

// get-from location
app.get("/api/from-locations", async (req, res) => {
    try {
        const locations = await Schedule.distinct("from");

        res.status(200).json({ locations });
    } catch (error) {
        console.error("Error fetching locations:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// get -to location
app.get("/api/to-locations", async (req, res) => {
    try {
        const locations = await Schedule.distinct("to");

        res.status(200).json({ locations });
    } catch (error) {
        console.error("Error fetching locations:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//char for booking api
app.get('/api/Bookingcount', async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        res.status(200).json({ totalBookings });
    } catch (error) {
        console.error("Error counting bookings:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// using chart
app.get("/api/booking-distribution", async (req, res) => {
    try {
        const data = await Booking.aggregate([
            {
                $group: {
                    _id: "$className",
                    total: { $sum: 1 }
                }
            }
        ]);

        // Convert _id to name for frontend
        const formatted = data.map(item => ({
            name: item._id,
            value: item.total
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch booking distribution", error });
    }
});

// Payment API(Cashfree)
app.post('/api/payment/create-order', async (req, res) => {
    try {
        const { userId, ferryId, amount, bookingId } = req.body;

        // Validate token
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Missing authentication token' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, secretKey); // Replace with your JWT secret
        } catch (error) {
            return res.status(401).json({ success: false, message: 'Invalid or expired token' });
        }

        // Verify userId matches token
        if (decoded.userId !== userId && decoded.id !== userId && decoded.sub !== userId) {
            return res.status(403).json({ success: false, message: 'User ID does not match authenticated user' });
        }

        // Validate required fields
        if (!userId || !ferryId || !amount || !bookingId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: userId, ferryId, amount, and bookingId are required'
            });
        }

        // Validate amount
        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be greater than 0'
            });
        }

        const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const request = {
            order_amount: amount,
            order_currency: 'INR',
            order_id: orderId,
            customer_details: {
                customer_id: userId,
                customer_name: 'Customer Name', // Fetch from User model
                customer_email: 'customer@example.com', // Fetch from User model
                customer_phone: '9999999999', // Fetch from User model
            },
            order_meta: {
                return_url: `http://localhost:5173/paymentStatus?order_id=${orderId}&booking_id=${bookingId}`
            },
        };

        const response = await axios.post(
            process.env.CASHFREE_ENVIRONMENT === 'sandbox'
                ? 'https://sandbox.cashfree.com/pg/orders'
                : 'https://api.cashfree.com/pg/orders',
            request,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-version': '2023-08-01',
                    'x-client-id': process.env.CASHFREE_CLIENT_ID,
                    'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
                },
            }
        );

        const bookingPayment = new BookingPayment({
            userId,
            bookingId,
            ferryId,
            amount,
            orderId,
            paymentStatus: 'PENDING'
        });

        await bookingPayment.save();

        res.json({
            success: true,
            paymentSessionId: response.data.payment_session_id,
            orderId,
            bookingId
        });
    } catch (error) {
        console.error('Error creating order:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment order',
            error: error.response?.data?.message || error.message
        });
    }
});

// Verify Payment
app.post('/api/payment/verify-payment', async (req, res) => {
    try {
        const { bookingId } = req.body;

        if (!bookingId) {
            return res.status(400).json({ success: false, message: 'Missing bookingId' });
        }

        const bookingPayment = await BookingPayment.findOne({ bookingId });
        if (!bookingPayment) {
            return res.status(404).json({ success: false, message: 'Payment record not found' });
        }

        const booking = await Booking.findById(bookingId).populate('ferryId scheduleId userId');
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (bookingPayment.emailSent) {
            return res.status(200).json({
                success: true,
                status: bookingPayment.paymentStatus,
                bookingId,
                orderId: bookingPayment.orderId,
                message: 'Email already sent for this payment',
            });
        }

        const url = process.env.CASHFREE_ENVIRONMENT === 'sandbox'
            ? `https://sandbox.cashfree.com/pg/orders/${bookingPayment.orderId}/payments`
            : `https://api.cashfree.com/pg/orders/${bookingPayment.orderId}/payments`;

        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-version': '2023-08-01',
                'x-client-id': process.env.CASHFREE_CLIENT_ID,
                'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
            },
        });

        const payments = Array.isArray(response.data) ? response.data : response.data.payments || [];
        if (!payments.length) {
            return res.status(400).json({ success: false, message: 'No payments found' });
        }

        const status = payments.some(tx => tx.payment_status === "SUCCESS") ? "SUCCESS" : "FAILED";

        if (status === "SUCCESS") {
            // Atomic update: Only update if emailSent is false to avoid race condition
            const updatedPayment = await BookingPayment.findOneAndUpdate(
                { bookingId, emailSent: false },
                { $set: { paymentStatus: "SUCCESS", emailSent: true } },
                { new: true }
            );

            if (!updatedPayment) {
                // Email already sent or paymentStatus already updated by another process
                return res.status(200).json({
                    success: true,
                    status: "SUCCESS",
                    bookingId,
                    orderId: bookingPayment.orderId,
                    message: "Email already sent or payment status updated",
                });
            }

            const tempDir = os.tmpdir();
            const outputPath = path.join(tempDir, `Ticket-${bookingId}.pdf`);

            await generateTicketPDF(booking, outputPath);
            await sendTicket(booking.userId.email, bookingId, outputPath);
        }

        res.status(200).json({
            success: true,
            status,
            bookingId,
            orderId: bookingPayment.orderId,
            message: status === "SUCCESS" ? 'Payment verified and ticket sent' : 'Payment verification failed',
        });
    } catch (error) {
        console.error('Payment verification error:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Stripe Payment(Optional)
app.post("/api/checkout", async (req, res) => {
    const { amount, description } = req.body;
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: description,
                        },
                        unit_amount: amount * 100, // amount in paise
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `http://localhost:5173/payment-success`,
            cancel_url: "http://localhost:5173/payment-cancel",
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Stripe Checkout Error:", error);
        res.status(500).json({ error: "Failed to initiate Stripe checkout" });
    }
});

// Create Order
// app.post('/api/payment/create-order', async (req, res) => {
//     try {
//         const { userId, ferryId, amount } = req.body;
//         const orderId = `order_${Date.now()}`;

//         const request = {
//             order_amount: amount,
//             order_currency: 'INR',
//             order_id: orderId,
//             customer_details: {
//                 customer_id: userId,
//                 customer_name: 'Customer Name',
//                 customer_email: 'customer@example.com',
//                 customer_phone: '9999999999',
//             },
//             order_meta: {
//                 return_url: `http://localhost:5173/paymentStatus?order_id=${orderId}`
//             },

//         };

//         const response = await axios.post(
//             process.env.CASHFREE_ENVIRONMENT === 'sandbox'
//                 ? 'https://sandbox.cashfree.com/pg/orders'
//                 : 'https://api.cashfree.com/pg/orders',
//             request,
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'x-api-version': '2023-08-01', // Use the latest API version from Cashfree docs
//                     'x-client-id': process.env.CASHFREE_CLIENT_ID,
//                     'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
//                 },
//             }
//         );

//         const booking = new BookingPayment({
//             userId,
//             ferryId,
//             amount,
//             orderId,
//         });
//         await booking.save();

//         res.json({ success: true, paymentSessionId: response.data.payment_session_id, orderId });
//     } catch (error) {
//         console.error('Error creating order:', error.response?.data || error.message);
//         res.status(500).json({ success: false, message: error.message });
//     }
// });

// Verify Payment (Optional, if needed)
// app.post('/api/payment/verify-payment', async (req, res) => {
//     try {
//         const { orderId } = req.body;
//         console.log("Received orderId:", orderId);

//         if (!orderId) {
//             return res.status(400).json({ success: false, message: 'Missing orderId' });
//         }

//         const url = process.env.CASHFREE_ENVIRONMENT === 'sandbox'
//             ? `https://sandbox.cashfree.com/pg/orders/${orderId}/payments`
//             : `https://api.cashfree.com/pg/orders/${orderId}/payments`;

//         const response = await axios.get(url, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'x-api-version': '2023-08-01',
//                 'x-client-id': process.env.CASHFREE_CLIENT_ID,
//                 'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
//             },
//         });

//         console.log("Full Cashfree response:", response.data);
//         const payments = Array.isArray(response.data) ? response.data : response.data.payments || [];

//         if (!payments || payments.length === 0) {
//             return res.status(400).json({ success: false, message: 'No payments found' });
//         }

//         let status = 'Failure';
//         const paymentStatuses = payments.map(tx => tx.payment_status);
//         console.log("Payment statuses:", paymentStatuses);

//         if (payments.some(tx => tx.payment_status === "SUCCESS")) {
//             status = "Success";
//         } else if (payments.some(tx => tx.payment_status === "PENDING")) {
//             status = "Pending";
//             setTimeout(async () => {
//                 const retryResponse = await axios.get(url, { headers });
//                 const retryPayments = Array.isArray(retryResponse.data) ? retryResponse.data : retryResponse.data.payments || [];
//                 if (retryPayments.some(tx => tx.payment_status === "SUCCESS")) {
//                     await BookingPayment.updateOne({ orderId }, { paymentStatus: "Success" });
//                 }
//             }, 5000);
//         }


//         const updateResult = await BookingPayment.updateOne({ orderId }, { paymentStatus: status });
//         console.log("Update result:", updateResult);

//         return res.status(200).json({ success: true, status, payments });
//     } catch (error) {
//         console.error('Error verifying payment:', error.response?.data || error.message);
//         return res.status(500).json({
//             success: false,
//             message: 'Server error during verification',
//             error: error.response?.data || error.message,
//         });
//     }
// });


const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
