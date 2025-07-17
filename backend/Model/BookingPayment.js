import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  ferryId: { type: String, required: true },
  amount: { type: Number, required: true },
  orderId: { type: String },
  paymentStatus: { type: String, default: 'PENDING' },
  emailSent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const BookingPayment = mongoose.model('Payment', bookingSchema);
export default BookingPayment;
