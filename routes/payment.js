import express from 'express';
import { createPayment } from '../controllers/PaymentController.js';  // Import hàm createPayment từ controller

const paymentRouter = express.Router();

// Route để tạo payment link (thanh toán)
paymentRouter.post('/pay', createPayment);

export default paymentRouter;
