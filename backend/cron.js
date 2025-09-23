// cron.js - Updated to// cron.js - Updated to properly initialize all controllers
import ContestScheduler from './ContestScheduler.js';
import CodeforcesController from './controllers/CodeforcesController.js';
import CodeChefController from './controllers/CodeChefController.js';
import HackerEarthController from './controllers/HackerEarthController.js';
import LeetcodeController from './controllers/LeetcodeController.js';

console.log('Starting contest fetching system...');

try {
    // Initialize controllers
    const controllers = {};
    
    // Add Codeforces controller
    controllers.codeforces = new CodeforcesController();
    console.log('Codeforces controller initialized');
    
    // Add CodeChef controller
    controllers.codechef = new CodeChefController();
    console.log('CodeChef controller initialized');
    
    // Add HackerEarth controller
    controllers.hackerearth = new HackerEarthController();
    console.log('HackerEarth controller initialized');
    
    // Add LeetCode controller if available
    if (LeetcodeController) {
        controllers.leetcode = LeetcodeController;
        console.log('LeetCode controller initialized');
    }
    
    // Initialize scheduler with all controllers
    ContestScheduler.init(controllers);
    
    console.log('Contest scheduler started successfully');
    console.log('System will fetch contests automatically:');
    console.log('- Codeforces: Every 30 minutes');
    console.log('- CodeChef: Every 45 minutes');
    console.log('- HackerEarth: Every 40 minutes');
    console.log('- LeetCode: Every 15 minutes (if available)');
    console.log('- Main fetch: Every 2 hours');
    
    // Test API connectivity after startup
    setTimeout(async () => {
        console.log('Testing API connectivity for all platforms...');
        const testResults = await ContestScheduler.testAllAPIs();
        console.log('API Test Results:', testResults);
        
        // Get system status
        const status = ContestScheduler.getStatus();
        console.log('System Status:', status);
    }, 10000); // Wait 10 seconds after startup
    
} catch (error) {
    console.error('Failed to start contest scheduler:', error);
    
    // Emergency fallback - try to start with just basic functionality
    console.log('Starting emergency mode...');
    try {
        const emergencyControllers = {
            codeforces: new CodeforcesController(),
            codechef: new CodeChefController(),
            hackerearth: new HackerEarthController()
        };
        ContestScheduler.init(emergencyControllers);
        console.log('Emergency mode started successfully');
    } catch (emergencyError) {
        console.error('Emergency mode failed:', emergencyError);
        process.exit(1);
    }
}

// Export for use in other modules
export { ContestScheduler };

// Manual trigger endpoints for testing
export const triggerManualFetch = async (platform = null) => {
    try {
        if (platform) {
            console.log(`Manual fetch triggered for ${platform}`);
            return await ContestScheduler.triggerFetch(platform);
        } else {
            console.log('Manual fetch triggered for all platforms');
            return await ContestScheduler.triggerFetchAll();
        }
    } catch (error) {
        console.error('Manual fetch failed:', error);
        return { success: false, error: error.message };
    }
};

// Test API endpoints
export const testAPIs = async () => {
    try {
        console.log('API test triggered');
        return await ContestScheduler.testAllAPIs();
    } catch (error) {
        console.error('API test failed:', error);
        return { success: false, error: error.message };
    }
};

// Get system status
export const getSystemStatus = () => {
    return ContestScheduler.getStatus();
};

// Graceful shutdown handlers
process.on('SIGINT', () => {
    console.log('\nGracefully shutting down scheduler...');
    ContestScheduler.stop();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\nGracefully shutting down scheduler...');
    ContestScheduler.stop();
    process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    ContestScheduler.stop();
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Don't exit on unhandled rejections, just log them
});