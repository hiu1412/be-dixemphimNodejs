import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    duration: {type: Number, required: true},
    poster: {type: String, required: false},
    director: {type: String, required: true},
    rating: {type: Number, required: true},
    showtime: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true }], // Tham chiếu đến model Showtime
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
})

const Movie = mongoose.model("Movie", movieSchema );
export default Movie;