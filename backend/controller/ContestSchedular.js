import cron from 'node-cron';
import axios from 'axios';

// Complete ContestScheduler object for managing all contest fetching
const ContestScheduler = {
  // State tracking
  lastSuccessfulFetch: null,
  isRunning: false,
  fetchCount: 0,
  errorCount: 0,
  scheduledTasks: [],
  
  // Configuration
  config: {
    maxRetries: 3,
    timeoutMs: 15000,
    retryDelayBase: 2000, // Base delay for exponential backoff
    apis: {
      alfa: 'https://alfa-leetcode-api.onrender.com',
      graphql: 'https://leetcode.com/graphql',
      scrape: 'https://leetcode.com/contest/'
    }
  },

  // Initialize the scheduler with all cron jobs
  init(LeetcodeController) {
    this.LeetcodeController = LeetcodeController;
    console.log('🚀 Initializing ContestScheduler...');
    
    // Start all scheduled tasks
    this.startScheduledTasks();
    
    // Run initial fetch after 3 seconds
    setTimeout(() => {
      console.log('🎯 Running startup fetch...');
      this.triggerManualFetch();
    }, 3000);
    
    console.log('✅ ContestScheduler initialized successfully');
  },

  // Start all cron jobs
  startScheduledTasks() {
    // Clear existing tasks
    this.scheduledTasks.forEach(task => task.destroy());
    this.scheduledTasks = [];

    // Main fetch: Every 2 hours
    const mainTask = cron.schedule('0 */2 * * *', async () => {
      console.log('⏰ [MAIN] Scheduled fetch every 2 hours');
      await this.fetchWithRetry(3);
    }, { scheduled: false });

    // High frequency: Every 15 minutes  
    const highFreqTask = cron.schedule('*/15 * * * *', async () => {
      console.log('⏰ [HIGH-FREQ] Quick fetch every 15 minutes');
      await this.fetchWithRetry(2);
    }, { scheduled: false });

    // Daily comprehensive: 1 AM UTC
    const dailyTask = cron.schedule('0 1 * * *', async () => {
      console.log('⏰ [DAILY] Comprehensive daily fetch');
      await this.fetchWithRetry(5);
    }, { scheduled: false });

    // Health check: Every 30 minutes
    const healthTask = cron.schedule('*/30 * * * *', () => {
      this.performHealthCheck();
    }, { scheduled: false });

    // Weekly deep clean: Sunday 2 AM UTC
    const weeklyTask = cron.schedule('0 2 * * 0', async () => {
      console.log('⏰ [WEEKLY] Deep maintenance fetch');
      await this.performWeeklyMaintenance();
    }, { scheduled: false });

    // Store tasks for management
    this.scheduledTasks = [mainTask, highFreqTask, dailyTask, healthTask, weeklyTask];

    // Start all tasks
    this.scheduledTasks.forEach(task => task.start());

    console.log('📅 All scheduled tasks started:');
    console.log('  ⏱️  Main fetch: Every 2 hours');
    console.log('  🔄 High frequency: Every 15 minutes');
    console.log('  📅 Daily comprehensive: 1 AM UTC');
    console.log('  💓 Health check: Every 30 minutes');
    console.log('  🧹 Weekly maintenance: Sunday 2 AM UTC');
  },

  // Enhanced fetch with retry logic and multiple sources
  async fetchWithRetry(maxRetries = 3) {
    if (this.isRunning) {
      console.log('⚠️ Fetch already in progress, skipping...');
      return { success: false, reason: 'already_running' };
    }

    this.isRunning = true;
    this.fetchCount++;
    
    let lastError = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Fetch attempt ${attempt}/${maxRetries}`);
        
        const result = await this.LeetcodeController.fetchContests();
        
        if (result && result.totalFetched > 0) {
          this.lastSuccessfulFetch = new Date();
          this.errorCount = 0; // Reset error count on success
          
          console.log('✅ Fetch successful:', {
            total: result.totalFetched,
            upcoming: result.upcoming,
            past: result.past,
            sources: result.sources?.join(', ') || 'Unknown'
          });
          
          this.isRunning = false;
          return { success: true, data: result };
        } else {
          throw new Error('No contests were fetched');
        }
        
      } catch (error) {
        lastError = error;
        this.errorCount++;
        
        console.error(`❌ Fetch attempt ${attempt} failed:`, error.message);
        
        if (attempt < maxRetries) {
          const delay = this.config.retryDelayBase * Math.pow(2, attempt - 1);
          console.log(`⏳ Retrying in ${delay/1000} seconds...`);
          await this.sleep(delay);
        }
      }
    }
    
    console.error(`🚨 All ${maxRetries} fetch attempts failed. Last error:`, lastError?.message);
    this.isRunning = false;
    return { success: false, error: lastError?.message, attempts: maxRetries };
  },

  // Manual trigger for immediate fetching
  async triggerManualFetch() {
    console.log('🔧 Manual fetch triggered');
    return await this.fetchWithRetry(3);
  },

  // Test all available APIs for connectivity
  async testAllAPIs() {
    console.log('🧪 Testing all LeetCode APIs...');
    
    const tests = {
      alfaAPI: await this.testAlfaAPI(),
      graphQL: await this.testGraphQL(),
      scraping: await this.testScraping(),
      timestamp: new Date().toISOString()
    };

    console.log('🧪 API Test Results:', tests);
    return tests;
  },

  // Test Alfa LeetCode API
  async testAlfaAPI() {
    try {
      const response = await axios.get(`${this.config.apis.alfa}/contests`, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      return {
        status: 'success',
        responseTime: Date.now(),
        dataLength: response.data?.length || 0,
        error: null
      };
    } catch (error) {
      return {
        status: 'failed',
        responseTime: null,
        dataLength: 0,
        error: error.message
      };
    }
  },

  // Test LeetCode GraphQL
  async testGraphQL() {
    try {
      const response = await axios.post(this.config.apis.graphql, {
        query: 'query { contestUpcomingContests { title } }'
      }, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      return {
        status: 'success',
        responseTime: Date.now(),
        dataLength: response.data?.data?.contestUpcomingContests?.length || 0,
        error: null
      };
    } catch (error) {
      return {
        status: 'failed',
        responseTime: null,
        dataLength: 0,
        error: error.message
      };
    }
  },

  // Test web scraping
  async testScraping() {
    try {
      const response = await axios.get(this.config.apis.scrape, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      return {
        status: response.status === 200 ? 'success' : 'failed',
        responseTime: Date.now(),
        dataLength: response.data?.length || 0,
        error: null
      };
    } catch (error) {
      return {
        status: 'failed',
        responseTime: null,
        dataLength: 0,
        error: error.message
      };
    }
  },

  // Health check monitoring
  performHealthCheck() {
    const now = new Date();
    const timeSinceLastFetch = this.lastSuccessfulFetch 
      ? (now - this.lastSuccessfulFetch) / (1000 * 60) // minutes
      : null;

    const healthData = {
      timestamp: now.toISOString(),
      lastSuccessfulFetch: this.lastSuccessfulFetch?.toISOString() || 'Never',
      minutesSinceLastFetch: timeSinceLastFetch?.toFixed(1) || 'N/A',
      totalFetches: this.fetchCount,
      errorCount: this.errorCount,
      isCurrentlyRunning: this.isRunning,
      healthStatus: this.getHealthStatus(timeSinceLastFetch),
      activeTasks: this.scheduledTasks.length
    };

    console.log('💓 Health Check:', healthData);

    // Alert if system is unhealthy
    if (!this.lastSuccessfulFetch) {
      console.log('🚨 CRITICAL: No successful fetches yet!');
    } else if (timeSinceLastFetch > 240) { // 4 hours
      console.log('🚨 CRITICAL: System has been failing for over 4 hours!');
    } else if (timeSinceLastFetch > 120) { // 2 hours
      console.log('⚠️ WARNING: No successful fetch in over 2 hours');
    }

    return healthData;
  },

  // Weekly maintenance
  async performWeeklyMaintenance() {
    console.log('🧹 Starting weekly maintenance...');
    
    try {
      // Test all APIs
      await this.testAllAPIs();
      
      // Force a comprehensive fetch
      await this.fetchWithRetry(5);
      
      // Clean old contests (optional - keep last 100)
      await this.cleanOldContests();
      
      console.log('✅ Weekly maintenance completed');
    } catch (error) {
      console.error('❌ Weekly maintenance failed:', error);
    }
  },

  // Clean old contest data
  async cleanOldContests() {
    try {
      const Contest = (await import('../models/Contest.js')).default;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 90); // Keep last 90 days
      
      const result = await Contest.deleteMany({
        platform: 'leetcode',
        startTime: { $lt: cutoffDate },
        type: 'past'
      });
      
      console.log(`🧹 Cleaned ${result.deletedCount} old contests (older than 90 days)`);
      return result.deletedCount;
    } catch (error) {
      console.error('❌ Error cleaning old contests:', error);
      return 0;
    }
  },

  // Get health status
  getHealthStatus(timeSinceLastFetch) {
    if (!this.lastSuccessfulFetch) return 'critical';
    if (timeSinceLastFetch > 240) return 'critical'; // 4+ hours
    if (timeSinceLastFetch > 120) return 'warning';  // 2+ hours
    if (timeSinceLastFetch > 60) return 'degraded';  // 1+ hour
    return 'healthy';
  },

  // Get complete status
  getStatus() {
    const now = new Date();
    const timeSinceLastFetch = this.lastSuccessfulFetch 
      ? ((now - this.lastSuccessfulFetch) / (1000 * 60)) // minutes
      : null;

    return {
      isRunning: this.isRunning,
      lastSuccessfulFetch: this.lastSuccessfulFetch,
      timeSinceLastFetch,
      totalFetches: this.fetchCount,
      errorCount: this.errorCount,
      healthStatus: this.getHealthStatus(timeSinceLastFetch),
      nextScheduledFetch: 'Every 15 minutes',
      activeTasks: this.scheduledTasks.length,
      uptime: process.uptime()
    };
  },

  // Stop all scheduled tasks
  stopScheduler() {
    console.log('🛑 Stopping scheduler...');
    this.scheduledTasks.forEach(task => {
      task.destroy();
    });
    this.scheduledTasks = [];
    console.log('✅ All scheduled tasks stopped');
  },

  // Restart scheduler
  restartScheduler() {
    console.log('🔄 Restarting scheduler...');
    this.stopScheduler();
    this.startScheduledTasks();
  },

  // Utility function for delays
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Force immediate data population (for testing)
  async populateWithSampleData() {
    console.log('🎲 Generating sample contest data...');
    
    try {
      const Contest = (await import('../models/Contest.js')).default;
      const sampleContests = this.generateSampleContests();
      
      let savedCount = 0;
      for (const contest of sampleContests) {
        await Contest.updateOne(
          { platformId: contest.platformId },
          { $set: contest },
          { upsert: true }
        );
        savedCount++;
      }

      console.log(`✅ Generated and saved ${savedCount} sample contests`);
      return { success: true, count: savedCount };
      
    } catch (error) {
      console.error('❌ Error generating sample data:', error);
      return { success: false, error: error.message };
    }
  },

  // Generate realistic sample contest data
  generateSampleContests() {
    const now = new Date();
    const contests = [];
    
    // Upcoming Weekly Contests
    for (let i = 0; i < 4; i++) {
      const daysFromNow = i * 7 + (7 - now.getDay()); // Next few Sundays
      const startTime = new Date(now);
      startTime.setDate(now.getDate() + daysFromNow);
      startTime.setHours(2, 30, 0, 0); // 2:30 AM UTC (Sunday LeetCode time)
      
      contests.push({
        name: `Weekly Contest ${410 + i}`,
        platform: 'leetcode',
        url: `https://leetcode.com/contest/weekly-contest-${410 + i}`,
        startTime,
        endTime: new Date(startTime.getTime() + 90 * 60 * 1000),
        duration: 90,
        platformId: `leetcode_weekly_${410 + i}`,
        description: 'Weekly programming contest featuring 4 algorithmic problems of increasing difficulty.',
        cardImg: '',
        isActive: true,
        type: 'upcoming',
        company: 'LeetCode',
        updatedAt: new Date(),
        source: 'sample',
        contestType: 'weekly'
      });
    }

    // Upcoming Biweekly Contest
    const nextBiweekly = new Date(now);
    nextBiweekly.setDate(now.getDate() + 14);
    nextBiweekly.setHours(14, 30, 0, 0); // 2:30 PM UTC (Saturday biweekly time)
    
    contests.push({
      name: 'Biweekly Contest 147',
      platform: 'leetcode',
      url: 'https://leetcode.com/contest/biweekly-contest-147',
      startTime: nextBiweekly,
      endTime: new Date(nextBiweekly.getTime() + 90 * 60 * 1000),
      duration: 90,
      platformId: 'leetcode_biweekly_147',
      description: 'Biweekly programming contest with 4 challenging algorithmic problems.',
      cardImg: '',
      isActive: true,
      type: 'upcoming',
      company: 'LeetCode',
      updatedAt: new Date(),
      source: 'sample',
      contestType: 'biweekly'
    });

    // Past contests
    for (let i = 1; i <= 8; i++) {
      const daysAgo = i * 7; // Weekly intervals
      const startTime = new Date(now);
      startTime.setDate(now.getDate() - daysAgo);
      startTime.setHours(2, 30, 0, 0);
      
      contests.push({
        name: `Weekly Contest ${409 - i}`,
        platform: 'leetcode',
        url: `https://leetcode.com/contest/weekly-contest-${409 - i}`,
        startTime,
        endTime: new Date(startTime.getTime() + 90 * 60 * 1000),
        duration: 90,
        platformId: `leetcode_weekly_${409 - i}`,
        description: `Past weekly contest from ${startTime.toLocaleDateString()}.`,
        cardImg: '',
        isActive: false,
        type: 'past',
        company: 'LeetCode',
        updatedAt: new Date(),
        source: 'sample',
        contestType: 'weekly'
      });
    }

    // Past biweekly contests
    for (let i = 1; i <= 3; i++) {
      const daysAgo = i * 14; // Biweekly intervals
      const startTime = new Date(now);
      startTime.setDate(now.getDate() - daysAgo);
      startTime.setHours(14, 30, 0, 0);
      
      contests.push({
        name: `Biweekly Contest ${146 - i}`,
        platform: 'leetcode',
        url: `https://leetcode.com/contest/biweekly-contest-${146 - i}`,
        startTime,
        endTime: new Date(startTime.getTime() + 90 * 60 * 1000),
        duration: 90,
        platformId: `leetcode_biweekly_${146 - i}`,
        description: `Past biweekly contest from ${startTime.toLocaleDateString()}.`,
        cardImg: '',
        isActive: false,
        type: 'past',
        company: 'LeetCode',
        updatedAt: new Date(),
        source: 'sample',
        contestType: 'biweekly'
      });
    }

    return contests;
  },

  // Emergency data population
  async emergencyPopulate() {
    console.log('🚨 Emergency data population triggered...');
    
    try {
      // First try to fetch real data
      const realDataResult = await this.fetchWithRetry(1);
      
      if (realDataResult.success) {
        console.log('✅ Emergency fetch successful with real data');
        return realDataResult;
      }
      
      // If real data fails, use sample data
      console.log('⚠️ Real data failed, using sample data...');
      const sampleResult = await this.populateWithSampleData();
      
      return sampleResult;
      
    } catch (error) {
      console.error('❌ Emergency population failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Get detailed statistics
  getDetailedStats() {
    const now = new Date();
    const uptime = process.uptime();
    
    return {
      scheduler: {
        isRunning: this.isRunning,
        activeTasks: this.scheduledTasks.length,
        uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`
      },
      fetching: {
        totalAttempts: this.fetchCount,
        successfulFetches: this.fetchCount - this.errorCount,
        errorCount: this.errorCount,
        successRate: this.fetchCount > 0 ? `${((this.fetchCount - this.errorCount) / this.fetchCount * 100).toFixed(1)}%` : 'N/A',
        lastSuccess: this.lastSuccessfulFetch?.toISOString() || 'Never'
      },
      health: {
        status: this.getHealthStatus(this.lastSuccessfulFetch ? (now - this.lastSuccessfulFetch) / (1000 * 60) : null),
        nextCheck: '30 minutes',
        systemLoad: process.memoryUsage()
      }
    };
  }
};

export default ContestScheduler;