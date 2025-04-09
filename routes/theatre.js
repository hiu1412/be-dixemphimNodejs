import express from 'express';
import { create, list, getById, update, remove } from '../controllers/TheatreController.js';

const theatreRouter = express.Router();

theatreRouter.post('/', create);
theatreRouter.get('/', list);
theatreRouter.get('/:id', getById);
theatreRouter.put('/:id', update);
theatreRouter.delete('/:id', remove);

export default theatreRouter;