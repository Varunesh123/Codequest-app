import Contest from "../models/Contest";
import axios from 'axios';

// controller/GeeksforGeeksController.js
class GeeksforGeeksController {
  static async getContests(req, res) {
    try {
      const contests = await Contest.find({ 
        platform: 'geeksforgeeks',
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
      console.error('GeeksforGeeks contests error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching GeeksforGeeks contests'
      });
    }
  }

  static async fetchContests() {
    try {
      // GeeksforGeeks would require web scraping
      const response = await axios.get('https://practice.geeksforgeeks.org/events/');
      const $ = cheerio.load(response.data);
      
      const contests = [];
      $('.event-card').each((index, element) => {
        const $el = $(element);
        const name = $el.find('.event-title').text().trim();
        const startTime = $el.find('.event-date').text().trim();
        
        if (name && startTime) {
          contests.push({
            name,
            platform: 'geeksforgeeks',
            url: 'https://practice.geeksforgeeks.org' + $el.find('a').attr('href'),
            startTime: new Date(startTime),
            endTime: new Date(new Date(startTime).getTime() + 2 * 60 * 60 * 1000), // Assume 2 hours
            duration: 120,
            platformId: `gfg_${index}_${Date.now()}`
          });
        }
      });

      return contests;
    } catch (error) {
      throw new Error(`GeeksforGeeks fetch error: ${error.message}`);
    }
  }
}
export default GeeksforGeeksController;