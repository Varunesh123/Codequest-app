// controller/CodechefController.js
import Contest from '../models/Contest.js'; // Assuming you have a Contest model
import axios from 'axios';
import * as cheerio from 'cheerio'; // For web scraping CodeChef profiles

class CodechefController {
  static async getContests(req, res) {
    try {
      const contests = await Contest.find({ 
        platform: 'codechef',
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
      console.error('CodeChef contests error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching CodeChef contests'
      });
    }
  }

  static async fetchContests() {
    try {
      // CodeChef API endpoint (if available) or web scraping
      const response = await axios.get('https://www.codechef.com/api/contests/school');
      
      // Note: CodeChef doesn't have a public API, so this would require web scraping
      // For demonstration, returning empty array
      return [];
    } catch (error) {
      throw new Error(`CodeChef fetch error: ${error.message}`);
    }
  }

  static async getUserProfile(req, res) {
    try {
      const { username } = req.params;
      
      // Scrape user profile from CodeChef
      const profileUrl = `https://www.codechef.com/users/${username}`;
      const response = await axios.get(profileUrl);
      const $ = cheerio.load(response.data);
      
      // Extract profile data (this is a simplified example)
      const profile = {
        username,
        rating: $('.rating-number').text() || '0',
        stars: $('.rating-star').length || 0,
        globalRank: $('.rating-ranks .global-rank').text() || 'N/A',
        countryRank: $('.rating-ranks .country-rank').text() || 'N/A'
      };

      res.json({
        success: true,
        data: profile
      });
    } catch (error) {
      console.error('CodeChef profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching CodeChef profile'
      });
    }
  }
}
export default CodechefController;