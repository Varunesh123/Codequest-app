import express from 'express';
import { 
    registerUser, 
    loginUser, 
    addToFavorites, 
    getUserProfiles
} from '../controller/userController.js';

import authUser from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/me', authUser, getUserProfiles);
router.post('/favorites/:contestId', authUser, addToFavorites);

export default router;