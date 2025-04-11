
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",  // Liên kết với model Booking
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    default: "pending",  // Trạng thái thanh toán, ví dụ: pending, completed, failed
  },
  paymentId: {
    type: String,  // ID thanh toán từ PayOS
    required: true,
  },
}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
