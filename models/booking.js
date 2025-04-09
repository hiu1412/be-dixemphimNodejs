import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Tham chiếu đến model User
    showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true }, // Tham chiếu đến model Showtime
    bookingTime: { type: Date, default: Date.now }, // Thời gian đặt vé
    totalPrice: { type: Number, required: true }, // Tổng giá vé
    bookingCode: { type: String, unique: true, required: true }, // Mã đặt vé duy nhất
    status: { 
        type: String, 
        enum: ["pending", "confirmed", "cancelled", "paid"], 
        default: "pending" // Trạng thái đặt vé
    },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;