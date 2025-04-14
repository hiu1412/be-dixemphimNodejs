import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';
import emailRouter from './routes/email.js';
import movieRouter from './routes/movie.js';
import theatreRouter from './routes/theatre.js';
import screenRouter from './routes/screen.js';
import showtimeRouter from './routes/showtime.js';
import client from './config/redis.js';
import cookieParser from 'cookie-parser';
import seatRouter from './routes/seat.js';
import bookingRouter from './routes/booking.js';


dotenv.config();

//app config
const app = express();
const port = 4000;

app.use(cookieParser())

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true, 
}));

//connect DB
connectDB();

// Kiểm tra kết nối Redis
client.on('connect', () => {
    console.log("Redis client is ready to use!");
});

//api endpoint
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/email", emailRouter);
app.use("/movie", movieRouter);
app.use("/theatre", theatreRouter);
app.use("/screen", screenRouter);
app.use("/showtime", showtimeRouter);
app.use("/seat", seatRouter);
app.use("/booking", bookingRouter);

app.get("/", async (req, res) => {
    await client.set("message", "Hello from Redis!");
    const message = await client.get("message");
    res.send(`Redis says: ${message}`);
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
})