import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    bookingId: { type: mongoose.Schema.Types.ObjectId, required: true },
    seatId: { type: mongoose.Schema.Types.ObjectId, required: true },
    ticketCode: { type: String, unique: true, required: true },
    movie: { type: mongoose.Schema.Types.ObjectId, required: true },
    screen: { type: mongoose.Schema.Types.ObjectId, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    price: { type: Number, required: true },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
});

export default mongoose.model('Ticket', ticketSchema);

