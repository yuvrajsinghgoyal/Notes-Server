import express from 'express';
const router = express.Router();
import {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import { decryptPayload } from '../middleware/cryptoMiddleware.js';

router.route('/')
    .get(protect, getTasks)
    .post(protect, decryptPayload, createTask);

router.route('/:id')
    .put(protect, decryptPayload, updateTask)
    .delete(protect, deleteTask);

export default router;
