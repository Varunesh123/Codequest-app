const express = require('express');
const { GeeksforGeeksController } = require('../controller/GeeksforGekksController').default;
const { CodechefController } = require('../controller/CodechefController').default;
const { HackerearthController } = require('../controller/HackerearthController').default;

const router = express.Router();

// routes/codechefRoutes.js
router.get('/contests', CodechefController.getContests);
router.get('/profile/:username', CodechefController.getUserProfile);

// routes/geeksforgeeksRoutes.js
router.get('/contests', GeeksforGeeksController.getContests);

// routes/hackerearthRoutes.js
router.get('/contests', HackerearthController.getContests);

module.exports = router;