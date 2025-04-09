import express from 'express';
import { create, list, getById, update, remove } from '../controllers/ScreenController.js';

const screenRouter = express.Router();

screenRouter.post('/', create);
screenRouter.get('/', list);
screenRouter.get('/:id', getById);
screenRouter.put('/:id', update);
screenRouter.delete('/:id', remove);

export default screenRouter;