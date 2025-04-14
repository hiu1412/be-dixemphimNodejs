import express from 'express';
import { createNewBooking, confirmBookingPayment, cancelUserBooking, getBookingsForUser } from '../controllers/BookingController.js';
import authMiddleware from '../middleware/authMiddleware.js';
const bookingRouter = express.Router();

// API endpoints
bookingRouter.post('/', authMiddleware, createNewBooking); // Tạo booking mới
bookingRouter.post('/:bookingId/cancel',authMiddleware, cancelUserBooking); // Hủy booking
bookingRouter.get('/user',authMiddleware, getBookingsForUser); // Lấy danh sách booking của user

export default bookingRouter;