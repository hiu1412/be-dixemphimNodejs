import express from 'express';
import { remove, changePassword, list, update} from '../controllers/AuthController.js';
import adminMiddle from '../middleware/adminMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';


const userRouter = express.Router();

userRouter.get("/",authMiddleware,list); //lát thêm lại adminMiddle cho tất cảcả
userRouter.put("/:userId", authMiddleware,update);
userRouter.delete("/:userId",authMiddleware, remove);
userRouter.put("/change-password/:userId" , authMiddleware, changePassword);
export default userRouter;