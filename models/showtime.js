import mongoose from 'mongoose';

const showtimeSchema = new mongoose.Schema({
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    screen: { type: mongoose.Schema.Types.ObjectId, ref: 'Screen', required: true },
    startTime: { type: Date, required: true }, // Thời gian bắt đầu
    endTime: { type: Date, required: true }, // Thời gian kết thúc
    price: { type: Number, required: true }, // Giá vé
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },

});

const Showtime = mongoose.model('Showtime', showtimeSchema);
export default Showtime;