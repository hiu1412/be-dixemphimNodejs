import express from 'express';
import {create, list, getById, update, remove} from '../controllers/ShowtimeController.js';

const showtimeRouter = express.Router();

showtimeRouter.get('/', list); // Lấy danh sách tất cả các showtime
showtimeRouter.get('/:id', getById); // Lấy thông tin showtime theo ID
showtimeRouter.post('/', create); // Tạo một showtime mới
showtimeRouter.put('/:id', update); // Cập nhật showtime theo ID
showtimeRouter.delete('/:id', remove); // Xóa showtime theo ID

export default showtimeRouter;