import Booking from "../models/booking.js";
import Ticket from "../models/ticket.js";
import Seat from "../models/seat.js";
import Showtime from "../models/showtime.js";

const createBooking = async (req, res) => {
    try {
        const { userId, showtimeId, seatIds } = req.body;

        // Kiểm tra xem showtime có tồn tại không
        const showtime = await Showtime.findById(showtimeId);
        if (!showtime) {
            return res.status(404).json({ success: false, message: "Lịch chiếu không tồn tại" });
        }

        // Kiểm tra xem các ghế có hợp lệ không
        const seats = await Seat.find({ '_id': { $in: seatIds } });
        if (seats.length !== seatIds.length) {
            return res.status(400).json({ success: false, message: "Một hoặc nhiều ghế không hợp lệ" });
        }

        // Tính tổng giá vé
        const totalPrice = seats.reduce((sum, seat) => sum + showtime.price, 0);

        // Tạo booking
        const booking = new Booking({
            user: userId,
            showtime: showtimeId,
            totalPrice,
            bookingCode: `BOOK-${Date.now()}`,
            status: "pending",
        });
        await booking.save();

        // Tạo vé cho mỗi ghế đã chọn
        const tickets = seats.map(seat => ({
            bookingId: booking._id,
            seatId: seat._id,
            ticketCode: `TICKET-${Date.now()}-${seat._id}`,
            movie: showtime.movie,
            screen: showtime.screen,
            startTime: showtime.startTime,
            endTime: showtime.endTime,
            price: showtime.price,
        }));

        await Ticket.insertMany(tickets);

        res.status(201).json({ success: true, booking, tickets });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Lỗi khi tạo booking", error: error.message });
    }
};
const getBookingsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Lấy danh sách các booking của người dùng
        const bookings = await Booking.find({ user: userId }).populate('showtime').populate('user');
        
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Lỗi khi lấy danh sách booking", error: error.message });
    }
};
const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        // Lấy thông tin chi tiết của booking
        const booking = await Booking.findById(id).populate('showtime').populate('user');

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking không tồn tại" });
        }

        // Lấy vé liên quan đến booking
        const tickets = await Ticket.find({ bookingId: booking._id });

        res.status(200).json({ success: true, booking, tickets });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Lỗi khi lấy thông tin booking", error: error.message });
    }
};
const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;

        // Tìm booking
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking không tồn tại" });
        }

        // Cập nhật trạng thái booking thành "cancelled"
        booking.status = "cancelled";
        await booking.save();

        // Xóa các vé liên quan
        await Ticket.deleteMany({ bookingId: booking._id });

        res.status(200).json({ success: true, message: "Booking đã bị hủy thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Lỗi khi hủy booking", error: error.message });
    }
};

export { createBooking, getBookingById, getBookingsByUser, cancelBooking }; 
