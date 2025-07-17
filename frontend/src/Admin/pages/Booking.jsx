import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

const AllBookings = () => {
    const [groupedBookings, setGroupedBookings] = useState({});

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/bookings");

                const grouped = res.data.reduce((acc, booking) => {
                    const ferryName = booking.ferryId?.name || "Unknown Ferry";
                    if (!acc[ferryName]) {
                        acc[ferryName] = [];
                    }
                    acc[ferryName].push(booking);
                    return acc;
                }, {});

                setGroupedBookings(grouped);
            } catch (err) {
                console.error("Error fetching bookings:", err);
                alert("Failed to fetch bookings.");
            }
        };

        fetchBookings();
    }, []);

    const formatDate = (dateStr) => {
        return dateStr ? moment(dateStr).format("DD-MM-YYYY") : "N/A";
    };

    const formatTime = (timeStr) => {
        return timeStr ? moment(timeStr, "HH:mm").format("hh:mm A") : "N/A";
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">All Bookings Grouped by Ferry</h1>

            {Object.keys(groupedBookings).length === 0 ? (
                <p className="text-center text-gray-600">No bookings found.</p>
            ) : (
                Object.entries(groupedBookings).map(([ferryName, bookings]) => (
                    <div key={ferryName} className="mb-10">
                        <h2 className="text-2xl font-semibold text-indigo-700 border-b pb-2 mb-4">{ferryName}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bookings.map((booking) => {
                                const schedule = booking.scheduleId || {};
                                const isReturnTrip = schedule.tripType === "round-trip";

                                return (
                                    <div key={booking._id} className="p-5 rounded-xl shadow-md border bg-white">
                                        <p className="text-gray-700"><span className="font-semibold">Booking ID:</span> {booking._id}</p>
                                        <p className="text-gray-700"><span className="font-semibold">From:</span> {schedule.from || "N/A"}</p>
                                        <p className="text-gray-700"><span className="font-semibold">To:</span> {schedule.to || "N/A"}</p>
                                        <p className="text-gray-700"><span className="font-semibold">Trip Type:</span> {schedule.tripType || "N/A"}</p>

                                        {isReturnTrip ? (
                                            <>
                                                <p className="text-gray-700"><span className="font-semibold">Return Date:</span> {formatDate(schedule.returnDate)}</p>
                                                <p className="text-gray-700"><span className="font-semibold">Return Time:</span> {formatTime(schedule.returnTime)}</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-gray-700"><span className="font-semibold">Departure Date:</span> {formatDate(schedule.departureDate)}</p>
                                                <p className="text-gray-700"><span className="font-semibold">Departure Time:</span> {formatTime(schedule.arrivalTime)}</p>
                                            </>
                                        )}

                                        <p className="text-gray-700"><span className="font-semibold">Category:</span> {booking.category}</p>
                                        <p className="text-gray-700"><span className="font-semibold">Class:</span> {booking.className}</p>
                                        <p className="text-gray-700">
                                            <span className="font-semibold">Seats:</span>{" "}
                                            {Array.isArray(booking.seatNumber) ? booking.seatNumber.join(", ") : booking.seatNumber}
                                        </p>

                                        <div className="mt-3">
                                            <p className="font-semibold text-gray-800">Passenger(s):</p>
                                            <ul className="ml-4 list-disc text-gray-700">
                                                {booking.passengers.map((p, index) => (
                                                    <li key={index}>
                                                        {p.firstName} {p.lastName} (Age: {p.age}, Gender: {p.gender})
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="mt-3">
                                            <p className="text-gray-700"><span className="font-semibold">Contact Number:</span> {booking.contactNumber}</p>
                                            <p className="text-gray-700"><span className="font-semibold">Proof:</span> {booking.proofType} - {booking.proofNumber}</p>
                                        </div>

                                        <p className="mt-3 text-lg font-bold text-green-600">Total: ₹{booking.totalAmount}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default AllBookings;
