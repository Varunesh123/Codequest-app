import express from 'express';
import {
    setReminder,
    getUserReminders,
    deleteReminders
} from '../controller/reminderController.js';

import authUser from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:contestId', authUser, setReminder);
router.get('/', authUser, getUserReminders);
router.delete('/:remiderId', authUser, deleteReminders);

export default router;