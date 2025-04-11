import express from 'express';
import { create, list, update, remove, getById, getNewest } from '../controllers/MovieController.js';
import  upload  from '../middleware/uploadMiddleware.js';

const movieRouter = express.Router();

movieRouter.get("/", list); 
movieRouter.get("/newest",getNewest); // Assuming you want to use the same list function for newest movies
movieRouter.get("/:id", getById);
movieRouter.post("/",upload.single('poster'), create);
movieRouter.put("/:id", upload.single('poster'), update);
movieRouter.delete("/:id", remove);

export default movieRouter;