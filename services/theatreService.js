import Theatre from '../models/theatre.js';

// Tạo một theatre mới
const createTheatre = async (data) => {
    try {
        const theatre = new Theatre(data);
        return await theatre.save();
    } catch (error) {
        throw new Error("Lỗi khi tạo rạp chiếu phim: " + error.message);
    }
};

// Lấy danh sách tất cả các theatre
const getAllTheatres = async () => {
    try {
        return await Theatre.find().populate('screen'); 
    } catch (error) {
        throw new Error("Lỗi khi lấy danh sách rạp chiếu phim: " + error.message);
    }
};

// Lấy thông tin theatre theo ID
const getTheatre = async (id) => {
    try {
        const theatre = await Theatre.findById(id).populate('screen');
        if (!theatre) throw new Error("Rạp chiếu phim không tồn tại");
        return theatre;
    } catch (error) {
        throw new Error("Lỗi khi lấy thông tin rạp chiếu phim: " + error.message);
    }
};

// Cập nhật theatre theo ID
const updateTheatre = async (id, data) => {
    try {
        const theatre = await Theatre.findByIdAndUpdate(id, data, { new: true });
        if (!theatre) throw new Error("Rạp chiếu phim không tồn tại");
        return theatre;
    } catch (error) {
        throw new Error("Lỗi khi cập nhật rạp chiếu phim: " + error.message);
    }
};

// Xóa theatre theo ID
const deleteTheatre = async (id) => {
    try {
        const theatre = await Theatre.findByIdAndDelete(id);
        if (!theatre) throw new Error("Rạp chiếu phim không tồn tại");
        return theatre;
    } catch (error) {
        throw new Error("Lỗi khi xóa rạp chiếu phim: " + error.message);
    }
};

export { createTheatre, getAllTheatres, getTheatre, updateTheatre, deleteTheatre };