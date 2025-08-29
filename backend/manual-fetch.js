// manual-fetch.js - Run this script to immediately populate your database
import LeetcodeController from './controllers/LeetcodeController.js';
import ContestScheduler from './ContestScheduler.js';
import mongoose from 'mongoose';

// Manual fetch script for immediate testing
const ManualFetch = {
  async connectDB() {
    try {
      // Replace with your MongoDB connection string
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your-db-name');
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      throw error;
    }
  },

  async testFetch() {
    console.log('🚀 Starting manual fetch test...');
    
    try {
      // Test API connectivity first
      console.log('\n🧪 Testing API connectivity...');
      const apiTests = await ContestScheduler.testAllAPIs();
      
      console.log('\n📊 API Test Results:');
      Object.entries(apiTests).forEach(([api, result]) => {
        console.log(`  ${api}: ${result.status} - ${result.data || result.error}`);
      });

      // Run the actual fetch
      console.log('\n📡 Running contest fetch...');
      const result = await LeetcodeController.fetchContests();
      
      console.log('\n✅ Fetch completed successfully!');
      console.log('📊 Results:', {
        totalFetched: result.totalFetched,
        upcoming: result.upcoming,
        past: result.past,
        sources: result.sources
      });

      // Verify data in database
      const Contest = (await import('./models/Contest.js')).default;
      const dbContests = await Contest.find({ platform: 'leetcode' }).sort({ startTime: -1 });
      
      console.log('\n💾 Database verification:');
      console.log(`Total contests in DB: ${dbContests.length}`);
      console.log(`Upcoming: ${dbContests.filter(c => new Date(c.startTime) > new Date()).length}`);
      console.log(`Past: ${dbContests.filter(c => new Date(c.startTime) <= new Date()).length}`);
      
      if (dbContests.length > 0) {
        console.log('\n📝 Sample contests in database:');
        dbContests.slice(0, 3).forEach(contest => {
          console.log(`  - ${contest.name} (${new Date(contest.startTime).toLocaleDateString()})`);
        });
      }

      return result;

    } catch (error) {
      console.error('❌ Manual fetch failed:', error);
      throw error;
    }
  },

  async run() {
    try {
      await this.connectDB();
      await this.testFetch();
      console.log('\n✅ Manual fetch completed successfully!');
      console.log('💡 Your frontend should now show contest data.');
      
    } catch (error) {
      console.error('\n❌ Manual fetch script failed:', error);
    } finally {
      await mongoose.disconnect();
      console.log('👋 Disconnected from MongoDB');
      process.exit(0);
    }
  }
};

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  ManualFetch.run();
}

export default ManualFetch;