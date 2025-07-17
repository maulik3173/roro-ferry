import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Full Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"]
    },
    rating: { 
        type: Number,
        required: [true, "Rating is required"],
        min: 1,
        max: 5
    },
    review: {
        type: String,
        required: [true, "Review is required"],
        minlength: [10, "Review must be at least 10 characters long"]
    }
});

const Feedback = mongoose.model("Feedback", FeedbackSchema);
export default Feedback;
