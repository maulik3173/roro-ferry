import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  otpExpires: Date, 
});

const modelOtp = mongoose.model("OTP", otpSchema);

export default modelOtp;