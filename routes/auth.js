import express from 'express';
import { register, login, logout, refreshToken, verifyPasswordToken,resetUserPassword,authenticateEmailCode } from '../controllers/AuthController.js';
import { getUser } from '../controllers/AuthController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const authRouter = express.Router();


authRouter.post("/register", register);{
try {
    // Logic đăng ký người dùng
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error); // Ghi lại lỗi chi tiết
    res.status(500).json({ success: false, message: 'Đã có lỗi xảy ra trong quá trình đăng ký.' });
  }}
authRouter.get("/me",authMiddleware, getUser);
authRouter.post("/login", login);
authRouter.post("/logout", authMiddleware, logout); // Thêm route logout

authRouter.post("/refresh-token", refreshToken);

authRouter.post("/verify-reset-password-token/:passwordToken", verifyPasswordToken);
authRouter.post("/reset-password/:token", resetUserPassword);
authRouter.post("/verify-email-code", authenticateEmailCode);

export default authRouter;