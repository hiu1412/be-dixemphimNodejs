import createError from 'http-errors';
import { generateResetPasswordToken } from '../services/authService.js';
import env from '../common/env.js';
import { generateVerificationCode, sendEmail } from '../services/emailService.js';
import validator from 'validator'; // Thêm thư viện validator để kiểm tra email

const resetPassword = async (req, res) => {
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
        return res.status(400).json({ // Sử dụng 400 (Bad Request) thay vì createError.BadRequest()
            success: false,
            message: "Email không hợp lệ"
        });
    }

    const generatedTokenResult = await generateResetPasswordToken(email);

    if (!generatedTokenResult.success) {
        return res.status(400).json({ // Sử dụng 400 (Bad Request) thay vì createError["Bad Request"]
            success: false,
            message: generatedTokenResult.message,
        });
    }

    try {
        const resetDirectUrl = `http://localhost:5173/reset-password/${generatedTokenResult.token}`;

        await sendEmail({
            from: process.env.SMTP_SETTINGS_USER, // Sử dụng process.env thay vì env
            to: email,
            subject: "DIXEMPHIM - ĐẶT LẠI MẬT KHẨU",
            html: `<p>Nhấp vào <a href="${resetDirectUrl}">đây</a> để cập nhật mật khẩu của bạn!</p>`, // Sử dụng template literals
        });

        return res.status(200).json({ // Sử dụng 200 (OK) thay vì createError.OK()
            success: true,
            message: "Gửi email thành công",
        });
    } catch (error) {
        console.error("Lỗi gửi email:", error); // Log lỗi để debug
        return res.status(500).json({
            success: false,
            message: "Lỗi! Không thể gửi email",
            error: error.message, // Thêm thông tin lỗi để debug
        });
    }
};

//tao tokentoken
const generateEmailVerificationCode = async (req, res) => {
    const { email } = req.query;

    if (!email && !validator.isEmail(email)) {
        return res.status(createError["Bad Request"]).json({
            success: false,
            message: "Email không hợp lệ"
        });
    }
    try {
        const verificationCode = await generateVerificationCode(email);

        await sendEmail({
            from: env.SMTP_SETTINGS_USER,
            to: email,
            subject: "MANHLEN - KÍCH HOẠT TÀI KHOẢN EMAIL",
            html: `<p>Đây là mã xác thực để kích hoạt email của bạn: <b>${verificationCode}</b></p>`,
        });

        return res.status(createError.OK).json({
            success: true,
            message: "Gửi email thành công"
        });
    }
    catch (error) {
        if (createError.isHttpError(error) && error.status === 404) {
            // Nếu lỗi là NotFound (404) được tạo bởi http-errors
            return res.status(error.status).json({
                success: false,
                message: error.message
            });
        } else {
            // Xử lý các lỗi khác
            console.error("Lỗi khi gửi email:", error);
            return res.status(500).json({
                success: false,
                message: "Lỗi! Không thể gửi email"
            });
        }
    }
}

export { resetPassword, generateEmailVerificationCode }