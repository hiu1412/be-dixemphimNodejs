import express from 'express';
import {list, getById, create, update, remove, bulkcreate} from '../controllers/SeatController.js';


const seatRouter = express.Router();

seatRouter.post("/bulkcreate", bulkcreate); // Tạo nhiều ghế cùng lúc
seatRouter.post("/", create); // Tạo một ghế mới
seatRouter.get("/", list); // Lấy danh sách tất cả các ghế
seatRouter.get("/:id", getById); // Lấy thông tin ghế theo ID
seatRouter.put("/:id", update); // Cập nhật ghế theo ID
seatRouter.delete("/:id", remove); // Xóa ghế theo ID

export default seatRouter;