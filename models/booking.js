import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
    seats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Seat', required: true }], // Thêm array của seats
    bookingTime: { type: Date, default: Date.now },
    totalPrice: { type: Number, required: true },
    bookingCode: { type: String, unique: true, required: true },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled", "paid"],
        default: "pending",
        // pending: đã chọn ghế nhưng chưa thanh toán
        // confirmed: đã thanh toán, chờ xuất vé
        // paid: đã xuất vé (chuyển sang ticket)
        // cancelled: đã hủy
    },
    expiresAt: { type: Date, required: true }, // Thời gian hết hạn booking (VD: 15 phút)
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
});

// Tự động cancel booking nếu quá hạn thanh toán
bookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;