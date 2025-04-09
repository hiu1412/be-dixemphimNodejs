import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
    screen: { type: mongoose.Schema.Types.ObjectId, ref: "Screen" }, // Tham chiếu đến model Screen
    row: { type: String, required: true }, 
    number: { type: Number, required: true },
    type: { type: String, enum: ["normal", "vip"], default: "normal" }, 
    isAvailable: { type: Boolean, default: true }, // Trạng thái ghế (có sẵn hay không)
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
});

const Seat = mongoose.model("Seat", seatSchema);
export default Seat;