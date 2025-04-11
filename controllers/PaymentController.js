import axios from "axios";
import dotenv from "dotenv";
import Booking from "../models/booking.js";  // Import model Booking
import Payment from "../models/payment.js";  // Import model Payment

dotenv.config();  // Nạp các biến môi trường từ .env


// API để tạo thanh toán
const createPayment = async (req, res) => {
  const { amount, paymentMethod, cardDetails, bookingId } = req.body;

  // Kiểm tra nếu thông tin thanh toán đầy đủ
  if (!amount || !paymentMethod || !cardDetails || !bookingId) {
    return res.status(400).json({
      success: false,
      message: "Thiếu thông tin thanh toán.",
    });
  }

  // Lấy thông tin booking từ ID
  const booking = await Booking.findById(bookingId).populate("showtime").populate("user");
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking không tồn tại",
    });
  }

  // Cấu hình thông tin thanh toán
  const paymentData = {
    client_id: process.env.PAYOS_CLIENT_ID,  // Lấy Client ID từ .env
    amount: amount,  // Số tiền thanh toán
    currency: "VND",  // Hoặc 'USD', tùy theo yêu cầu của bạn
    payment_method: paymentMethod,  // Phương thức thanh toán (thẻ tín dụng, ví điện tử...)
    card_details: cardDetails,  // Thông tin chi tiết thẻ (nếu là thẻ tín dụng)
    checksum_key: process.env.PAYOS_CHECKSUM_KEY,  // Checksum key từ PayOS
    api_key: process.env.PAYOS_API_KEY,  // API key từ PayOS
  };

  try {
    // Gửi yêu cầu thanh toán tới PayOS
    const response = await axios.post(
      "https://api-merchant.payos.vn/v2/payment-requests",
      paymentData
    );

    // Kiểm tra kết quả trả về từ PayOS
    if (response.data.status === "success") {
      // Lưu thông tin thanh toán vào cơ sở dữ liệu
      const payment = new Payment({
        bookingId: bookingId,  // Liên kết với Booking
        amount: amount,
        currency: "VND",
        paymentMethod: paymentMethod,
        paymentStatus: "completed",  // Nếu thanh toán thành công
        paymentId: response.data.paymentId,  // ID thanh toán từ PayOS
      });

      await payment.save();  // Lưu thông tin thanh toán vào MongoDB

      res.status(200).json({
        success: true,
        message: "Thanh toán thành công",
        paymentDetails: response.data,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Thanh toán thất bại",
        error: response.data.error,
      });
    }
  } catch (error) {
    console.error("Lỗi khi thanh toán:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi thanh toán",
      error: error.message,
    });
  }
};

export { createPayment };
