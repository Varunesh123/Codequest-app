import express from 'express';
import UserController from '../controller/UserController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/forgot-password', UserController.forgotPassword);
router.post('/reset-password', UserController.resetPassword);
router.post('/verify-email', UserController.verifyEmail);

// Protected routes
router.get('/profile', authMiddleware, UserController.getProfile);
router.put('/profile', authMiddleware, UserController.updateProfile);
router.put('/preferences', authMiddleware, UserController.updatePreferences);
router.put('/change-password', authMiddleware, UserController.changePassword);
router.delete('/account', authMiddleware, UserController.deleteAccount);

export const userRoutes = router;