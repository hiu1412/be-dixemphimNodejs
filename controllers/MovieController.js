import { getNewestMovies, createMovie, getAllMovies, getMovie, updateMovie, deleteMovie } from '../services/movieService.js';
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
        console.log(movie);
        res.status(201).json({ success: true, movie, message: "Tạo movie thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const list = async (req, res) => {
    try {
        const movies = await getAllMovies(); // Gọi hàm lấy danh sách phim
        
        res.status(200).json({
            success: true,
            data: movies, // Trả về danh sách phim
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getNewest = async (req, res) => {
    try {
        const movies = await getNewestMovies(); // Call service to get newest movies
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

export { create, list, getById, update, remove,getNewest };