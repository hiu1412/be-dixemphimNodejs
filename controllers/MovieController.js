import { createMovie, getAllMovies, getMovie, updateMovie, deleteMovie } from '../services/movieService.js';
import {uploadFileToS3} from '../services/uploadService.js';
// Tạo một movie mới
const create = async (req, res) => {
    try {
        let posterUrl = null;

        // Upload poster nếu có file
        if (req.file) {
            posterUrl = await uploadFileToS3(req.file);
        }
        // Gọi service để tạo movie
        const movie = await createMovie({ ...req.body, poster: posterUrl });
        res.status(201).json({ success: true, movie, message: "Tạo movie thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy danh sách tất cả các movie
const list = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Lấy tham số page từ query
        const limit = parseInt(req.query.limit) || 25; // Lấy tham số limit từ query
        const movies = await getAllMovies(page, limit); // Gọi service với tham số phân trang
        res.status(200).json({ success: true, movies });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy thông tin movie theo ID
const getById = async (req, res) => {
    try {
        const movie = await getMovie(req.params.id); // Gọi service
        if (!movie) return res.status(404).json({ success: false, message: "Phim không tồn tại" });
        res.status(200).json({ success: true, movie });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cập nhật movie theo ID
const update = async (req, res) => {
    try {
        let posterUrl = null;

        // Upload poster mới nếu có file
        if (req.file) {
            posterUrl = await uploadFileToS3(req.file);
        }

        // Gọi service để cập nhật movie
        const movie = await updateMovie(req.params.id, { ...req.body, ...(posterUrl && { poster: posterUrl }) });
        if (!movie) return res.status(404).json({ success: false, message: "Phim không tồn tại" });
        
        res.status(200).json({ success: true, movie, message: "Cập nhật movie thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Xóa movie theo ID
const remove = async (req, res) => {
    try {
        const movie = await deleteMovie(req.params.id); // Gọi service
        if (!movie) return res.status(404).json({ success: false, message: "Phim không tồn tại" });
        res.status(200).json({ success: true, message: "Xóa movie thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { create, list, getById, update, remove };