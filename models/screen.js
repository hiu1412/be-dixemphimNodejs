import mongoose from 'mongoose';

const screenSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    type: { type: String, required: true }, 
    capacity: { type: Number, required: true }, // Sức chứa của phòng chiếu
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
});

const Screen = mongoose.model('Screen', screenSchema);
export default Screen;