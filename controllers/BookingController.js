import { createBooking, confirmPayment, cancelBooking, getUserBookings } from '../services/bookingService.js';

// Tạo booking mới
const createNewBooking = async (req, res) => {
    try {
        const { showtimeId, seatIds } = req.body;
        const userId = req.user.userId; // Fix: sử dụng userId từ decoded token

        const booking = await createBooking(userId, showtimeId, seatIds);

        res.status(201).json({
            success: true,
            message: "Đặt vé thành công, vui lòng thanh toán trong vòng 15 phút",
            data: booking
        });

    } catch (error) {
        console.error('Lỗi khi tạo booking:', error);
        res.status(error.message.includes("không") ? 400 : 500).json({
            success: false,
            message: error.message || "Lỗi khi tạo booking"
        });
    }
};

// Xác nhận thanh toán và tạo ticket
const confirmBookingPayment = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const result = await confirmPayment(bookingId);

        res.json({
            success: true,
            message: "Thanh toán thành công",
            data: result
        });

    } catch (error) {
        console.error('Lỗi khi xác nhận thanh toán:', error);
        res.status(error.message.includes("không") ? 400 : 500).json({
            success: false,
            message: error.message || "Lỗi khi xác nhận thanh toán"
        });
    }
};

// Hủy booking
const cancelUserBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.user.userId; // Fix: sử dụng userId từ decoded token

        await cancelBooking(bookingId, userId);

        res.json({
            success: true,
            message: "Hủy đặt vé thành công"
        });

    } catch (error) {
        console.error('Lỗi khi hủy booking:', error);
        res.status(error.message.includes("không") ? 400 : 500).json({
            success: false,
            message: error.message || "Lỗi khi hủy booking"
        });
    }
};

// Lấy danh sách booking của user
const getBookingsForUser = async (req, res) => {
    try {
        const userId = req.user.userId; // Fix: sử dụng userId từ decoded token
        const bookings = await getUserBookings(userId);

        res.json({
            success: true,
            data: bookings
        });

    } catch (error) {
        console.error('Lỗi khi lấy danh sách booking:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Lỗi khi lấy danh sách booking"
        });
    }
};

export { createNewBooking, confirmBookingPayment, cancelUserBooking, getBookingsForUser };