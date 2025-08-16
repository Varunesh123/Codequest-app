import Contest from "../models/Contest";
import axios from 'axios';
// controller/HackerearthController.js
class HackerearthController {
  static async getContests(req, res) {
    try {
      const contests = await Contest.find({ 
        platform: 'hackerearth',
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
      console.error('HackerEarth contests error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching HackerEarth contests'
      });
    }
  }

  static async fetchContests() {
    try {
      const response = await axios.get('https://www.hackerearth.com/api/events/', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const contests = response.data.response
        .filter(event => 
          event.type === 'contest' && 
          new Date(event.start_utc_tz) > new Date()
        )
        .map(event => ({
          name: event.title,
          platform: 'hackerearth',
          url: event.url,
          startTime: new Date(event.start_utc_tz),
          endTime: new Date(event.end_utc_tz),
          duration: (new Date(event.end_utc_tz) - new Date(event.start_utc_tz)) / (1000 * 60),
          platformId: `hackerearth_${event.id}`,
          description: event.description || '',
          prizes: event.prizes || ''
        }));

      return contests;
    } catch (error) {
      throw new Error(`HackerEarth fetch error: ${error.message}`);
    }
  }
}
export default HackerearthController;