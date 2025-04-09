import express from 'express';
import { createBooking, getBookingsByUser, getBookingById, cancelBooking } from '../controllers/BookingController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const bookingRouter = express.Router();

// Tạo booking mới
bookingRouter.post("/", authMiddleware, createBooking);

// Lấy danh sách booking của người dùng
bookingRouter.get("/user/:userId", authMiddleware, getBookingsByUser);

// Lấy thông tin chi tiết của booking
bookingRouter.get("/:id", authMiddleware, getBookingById);

// Hủy booking
bookingRouter.delete("/:id", authMiddleware, cancelBooking);

export default bookingRouter;
