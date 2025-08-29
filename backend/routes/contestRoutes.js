// routes/contestRoutes.js
import express from 'express';
import ContestController from '../controller/ContestController.js';

import CodeforcesController from '../controller/codingPlateforms/CodeforcesController.js';
import LeetcodeController from '../controller/codingPlateforms/LeetcodeController.js';
import CodechefController from '../controller/codingPlateforms/CodechefController.js';
import GeeksforGeeksController from '../controller/codingPlateforms/GeeksforGeeksController.js';
import HackerearthController from '../controller/codingPlateforms/HackerearthController.js';

const router = express.Router();

// Platform-specific contest routes
// router.get('/codeforces/contests', CodeforcesController.getContests);
router.get('/leetcode', LeetcodeController.getContests);
router.get('/codechef', CodechefController.getContests);
router.get('/geeksforgeeks', GeeksforGeeksController.getContests);
router.get('/hackerearth', HackerearthController.getContests);

export const contestRoutes = router;