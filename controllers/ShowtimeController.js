import { createShowtime, getAllShowtimes, getShowtime, updateShowtime, deleteShowtime } from '../services/showtimeService.js';

// Tạo một showtime mới
const create = async (req, res) => {
    try {
        const showtime = await createShowtime(req.body);
        res.status(201).json({ success: true, showtime, message: "Tạo lịch chiếu thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy danh sách tất cả các showtime
const list = async (req, res) => {
    try {
        const showtimes = await getAllShowtimes();
        res.status(200).json({ success: true, showtimes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy thông tin showtime theo ID
const getById = async (req, res) => {
    try {
        const showtime = await getShowtime(req.params.id);
        if (!showtime) return res.status(404).json({ success: false, message: "Lịch chiếu không tồn tại" });
        res.status(200).json({ success: true, showtime });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cập nhật showtime theo ID
const update = async (req, res) => {
    try {
        const showtime = await updateShowtime(req.params.id, req.body);
        if (!showtime) return res.status(404).json({ success: false, message: "Lịch chiếu không tồn tại" });
        res.status(200).json({ success: true, showtime, message: "Cập nhật lịch chiếu thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Xóa showtime theo ID
const remove = async (req, res) => {
    try {
        const showtime = await deleteShowtime(req.params.id);
        if (!showtime) return res.status(404).json({ success: false, message: "Lịch chiếu không tồn tại" });
        res.status(200).json({ success: true, message: "Xóa lịch chiếu thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { create, list, getById, update, remove };