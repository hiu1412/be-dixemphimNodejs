import Showtime from '../models/showtime.js';
import Movie from '../models/movie.js';
import Screen from '../models/screen.js';

// Tạo một showtime mới
const createShowtime = async (data) => {
    try {
        // Kiểm tra xem screen có tồn tại không
        const screenExists = await Screen.findById(data.screen);
        if (!screenExists) throw new Error("Phòng chiếu không tồn tại");

        // Kiểm tra xem movie có tồn tại không
        const movieExists = await Movie.findById(data.movie);
        if (!movieExists) throw new Error("Phim không tồn tại");

        // Tạo showtime
        const showtime = new Showtime({
            screen: data.screen,
            movie: data.movie,
            startTime: data.startTime,
            endTime: data.endTime,
            price: data.price,
        });
        const savedShowtime = await showtime.save();

        // Cập nhật mảng showtime trong Movie
        movieExists.showtime.push(savedShowtime._id);
        await movieExists.save();

        return savedShowtime;
    } catch (error) {
        throw new Error("Lỗi khi tạo lịch chiếu: " + error.message);
    }
};

// Lấy danh sách tất cả các showtime
const getAllShowtimes = async () => {
    try {
        return await Showtime.find()
            .populate('movie', 'title director') // Populate để lấy thông tin chi tiết của Movie
            .populate('screen', 'name location'); // Populate để lấy thông tin chi tiết của Screen
    } catch (error) {
        throw new Error("Lỗi khi lấy danh sách lịch chiếu: " + error.message);
    }
};

// Lấy thông tin showtime theo ID
const getShowtime = async (id) => {
    try {
        const showtime = await Showtime.findById(id)
            .populate('movie', 'title director') // Populate để lấy thông tin chi tiết của Movie
            .populate('screen', 'name location'); // Populate để lấy thông tin chi tiết của Screen
        if (!showtime) throw new Error("Lịch chiếu không tồn tại");
        return showtime;
    } catch (error) {
        throw new Error("Lỗi khi lấy thông tin lịch chiếu: " + error.message);
    }
};

// Cập nhật showtime theo ID
const updateShowtime = async (id, data) => {
    try {
        // Kiểm tra nếu cần cập nhật movie hoặc screen
        if (data.movie) {
            const movieExists = await Movie.findById(data.movie);
            if (!movieExists) throw new Error("Phim không tồn tại");
        }
        if (data.screen) {
            const screenExists = await Screen.findById(data.screen);
            if (!screenExists) throw new Error("Phòng chiếu không tồn tại");
        }

        const showtime = await Showtime.findByIdAndUpdate(id, data, { new: true });
        if (!showtime) throw new Error("Lịch chiếu không tồn tại");

        return showtime;
    } catch (error) {
        throw new Error("Lỗi khi cập nhật lịch chiếu: " + error.message);
    }
};

// Xóa showtime theo ID
const deleteShowtime = async (id) => {
    try {
        const showtime = await Showtime.findByIdAndDelete(id);
        if (!showtime) throw new Error("Lịch chiếu không tồn tại");

        // Xóa showtime khỏi mảng showtime trong Movie
        await Movie.updateMany({ showtime: id }, { $pull: { showtime: id } });

        return showtime;
    } catch (error) {
        throw new Error("Lỗi khi xóa lịch chiếu: " + error.message);
    }
};

export { createShowtime, getAllShowtimes, getShowtime, updateShowtime, deleteShowtime };