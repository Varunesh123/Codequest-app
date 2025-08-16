import Contest from '../models/Contest.js';
import Platform from '../models/Platform.js';
import axios from 'axios';

class ContestController {
  // Get all contests with filtering and pagination
  static async getAllContests(req, res) {
    try {
      const {
        platform,
        status,
        page = 1,
        limit = 20,
        sortBy = 'startTime',
        sortOrder = 'asc',
        search
      } = req.query;

      // Build filter object
      const filter = {};
      
      if (platform) {
        filter.platform = platform;
      }
      
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { platform: { $regex: search, $options: 'i' } }
        ];
      }

      // Handle status filtering
      const now = new Date();
      if (status) {
        switch (status) {
          case 'upcoming':
            filter.startTime = { $gt: now };
            break;
          case 'ongoing':
            filter.startTime = { $lte: now };
            filter.endTime = { $gte: now };
            break;
          case 'ended':
            filter.endTime = { $lt: now };
            break;
        }
      }

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Execute query
      const [contests, total] = await Promise.all([
        Contest.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit)),
        Contest.countDocuments(filter)
      ]);

      // Add virtual fields
      const contestsWithStatus = contests.map(contest => ({
        ...contest.toObject(),
        status: contest.status,
        timeUntilStart: contest.timeUntilStart
      }));

      res.json({
        success: true,
        data: {
          contests: contestsWithStatus,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            totalContests: total,
            hasNextPage: skip + contests.length < total,
            hasPrevPage: parseInt(page) > 1
          }
        }
      });
    } catch (error) {
      console.error('Error fetching contests:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching contests'
      });
    }
  }

  // Get contest by ID
  static async getContestById(req, res) {
    try {
      const { id } = req.params;
      const contest = await Contest.findById(id);

      if (!contest) {
        return res.status(404).json({
          success: false,
          message: 'Contest not found'
        });
      }

      res.json({
        success: true,
        data: {
          ...contest.toObject(),
          status: contest.status,
          timeUntilStart: contest.timeUntilStart
        }
      });
    } catch (error) {
      console.error('Error fetching contest:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching contest'
      });
    }
  }

  // Get upcoming contests
  static async getUpcomingContests(req, res) {
    try {
      const { platform, limit = 10 } = req.query;
      const now = new Date();
      
      const filter = {
        startTime: { $gt: now },
        isActive: true
      };
      
      if (platform) {
        filter.platform = platform;
      }

      const contests = await Contest.find(filter)
        .sort({ startTime: 1 })
        .limit(parseInt(limit));

      const contestsWithStatus = contests.map(contest => ({
        ...contest.toObject(),
        status: contest.status,
        timeUntilStart: contest.timeUntilStart
      }));

      res.json({
        success: true,
        data: contestsWithStatus
      });
    } catch (error) {
      console.error('Error fetching upcoming contests:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching upcoming contests'
      });
    }
  }

  // Get ongoing contests
  static async getOngoingContests(req, res) {
    try {
      const now = new Date();
      const contests = await Contest.find({
        startTime: { $lte: now },
        endTime: { $gte: now },
        isActive: true
      }).sort({ startTime: 1 });

      res.json({
        success: true,
        data: contests.map(contest => ({
          ...contest.toObject(),
          status: 'ongoing'
        }))
      });
    } catch (error) {
      console.error('Error fetching ongoing contests:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching ongoing contests'
      });
    }
  }

  // Get platform statistics
  static async getPlatformStats(req, res) {
    try {
      const stats = await Contest.aggregate([
        {
          $group: {
            _id: '$platform',
            totalContests: { $sum: 1 },
            upcomingContests: {
              $sum: {
                $cond: [
                  { $gt: ['$startTime', new Date()] },
                  1,
                  0
                ]
              }
            },
            ongoingContests: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $lte: ['$startTime', new Date()] },
                      { $gte: ['$endTime', new Date()] }
                    ]
                  },
                  1,
                  0
                ]
              }
            }
          }
        },
        {
          $sort: { totalContests: -1 }
        }
      ]);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching platform statistics'
      });
    }
  }

  // Fetch contests from all platforms
  static async fetchAllContests() {
    try {
      const platforms = await Platform.find({ isActive: true });
      const fetchPromises = platforms.map(platform => this.fetchContestsFromPlatform(platform));
      
      const results = await Promise.allSettled(fetchPromises);
      
      let totalFetched = 0;
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          totalFetched += result.value;
          console.log(`✅ ${platforms[index].name}: ${result.value} contests fetched`);
        } else {
          console.error(`❌ ${platforms[index].name}: ${result.reason}`);
        }
      });

      console.log(`Total contests fetched: ${totalFetched}`);
      return totalFetched;
    } catch (error) {
      console.error('Error in fetchAllContests:', error);
      throw error;
    }
  }

  // Fetch contests from specific platform
  static async fetchContestsFromPlatform(platform) {
    try {
      if (!platform.canFetch()) {
        console.log(`Skipping ${platform.name} due to rate limiting`);
        return 0;
      }

      let contests = [];
      
      switch (platform.name) {
        case 'leetcode':
          contests = await this.fetchLeetCodeContests();
          break;
        case 'codeforces':
          contests = await this.fetchCodeforcesContests();
          break;
        case 'codechef':
          contests = await this.fetchCodeChefContests();
          break;
        case 'geeksforgeeks':
          contests = await this.fetchGeeksforGeeksContests();
          break;
        case 'hackerearth':
          contests = await this.fetchHackerEarthContests();
          break;
        default:
          console.log(`No fetcher implemented for ${platform.name}`);
          return 0;
      }

      // Save contests to database
      let savedCount = 0;
      for (const contestData of contests) {
        try {
          await Contest.findOneAndUpdate(
            { platformId: contestData.platformId },
            contestData,
            { upsert: true, new: true }
          );
          savedCount++;
        } catch (error) {
          console.error(`Error saving contest ${contestData.name}:`, error.message);
        }
      }

      await platform.updateFetchStatus('success', savedCount);
      return savedCount;
    } catch (error) {
      console.error(`Error fetching from ${platform.name}:`, error);
      await platform.updateFetchStatus('error');
      throw error;
    }
  }

  // LeetCode contest fetcher
  static async fetchLeetCodeContests() {
    try {
      const response = await axios.get('https://leetcode.com/api/problems/all/');
      // LeetCode doesn't have a direct contest API, so we'll simulate
      // In a real implementation, you'd need to scrape or use unofficial APIs
      
      return []; // Placeholder - implement actual fetching logic
    } catch (error) {
      throw new Error(`LeetCode fetch error: ${error.message}`);
    }
  }

  // Codeforces contest fetcher
  static async fetchCodeforcesContests() {
    try {
      const response = await axios.get('https://codeforces.com/api/contest.list');
      
      if (response.data.status !== 'OK') {
        throw new Error('Codeforces API returned error status');
      }

      const contests = response.data.result
        .filter(contest => contest.phase === 'BEFORE')
        .map(contest => ({
          name: contest.name,
          platform: 'codeforces',
          url: `https://codeforces.com/contest/${contest.id}`,
          startTime: new Date(contest.startTimeSeconds * 1000),
          endTime: new Date((contest.startTimeSeconds + contest.durationSeconds) * 1000),
          duration: contest.durationSeconds / 60,
          platformId: `codeforces_${contest.id}`,
          participants: contest.preparedBy ? 0 : undefined,
          difficulty: 'Mixed'
        }));

      return contests;
    } catch (error) {
      throw new Error(`Codeforces fetch error: ${error.message}`);
    }
  }

  // CodeChef contest fetcher
  static async fetchCodeChefContests() {
    try {
      // CodeChef doesn't have a public API for contests
      // This would require web scraping or unofficial APIs
      return [];
    } catch (error) {
      throw new Error(`CodeChef fetch error: ${error.message}`);
    }
  }

  // GeeksforGeeks contest fetcher
  static async fetchGeeksforGeeksContests() {
    try {
      // GeeksforGeeks would require web scraping
      return [];
    } catch (error) {
      throw new Error(`GeeksforGeeks fetch error: ${error.message}`);
    }
  }

  // HackerEarth contest fetcher
  static async fetchHackerEarthContests() {
    try {
      const response = await axios.get('https://www.hackerearth.com/api/events/');
      
      const contests = response.data.response
        .filter(event => event.type === 'contest' && new Date(event.start_utc_tz) > new Date())
        .map(event => ({
          name: event.title,
          platform: 'hackerearth',
          url: event.url,
          startTime: new Date(event.start_utc_tz),
          endTime: new Date(event.end_utc_tz),
          duration: (new Date(event.end_utc_tz) - new Date(event.start_utc_tz)) / (1000 * 60),
          platformId: `hackerearth_${event.id}`,
          description: event.description,
          prizes: event.prizes || ''
        }));

      return contests;
    } catch (error) {
      throw new Error(`HackerEarth fetch error: ${error.message}`);
    }
  }

  // Get contests for user's preferred platforms
  static async getUserContests(req, res) {
    try {
      const user = req.user;
      const preferredPlatforms = user.getPreferredPlatforms();
      
      const now = new Date();
      const contests = await Contest.find({
        platform: { $in: preferredPlatforms },
        startTime: { $gt: now },
        isActive: true
      })
      .sort({ startTime: 1 })
      .limit(50);

      res.json({
        success: true,
        data: contests.map(contest => ({
          ...contest.toObject(),
          status: contest.status,
          timeUntilStart: contest.timeUntilStart
        }))
      });
    } catch (error) {
      console.error('Error fetching user contests:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching contests for user'
      });
    }
  }
}

export default ContestController;