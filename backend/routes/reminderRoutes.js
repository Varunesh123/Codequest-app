// routes/reminderRoutes.js
import express from 'express';
import ReminderController from '../controller/ReminderController.js';

const router = express.Router();

// All reminder routes require authentication
router.post('/', ReminderController.createReminder);
router.get('/', ReminderController.getUserReminders);
router.put('/:id', ReminderController.updateReminder);
router.delete('/:id', ReminderController.deleteReminder);
router.post('/:id/snooze', ReminderController.snoozeReminder);
router.post('/auto-create', ReminderController.autoCreateReminders);
router.post('/bulk-create', ReminderController.bulkCreateReminders);
router.get('/stats', ReminderController.getReminderStats);

export default router;