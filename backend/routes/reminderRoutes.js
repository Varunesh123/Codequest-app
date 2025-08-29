import express from 'express';
import ReminderController from '../controller/ReminderController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All reminder routes require authentication
router.post('/', authMiddleware, ReminderController.createReminder);
router.get('/', authMiddleware, ReminderController.getUserReminders);
router.put('/:id', authMiddleware, ReminderController.updateReminder);
router.delete('/:id', authMiddleware, ReminderController.deleteReminder);
router.post('/:id/snooze', authMiddleware, ReminderController.snoozeReminder);
router.post('/auto-create', authMiddleware, ReminderController.autoCreateReminders);
router.post('/bulk-create', authMiddleware, ReminderController.bulkCreateReminders);
router.get('/stats', authMiddleware, ReminderController.getReminderStats);

export const reminderRoutes = router;