import Booking from '../models/booking.js';
import Seat from '../models/seat.js';
import Ticket from '../models/ticket.js';
import Showtime from '../models/showtime.js';

// Tạo booking mới
const createBooking = async (userId, showtimeId, seatIds) => {
    try {
        // Validate input
        if (!seatIds) {
            throw new Error("Vui lòng chọn ghế");
        }

        // Đảm bảo seatIds là array và loại bỏ giá trị null/undefined
        const seatIdsArray = (Array.isArray(seatIds) ? seatIds : [seatIds])
            .filter(id => id)
            .map(id => id.toString());

        if (seatIdsArray.length === 0) {
            throw new Error("Vui lòng chọn ghế hợp lệ");
        }

        // Debug: Log request params
        console.log('Creating booking with:', {
            userId,
            showtimeId,
            seatIds: seatIdsArray
        });

        // Kiểm tra showtime và lấy screen_id
        const showtime = await Showtime.findById(showtimeId).populate('screen');
        if (!showtime) {
            throw new Error("Không tìm thấy suất chiếu");
        }

        // Debug: Log showtime details
        console.log('Found showtime:', {
            id: showtime._id,
            movieId: showtime.movie,
            screenId: showtime.screen?._id,
            startTime: showtime.startTime
        });

        // 1. Tìm tất cả ghế trước
        const allSeats = await Seat.find({
            _id: { $in: seatIdsArray }
        });

        // Debug: Log seat details
        console.log('Found all seats:', allSeats.map(seat => ({
            id: seat._id,
            screenId: seat.screen,
            row: seat.row,
            number: seat.number,
            isAvailable: seat.isAvailable
        })));

        // 2. Kiểm tra số lượng ghế tìm thấy
        if (allSeats.length === 0) {
            throw new Error("Không tìm thấy ghế nào");
        }

        if (allSeats.length !== seatIdsArray.length) {
            const foundIds = allSeats.map(s => s._id.toString());
            const missingIds = seatIdsArray.filter(id => !foundIds.includes(id));
            throw new Error(`Không tìm thấy ghế: ${missingIds.join(', ')}`);
        }

        // 3. Kiểm tra ghế có thuộc màn hình không
        const wrongScreenSeats = allSeats.filter(
            seat => seat.screen.toString() !== showtime.screen._id.toString()
        );
        
        if (wrongScreenSeats.length > 0) {
            const seatNames = wrongScreenSeats.map(s => `${s.row}${s.number}`).join(', ');
            throw new Error(`Các ghế sau không thuộc màn hình này: ${seatNames}`);
        }

        // 4. Kiểm tra ghế còn trống không
        const unavailableSeats = allSeats.filter(seat => !seat.isAvailable);
        if (unavailableSeats.length > 0) {
            const seatNames = unavailableSeats.map(s => `${s.row}${s.number}`).join(', ');
            throw new Error(`Các ghế sau đã được đặt: ${seatNames}`);
        }

        // Tính tổng tiền dựa trên loại ghế
        const totalPrice = allSeats.reduce((sum, seat) => {
            return sum + (seat.type === 'vip' ? 150000 : 100000);
        }, 0);

        // Tạo mã booking
        const bookingCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        // Set thời gian hết hạn (15 phút)
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);

        // Tạo booking mới
        const booking = new Booking({
            user: userId,
            showtime: showtimeId,
            seats: seatIdsArray,
            totalPrice,
            bookingCode,
            expiresAt
        });

        // Cập nhật trạng thái ghế
        await Seat.updateMany(
            { _id: { $in: seatIdsArray } },
            { isAvailable: false }
        );

        await booking.save();
        return booking;

    } catch (error) {
        console.error('Error in createBooking:', error);
        throw error;
    }
};

// Xác nhận thanh toán và tạo ticket
const confirmPayment = async (bookingId) => {
    try {
        // Tìm và kiểm tra booking
        const booking = await Booking.findById(bookingId)
            .populate('showtime')
            .populate('seats');
            
        if (!booking) {
            throw new Error("Không tìm thấy booking");
        }

        // Thêm kiểm tra hết hạn
        if (new Date() > booking.expiresAt) {
            booking.status = 'cancelled';
            await booking.save();
            throw new Error("Booking đã hết hạn");
        }

        if (booking.status !== 'pending') {
            throw new Error("Booking không ở trạng thái chờ thanh toán");
        }

        // Import paymentService
        const { processPayment } = await import('./paymentService.js');

        // Thực hiện thanh toán
        try {
            const paymentResult = await processPayment(booking.totalPrice);
            console.log('Payment result:', paymentResult);
        } catch (error) {
            console.error('Payment failed:', error);
            throw new Error("Thanh toán thất bại: " + error.message);
        }

        // Tạo ticket cho từng ghế
        const tickets = await Promise.all(booking.seats.map(async (seat) => {
            const ticketCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            
            const ticket = new Ticket({
                booking: booking._id,
                seat: seat._id,
                ticketCode,
                movie: booking.showtime.movie,
                screen: seat.screen,
                startTime: booking.showtime.startTime,
                endTime: booking.showtime.endTime,
                price: seat.type === 'vip' ? 150000 : 100000
            });

            return ticket.save();
        }));

        // Cập nhật trạng thái booking
        booking.status = 'paid';
        await booking.save();

        return { booking, tickets };
    } catch (error) {
        console.error('Error in confirmPayment:', error);
        throw error;
    }
};

// Hủy booking
const cancelBooking = async (bookingId, userId) => {
    try {
        const booking = await Booking.findOne({
            _id: bookingId,
            user: userId,
            status: 'pending'
        });

        if (!booking) {
            throw new Error("Không tìm thấy booking hoặc không thể hủy");
        }

        // Cập nhật trạng thái ghế về available
        await Seat.updateMany(
            { _id: { $in: booking.seats } },
            { isAvailable: true }
        );

        booking.status = 'cancelled';
        await booking.save();
        
        return booking;
    } catch (error) {
        console.error('Error in cancelBooking:', error);
        throw error;
    }
};

// Lấy danh sách booking của user
const getUserBookings = async (userId) => {
    try {
        const bookings = await Booking.find({ user: userId })
            .populate('showtime')
            .populate('seats')
            .sort({ createAt: -1 });

        return bookings;
    } catch (error) {
        console.error('Error in getUserBookings:', error);
        throw error;
    }
};

export {
    createBooking,
    confirmPayment,
    cancelBooking,
    getUserBookings
};