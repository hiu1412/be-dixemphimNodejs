import mongoose from 'mongoose';
import env from '../common/env.js';

const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI);
        console.log("Konichiwa MongoDB");
    } catch (error) {
        console.error('BaiBai MongoDB', error.message);
    }
};

export default connectDB
