// routes/contestRoutes.js
import express from 'express';
import ContestController from '../controller/ContestController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', ContestController.getAllContests);
router.get('/upcoming', ContestController.getUpcomingContests);
router.get('/ongoing', ContestController.getOngoingContests);
router.get('/stats', ContestController.getPlatformStats);
router.get('/:id', ContestController.getContestById);

// Protected routes
router.get('/user/preferred', authMiddleware, ContestController.getUserContests);

export default router;