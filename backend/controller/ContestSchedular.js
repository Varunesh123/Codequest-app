// Simple configuration
  config: {
    platforms: {
      codeforces: {
        enabled: true,
        frequency: '*/30 * * * *' // Every 30 minutes
      },
      codechef: {
        enabled: true,
        frequency: '*/45 * * * *' // Every 45 minutes (less frequent due to scraping)
      },
      hackerearth: {
        enabled: true,
        frequency: '*/40 * * * *' // Every 40 minutes (scraping + API)
      },
      leetcode: {
        enabled: true,
        frequency: '*/15 * * * *' // Every 15 minutes
      }
    }
  },import cron from 'node-cron';

const ContestScheduler = {
  // Basic state tracking
  isRunning: false,
  lastFetch: null,
  fetchCount: 0,
  controllers: {},
  scheduledTasks: [],
  
  // Simple configuration
  config: {
    platforms: {
      codeforces: {
        enabled: true,
        frequency: '*/30 * * * *' // Every 30 minutes
      },
      codechef: {
        enabled: true,
        frequency: '*/45 * * * *' // Every 45 minutes (less frequent due to scraping)
      },
      leetcode: {
        enabled: true,
        frequency: '*/15 * * * *' // Every 15 minutes
      }
    }
  },

  // Initialize with controllers
  init(controllers = {}) {
    this.controllers = controllers;
    console.log('Initializing ContestScheduler...');
    
    // Start scheduled tasks
    this.startScheduledTasks();
    
    // Initial fetch after 5 seconds
    setTimeout(() => {
      console.log('Running initial fetch...');
      this.fetchAllContests();
    }, 5000);
    
    console.log('ContestScheduler initialized');
  },

  // Start cron jobs
  startScheduledTasks() {
    // Clear existing tasks
    this.scheduledTasks.forEach(task => task.destroy());
    this.scheduledTasks = [];

    // Create tasks for each enabled platform
    Object.entries(this.config.platforms).forEach(([platform, config]) => {
      if (config.enabled && this.controllers[platform]) {
        const task = cron.schedule(config.frequency, async () => {
          console.log(`Scheduled fetch for ${platform}`);
          await this.fetchPlatform(platform);
        }, { scheduled: false });
        
        this.scheduledTasks.push({ platform, task });
        task.start();
        console.log(`Scheduled ${platform}: ${config.frequency}`);
      }
    });

    // Main fetch every 2 hours
    const mainTask = cron.schedule('0 */2 * * *', async () => {
      console.log('Main scheduled fetch for all platforms');
      await this.fetchAllContests();
    }, { scheduled: false });

    this.scheduledTasks.push({ platform: 'main', task: mainTask });
    mainTask.start();
    
    console.log(`Started ${this.scheduledTasks.length} scheduled tasks`);
  },

  // Fetch contests from all platforms
  async fetchAllContests() {
    if (this.isRunning) {
      console.log('Fetch already in progress, skipping...');
      return { success: false, reason: 'already_running' };
    }

    this.isRunning = true;
    this.fetchCount++;

    console.log('Starting fetch for all platforms...');
    
    const results = {};
    let totalFetched = 0;
    let successCount = 0;

    // Fetch from each enabled platform
    for (const [platform, config] of Object.entries(this.config.platforms)) {
      if (!config.enabled || !this.controllers[platform]) {
        console.log(`Skipping ${platform} (disabled or no controller)`);
        continue;
      }

      try {
        console.log(`Fetching ${platform} contests...`);
        const result = await this.fetchPlatform(platform);
        
        results[platform] = result;
        
        if (result.success) {
          totalFetched += result.totalFetched || 0;
          successCount++;
          console.log(`${platform}: ${result.totalFetched || 0} contests`);
        } else {
          console.log(`${platform}: Failed - ${result.error}`);
        }
      } catch (error) {
        console.error(`${platform}: Error -`, error.message);
        results[platform] = { success: false, error: error.message };
      }
    }

    // Update global state
    if (successCount > 0) {
      this.lastFetch = new Date();
    }

    this.isRunning = false;

    console.log(`Fetch complete: ${totalFetched} contests from ${successCount} platforms`);

    return {
      success: successCount > 0,
      totalFetched,
      successfulPlatforms: successCount,
      results,
      timestamp: new Date().toISOString()
    };
  },

  // Fetch contests from specific platform
  async fetchPlatform(platform) {
    const controller = this.controllers[platform];
    
    if (!controller) {
      return { success: false, error: 'Controller not found' };
    }

    try {
      let result;
      
      // Call the appropriate method based on controller
      if (typeof controller.fetchContests === 'function') {
        result = await controller.fetchContests();
      } else if (typeof controller.getAllContests === 'function') {
        result = await controller.getAllContests();
      } else {
        throw new Error('Controller missing fetch method');
      }

      if (result && result.success) {
        // Save to database if available
        await this.saveToDatabase(platform, result);
        return result;
      } else {
        throw new Error('No contests fetched or invalid result');
      }
    } catch (error) {
      console.error(`Error fetching ${platform}:`, error.message);
      return { success: false, error: error.message };
    }
  },

  // Save contests to database
  async saveToDatabase(platform, result) {
    try {
      const Contest = (await import('../models/Contest.js')).default;
      
      const contests = [
        ...(result.upcoming || result.upcomingContests || []),
        ...(result.past || result.pastContests || [])
      ];

      let savedCount = 0;
      for (const contest of contests) {
        try {
          await Contest.updateOne(
            { platformId: contest.platformId },
            { $set: { ...contest, updatedAt: new Date() } },
            { upsert: true }
          );
          savedCount++;
        } catch (saveError) {
          console.error(`Error saving contest ${contest.name}:`, saveError.message);
        }
      }

      console.log(`${platform}: Saved ${savedCount}/${contests.length} contests to database`);
      return savedCount;
    } catch (error) {
      console.error(`Error saving ${platform} contests to database:`, error.message);
      return 0;
    }
  },

  // Manual trigger for all platforms
  async triggerFetchAll() {
    console.log('Manual fetch triggered for all platforms');
    return await this.fetchAllContests();
  },

  // Manual trigger for specific platform
  async triggerFetch(platform) {
    console.log(`Manual fetch triggered for ${platform}`);
    return await this.fetchPlatform(platform);
  },

  // Test all platform APIs
  async testAllAPIs() {
    console.log('Testing APIs for all platforms...');
    
    const results = {};
    
    for (const [platform, controller] of Object.entries(this.controllers)) {
      if (typeof controller.testAPI === 'function') {
        try {
          results[platform] = await controller.testAPI();
          console.log(`${platform} API test:`, results[platform].status);
        } catch (error) {
          results[platform] = { status: 'failed', error: error.message };
          console.log(`${platform} API test failed:`, error.message);
        }
      } else {
        results[platform] = { status: 'no_test_method' };
      }
    }

    return {
      timestamp: new Date().toISOString(),
      results
    };
  },

  // Simple health check
  performHealthCheck() {
    const now = new Date();
    const timeSinceLastFetch = this.lastFetch 
      ? (now - this.lastFetch) / (1000 * 60) // minutes
      : null;

    const health = {
      timestamp: now.toISOString(),
      isRunning: this.isRunning,
      lastFetch: this.lastFetch ? this.lastFetch.toISOString() : 'Never',
      minutesSinceLastFetch: timeSinceLastFetch ? timeSinceLastFetch.toFixed(1) : 'N/A',
      totalFetches: this.fetchCount,
      activeTasks: this.scheduledTasks.length,
      status: this.getHealthStatus(timeSinceLastFetch)
    };

    console.log('Health check:', health);

    // Alert if no fetch for too long
    if (this.lastFetch === null) {
      console.log('WARNING: No successful fetches yet');
    } else if (timeSinceLastFetch > 180) { // 3 hours
      console.log('WARNING: No successful fetch in over 3 hours');
    }

    return health;
  },

  // Get health status
  getHealthStatus(timeSinceLastFetch) {
    if (!this.lastFetch) return 'unknown';
    if (timeSinceLastFetch > 240) return 'critical'; // 4+ hours
    if (timeSinceLastFetch > 180) return 'warning';  // 3+ hours
    if (timeSinceLastFetch > 120) return 'degraded'; // 2+ hours
    return 'healthy';
  },

  // Enable/disable platform
  togglePlatform(platform, enabled) {
    if (this.config.platforms[platform]) {
      this.config.platforms[platform].enabled = enabled;
      console.log(`${platform} ${enabled ? 'enabled' : 'disabled'}`);
      
      // Restart scheduler to apply changes
      this.startScheduledTasks();
      
      // Immediate fetch if enabled
      if (enabled && this.controllers[platform]) {
        setTimeout(() => this.triggerFetch(platform), 2000);
      }
      
      return true;
    }
    return false;
  },

  // Get current status
  getStatus() {
    const now = new Date();
    const timeSinceLastFetch = this.lastFetch 
      ? (now - this.lastFetch) / (1000 * 60) // minutes
      : null;

    return {
      isRunning: this.isRunning,
      lastFetch: this.lastFetch ? this.lastFetch.toISOString() : 'Never',
      timeSinceLastFetch: timeSinceLastFetch ? `${timeSinceLastFetch.toFixed(1)} minutes` : 'N/A',
      totalFetches: this.fetchCount,
      healthStatus: this.getHealthStatus(timeSinceLastFetch),
      activeTasks: this.scheduledTasks.length,
      enabledPlatforms: Object.entries(this.config.platforms)
        .filter(([_, config]) => config.enabled)
        .map(([platform]) => platform),
      controllers: Object.keys(this.controllers)
    };
  },

  // Clear all caches
  clearAllCaches() {
    Object.entries(this.controllers).forEach(([platform, controller]) => {
      if (typeof controller.clearCache === 'function') {
        controller.clearCache();
        console.log(`${platform} cache cleared`);
      }
    });
  },

  // Stop scheduler
  stop() {
    console.log('Stopping ContestScheduler...');
    this.scheduledTasks.forEach(({ task }) => task.destroy());
    this.scheduledTasks = [];
    console.log('All scheduled tasks stopped');
  },

  // Add new platform
  addPlatform(platform, controller, config = {}) {
    this.controllers[platform] = controller;
    this.config.platforms[platform] = {
      enabled: config.enabled || false,
      frequency: config.frequency || '0 */2 * * *'
    };
    
    console.log(`Added ${platform} controller`);
    
    // Restart scheduler to include new platform
    this.startScheduledTasks();
  }
};

export default ContestScheduler;