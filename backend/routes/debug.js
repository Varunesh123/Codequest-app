// routes/debug.js - Add these debug routes to your Express app
import express from 'express';
import LeetcodeController from '../controller/codingPlateforms/LeetcodeController.js';
import ContestScheduler from '../controller/ContestSchedular.js';

const router = express.Router();

// Run commands to test manually

// # This will immediately populate your database with sample data
// curl -X POST http://localhost:5000/api/debug/generate-sample

// # Check if APIs are working
// curl http://localhost:5000/api/debug/test-apis

// # Check scheduler status  
// curl http://localhost:5000/api/debug/scheduler-status

// # Force fetch real data
// curl -X POST http://localhost:5000/api/debug/fetch-contests


// Force fetch contests manually

router.post('/fetch-contests', async (req, res) => {
  try {
    console.log('🔧 Manual fetch triggered via API');
    const result = await LeetcodeController.fetchContests();
    
    res.json({
      success: true,
      message: 'Contests fetched successfully',
      data: result
    });
  } catch (error) {
    console.error('Manual fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contests',
      error: error.message
    });
  }
});

// Test all APIs
router.get('/test-apis', async (req, res) => {
  try {
    const results = await ContestScheduler.testAllAPIs();
    res.json({
      success: true,
      results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'API test failed',
      error: error.message
    });
  }
});

// Get scheduler status
router.get('/scheduler-status', (req, res) => {
  const status = ContestScheduler.getStatus();
  res.json({
    success: true,
    status
  });
});

// Clear all contests (for testing)
router.delete('/clear-contests', async (req, res) => {
  try {
    const Contest = (await import('../models/Contest.js')).default;
    const result = await Contest.deleteMany({ platform: 'leetcode' });
    
    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} contests`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to clear contests',
      error: error.message
    });
  }
});

// Generate sample data for immediate testing
router.post('/generate-sample', async (req, res) => {
  try {
    const sampleContests = LeetcodeController.generateSampleContests();
    const Contest = (await import('../models/Contest.js')).default;
    
    let savedCount = 0;
    for (const contest of sampleContests) {
      await Contest.updateOne(
        { platformId: contest.platformId },
        { $set: contest },
        { upsert: true }
      );
      savedCount++;
    }

    res.json({
      success: true,
      message: `Generated ${savedCount} sample contests`,
      contests: sampleContests.map(c => ({
        name: c.name,
        startTime: c.startTime,
        type: c.type
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate sample contests',
      error: error.message
    });
  }
});

export default router;