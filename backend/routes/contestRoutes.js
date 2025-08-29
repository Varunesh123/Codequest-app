// routes/contestRoutes.js
import express from 'express';

import CodeforcesController from '../controller/codingPlateforms/CodeforcesController.js';
import LeetcodeController from '../controller/codingPlateforms/LeetcodeController.js';
import CodechefController from '../controller/codingPlateforms/CodechefController.js';
import GeeksforGeeksController from '../controller/codingPlateforms/GeeksforGeeksController.js';
import HackerearthController from '../controller/codingPlateforms/HackerearthController.js';

const router = express.Router();

// Platform-specific contest routes
// router.get('/codeforces', CodeforcesController.getContests);
router.get('/codeforces', async (req, res) => {
    try {
        const result = await codeforcesController.getAllContests();
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            details: error.message
        });
    }
});
router.get('/leetcode', LeetcodeController.getContests);
router.get('/codechef', CodechefController.getContests);
router.get('/geeksforgeeks', GeeksforGeeksController.getContests);
router.get('/hackerearth', HackerearthController.getContests);

export const contestRoutes = router;