import Contest from "../models/Contest";
import axios from 'axios';

// controller/LeetcodeController.js
class LeetcodeController {
  static async getContests(req, res) {
    try {
      const contests = await Contest.find({ 
        platform: 'leetcode',
        isActive: true 
      }).sort({ startTime: 1 });

      res.json({
        success: true,
        data: contests.map(contest => ({
          ...contest.toObject(),
          status: contest.status,
          timeUntilStart: contest.timeUntilStart
        }))
      });
    } catch (error) {
      console.error('LeetCode contests error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching LeetCode contests'
      });
    }
  }

  static async fetchContests() {
    try {
      // LeetCode GraphQL API
      const query = `
        query {
          contestUpcomingContests {
            title
            titleSlug
            startTime
            duration
            description
          }
        }
      `;

      const response = await axios.post('https://leetcode.com/graphql', {
        query
      }, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const contestsData = response.data.data.contestUpcomingContests || [];
      
      const contests = contestsData.map(contest => ({
        name: contest.title,
        platform: 'leetcode',
        url: `https://leetcode.com/contest/${contest.titleSlug}`,
        startTime: new Date(contest.startTime * 1000),
        endTime: new Date((contest.startTime + contest.duration) * 1000),
        duration: contest.duration / 60,
        platformId: `leetcode_${contest.titleSlug}`,
        description: contest.description || ''
      }));

      return contests;
    } catch (error) {
      // Fallback to web scraping if GraphQL fails
      try {
        const response = await axios.get('https://leetcode.com/contest/');
        const $ = cheerio.load(response.data);
        
        const contests = [];
        $('.contest-question-info').each((index, element) => {
          const $el = $(element);
          const name = $el.find('.contest-title').text().trim();
          const timeText = $el.find('.contest-time').text().trim();
          
          if (name && timeText) {
            const startTime = new Date(timeText);
            contests.push({
              name,
              platform: 'leetcode',
              url: `https://leetcode.com/contest/`,
              startTime,
              endTime: new Date(startTime.getTime() + 90 * 60 * 1000), // Assume 90 minutes
              duration: 90,
              platformId: `leetcode_${index}_${Date.now()}`
            });
          }
        });
        
        return contests;
      } catch (scrapeError) {
        throw new Error(`LeetCode fetch error: ${error.message}`);
      }
    }
  }

  static async getUserProfile(req, res) {
    try {
      const { username } = req.params;
      
      const query = `
        query {
          matchedUser(username: "${username}") {
            username
            profile {
              ranking
              reputation
              starRating
            }
            submitStats {
              acSubmissionNum {
                difficulty
                count
                submissions
              }
            }
          }
        }
      `;

      const response = await axios.post('https://leetcode.com/graphql', {
        query
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const userData = response.data.data.matchedUser;
      
      res.json({
        success: true,
        data: {
          username: userData.username,
          ranking: userData.profile.ranking,
          reputation: userData.profile.reputation,
          starRating: userData.profile.starRating,
          submissions: userData.submitStats.acSubmissionNum
        }
      });
    } catch (error) {
      console.error('LeetCode profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching LeetCode profile'
      });
    }
  }
}

export default LeetcodeController;