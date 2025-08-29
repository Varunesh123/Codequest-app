// cron.js - Updated to use ContestScheduler
import ContestScheduler from './ContestScheduler.js';
import LeetcodeController from './controllers/LeetcodeController.js';

// Initialize the scheduler with the controller
console.log('🔧 Starting contest fetching system...');

try {
  // Initialize scheduler with LeetCode controller
  ContestScheduler.init(LeetcodeController);
  
  console.log('✅ Contest scheduler started successfully');
  console.log('📊 System will fetch contests automatically every 15 minutes');
  console.log('💡 Check logs for fetch status and results');
  
  // Log startup status
  setTimeout(() => {
    const status = ContestScheduler.getStatus();
    console.log('📈 Startup Status:', status);
  }, 5000);
  
} catch (error) {
  console.error('❌ Failed to start contest scheduler:', error);
  
  // Emergency fallback - populate with sample data
  console.log('🚨 Starting emergency data population...');
  ContestScheduler.emergencyPopulate();
}

// Export for use in other modules
export { ContestScheduler };

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Gracefully shutting down scheduler...');
  ContestScheduler.stopScheduler();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Gracefully shutting down scheduler...');
  ContestScheduler.stopScheduler();
  process.exit(0);
});