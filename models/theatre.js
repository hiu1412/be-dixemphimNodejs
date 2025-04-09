import mongoose from 'mongoose';

const theatreSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true }, 
    city: { type: String, required: true }, 
    screen: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Screen', required: true }], 
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now }
});

const Theatre = mongoose.model("Theatre", theatreSchema);

export default Theatre;