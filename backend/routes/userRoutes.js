// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController');
const { authMiddleware } = require('../middleware/authMiddleware');

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

module.exports = router;