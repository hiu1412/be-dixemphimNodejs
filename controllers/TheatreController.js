import { createTheatre, getAllTheatres, getTheatre, updateTheatre, deleteTheatre } from '../services/theatreService.js';

// Tạo một theatre mới
const create = async (req, res) => {
    try {
        const theatre = await createTheatre(req.body);
        res.status(201).json({ success: true, theatre, message: "Tạo rạp chiếu phim thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy danh sách tất cả các theatre
const list = async (req, res) => {
    try {
        const theatres = await getAllTheatres();
        res.status(200).json({ success: true, theatres });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy thông tin theatre theo ID
const getById = async (req, res) => {
    try {
        const theatre = await getTheatre(req.params.id);
        if (!theatre) return res.status(404).json({ success: false, message: "Rạp chiếu phim không tồn tại" });
        res.status(200).json({ success: true, theatre });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cập nhật theatre theo ID
const update = async (req, res) => {
    try {
        const theatre = await updateTheatre(req.params.id, req.body);
        if (!theatre) return res.status(404).json({ success: false, message: "Rạp chiếu phim không tồn tại" });
        res.status(200).json({ success: true, theatre, message: "Cập nhật rạp chiếu phim thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Xóa theatre theo ID
const remove = async (req, res) => {
    try {
        const theatre = await deleteTheatre(req.params.id);
        if (!theatre) return res.status(404).json({ success: false, message: "Rạp chiếu phim không tồn tại" });
        res.status(200).json({ success: true, message: "Xóa rạp chiếu phim thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { create, list, getById, update, remove };