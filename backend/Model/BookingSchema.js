import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ferryId: { type: mongoose.Schema.Types.ObjectId, ref: "Ferry", required: true },
  scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Schedule", required: true },
  category: { type: String, required: true },
  className: { type: String, required: true },
  seatNumber: { type: String, required: true },
  passengers: [
    {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      gender: { type: String, required: true },
      age: { type: Number, required: true },
    },
  ],
  vehicles: [
    {
      vehicleType: { type: String, required: true },
      vehicleName: { type: String, required: true },
      vehicleNumber: { type: String, required: true },
    },
  ],
  contactNumber: { type: String, required: true },
  proofType: { type: String, required: true },
  proofNumber: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  orderId: { type: String },
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;