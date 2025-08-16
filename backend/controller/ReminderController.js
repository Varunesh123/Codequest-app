import Reminder from '../models/Reminder.js';
import Contest from '../models/Contest.js';
import nodemailer from 'nodemailer';

class ReminderController {
  // Create reminder for contest
  static async createReminder(req, res) {
    try {
      const userId = req.user._id;
      const { contestId, reminderType, customMessage, deliveryMethod } = req.body;

      // Validate contest exists
      const contest = await Contest.findById(contestId);
      if (!contest) {
        return res.status(404).json({
          success: false,
          message: 'Contest not found'
        });
      }

      // Check if reminder already exists
      const existingReminder = await Reminder.findOne({
        userId,
        contestId,
        reminderType
      });

      if (existingReminder) {
        return res.status(400).json({
          success: false,
          message: 'Reminder already exists for this contest'
        });
      }

      // Calculate reminder time based on type
      let reminderTime;
      const user = req.user;
      
      if (reminderType === 'early') {
        const hours = user.preferences.notificationSettings.beforeContestHours || 3;
        reminderTime = new Date(contest.startTime.getTime() - hours * 60 * 60 * 1000);
      } else if (reminderType === 'before') {
        const minutes = user.preferences.notificationSettings.reminderMinutes || 10;
        reminderTime = new Date(contest.startTime.getTime() - minutes * 60 * 1000);
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid reminder type'
        });
      }

      // Don't create reminder if time has passed
      if (reminderTime <= new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Cannot create reminder for past time'
        });
      }

      const reminder = new Reminder({
        userId,
        contestId,
        reminderType,
        reminderTime,
        customMessage: customMessage || '',
        deliveryMethod: deliveryMethod || ['browser'],
        metadata: {
          contestName: contest.name,
          platform: contest.platform,
          contestStartTime: contest.startTime
        }
      });

      await reminder.save();

      res.status(201).json({
        success: true,
        message: 'Reminder created successfully',
        data: reminder
      });
    } catch (error) {
      console.error('Create reminder error:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating reminder'
      });
    }
  }

  // Get user's reminders
  static async getUserReminders(req, res) {
    try {
      const userId = req.user._id;
      const { page = 1, limit = 20, status = 'active' } = req.query;

      const filter = { userId };
      
      if (status === 'active') {
        filter.isActive = true;
        filter.isSent = false;
      } else if (status === 'sent') {
        filter.isSent = true;
      } else if (status === 'all') {
        // No additional filter
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [reminders, total] = await Promise.all([
        Reminder.find(filter)
          .populate('contestId', 'name platform startTime endTime url')
          .sort({ reminderTime: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        Reminder.countDocuments(filter)
      ]);

      res.json({
        success: true,
        data: {
          reminders,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            totalReminders: total,
            hasNextPage: skip + reminders.length < total,
            hasPrevPage: parseInt(page) > 1
          }
        }
      });
    } catch (error) {
      console.error('Get user reminders error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching reminders'
      });
    }
  }

  // Update reminder
  static async updateReminder(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      const { customMessage, deliveryMethod, isActive } = req.body;

      const reminder = await Reminder.findOne({ _id: id, userId });

      if (!reminder) {
        return res.status(404).json({
          success: false,
          message: 'Reminder not found'
        });
      }

      if (reminder.isSent) {
        return res.status(400).json({
          success: false,
          message: 'Cannot update sent reminder'
        });
      }

      const updateData = {};
      if (customMessage !== undefined) updateData.customMessage = customMessage;
      if (deliveryMethod !== undefined) updateData.deliveryMethod = deliveryMethod;
      if (isActive !== undefined) updateData.isActive = isActive;

      const updatedReminder = await Reminder.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      ).populate('contestId', 'name platform startTime endTime url');

      res.json({
        success: true,
        message: 'Reminder updated successfully',
        data: updatedReminder
      });
    } catch (error) {
      console.error('Update reminder error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating reminder'
      });
    }
  }

  // Delete reminder
  static async deleteReminder(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const reminder = await Reminder.findOne({ _id: id, userId });

      if (!reminder) {
        return res.status(404).json({
          success: false,
          message: 'Reminder not found'
        });
      }

      await Reminder.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Reminder deleted successfully'
      });
    } catch (error) {
      console.error('Delete reminder error:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting reminder'
      });
    }
  }

  // Snooze reminder
  static async snoozeReminder(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      const { minutes = 5 } = req.body;

      const reminder = await Reminder.findOne({ _id: id, userId });

      if (!reminder) {
        return res.status(404).json({
          success: false,
          message: 'Reminder not found'
        });
      }

      await reminder.snooze(minutes);

      res.json({
        success: true,
        message: `Reminder snoozed for ${minutes} minutes`
      });
    } catch (error) {
      console.error('Snooze reminder error:', error);
      res.status(500).json({
        success: false,
        message: 'Error snoozing reminder'
      });
    }
  }

  // Auto-create reminders for user's preferred contests
  static async autoCreateReminders(req, res) {
    try {
      const userId = req.user._id;
      const user = req.user;
      
      // Get upcoming contests for user's preferred platforms
      const preferredPlatforms = user.getPreferredPlatforms();
      const now = new Date();
      const futureLimit = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

      const upcomingContests = await Contest.find({
        platform: { $in: preferredPlatforms },
        startTime: { $gt: now, $lt: futureLimit },
        isActive: true
      });

      let createdCount = 0;
      const errors = [];

      for (const contest of upcomingContests) {
        try {
          const existingReminders = await Reminder.find({
            userId,
            contestId: contest._id
          });

          if (existingReminders.length === 0) {
            const reminders = await Reminder.createForContest(userId, contest, user);
            createdCount += reminders.length;
          }
        } catch (error) {
          errors.push(`Failed to create reminder for ${contest.name}: ${error.message}`);
        }
      }

      res.json({
        success: true,
        message: `Auto-created ${createdCount} reminders`,
        data: {
          createdCount,
          errors: errors.length > 0 ? errors : undefined
        }
      });
    } catch (error) {
      console.error('Auto create reminders error:', error);
      res.status(500).json({
        success: false,
        message: 'Error auto-creating reminders'
      });
    }
  }

  // Check and send pending reminders (called by cron job)
  static async checkAndSendReminders(io) {
    try {
      const pendingReminders = await Reminder.getPendingReminders();
      
      console.log(`Found ${pendingReminders.length} pending reminders`);

      for (const reminder of pendingReminders) {
        try {
          await this.sendReminder(reminder, io);
          await reminder.markAsSent();
          console.log(`✅ Sent reminder ${reminder._id} to user ${reminder.userId}`);
        } catch (error) {
          console.error(`❌ Failed to send reminder ${reminder._id}:`, error);
          await reminder.incrementAttempts();
        }
      }

      return pendingReminders.length;
    } catch (error) {
      console.error('Error checking reminders:', error);
      throw error;
    }
  }

  // Send individual reminder
  static async sendReminder(reminder, io) {
    const user = reminder.userId;
    const contest = reminder.contestId;

    // Prepare reminder data
    const reminderData = {
      id: reminder._id,
      type: reminder.reminderType,
      contest: {
        name: contest.name,
        platform: contest.platform,
        startTime: contest.startTime,
        url: contest.url
      },
      customMessage: reminder.customMessage,
      timeUntilStart: contest.startTime.getTime() - new Date().getTime()
    };

    // Send via different delivery methods
    const promises = reminder.deliveryMethod.map(method => {
      switch (method) {
        case 'email':
          return this.sendEmailReminder(user, reminderData);
        case 'browser':
          return this.sendBrowserNotification(user, reminderData);
        case 'socket':
          return this.sendSocketNotification(user, reminderData, io);
        default:
          return Promise.resolve();
      }
    });

    await Promise.allSettled(promises);
  }

  // Send email reminder
  static async sendEmailReminder(user, reminderData) {
    try {
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const timeUntilStart = Math.floor(reminderData.timeUntilStart / (1000 * 60));
      const timeText = timeUntilStart > 60 
        ? `${Math.floor(timeUntilStart / 60)} hours and ${timeUntilStart % 60} minutes`
        : `${timeUntilStart} minutes`;

      const subject = reminderData.type === 'early' 
        ? `Contest Alert: ${reminderData.contest.name} starting soon!`
        : `Contest Starting: ${reminderData.contest.name} in ${timeText}!`;

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">🚀 Contest Reminder</h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #1e293b;">${reminderData.contest.name}</h3>
            <p style="margin: 5px 0;"><strong>Platform:</strong> ${reminderData.contest.platform}</p>
            <p style="margin: 5px 0;"><strong>Starts in:</strong> ${timeText}</p>
            <p style="margin: 5px 0;"><strong>Start Time:</strong> ${new Date(reminderData.contest.startTime).toLocaleString()}</p>
          </div>

          ${reminderData.customMessage ? `
            <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; border-left: 4px solid #0284c7;">
              <p style="margin: 0; font-style: italic;">${reminderData.customMessage}</p>
            </div>
          ` : ''}

          <div style="text-align: center; margin: 30px 0;">
            <a href="${reminderData.contest.url}" 
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Join Contest
            </a>
          </div>

          <p style="color: #64748b; font-size: 14px; text-align: center;">
            Happy coding! 🎯<br>
            - CodeQuest Team
          </p>
        </div>
      `;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject,
        html
      });

      console.log(`Email reminder sent to ${user.email}`);
    } catch (error) {
      console.error('Failed to send email reminder:', error);
      throw error;
    }
  }

  // Send browser notification (would be handled by frontend)
  static async sendBrowserNotification(user, reminderData) {
    // This would typically be handled by the frontend using the Notification API
    // Here we just log that a browser notification should be sent
    console.log(`Browser notification should be sent to user ${user._id}`);
    return Promise.resolve();
  }

  // Send socket notification
  static async sendSocketNotification(user, reminderData, io) {
    try {
      if (io) {
        io.to(user._id.toString()).emit('contest_reminder', {
          ...reminderData,
          timestamp: new Date()
        });
        console.log(`Socket notification sent to user ${user._id}`);
      }
    } catch (error) {
      console.error('Failed to send socket notification:', error);
      throw error;
    }
  }

  // Get reminder statistics
  static async getReminderStats(req, res) {
    try {
      const userId = req.user._id;

      const stats = await Reminder.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            totalReminders: { $sum: 1 },
            activeReminders: {
              $sum: { $cond: [{ $and: ['$isActive', { $not: '$isSent' }] }, 1, 0] }
            },
            sentReminders: {
              $sum: { $cond: ['$isSent', 1, 0] }
            },
            emailReminders: {
              $sum: { $cond: [{ $in: ['email', '$deliveryMethod'] }, 1, 0] }
            },
            browserReminders: {
              $sum: { $cond: [{ $in: ['browser', '$deliveryMethod'] }, 1, 0] }
            }
          }
        }
      ]);

      const result = stats[0] || {
        totalReminders: 0,
        activeReminders: 0,
        sentReminders: 0,
        emailReminders: 0,
        browserReminders: 0
      };

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get reminder stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching reminder statistics'
      });
    }
  }

  // Bulk create reminders for multiple contests
  static async bulkCreateReminders(req, res) {
    try {
      const userId = req.user._id;
      const user = req.user;
      const { contestIds } = req.body;

      if (!Array.isArray(contestIds) || contestIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Contest IDs array is required'
        });
      }

      const contests = await Contest.find({
        _id: { $in: contestIds },
        startTime: { $gt: new Date() }
      });

      let createdCount = 0;
      const errors = [];

      for (const contest of contests) {
        try {
          const existingReminders = await Reminder.find({
            userId,
            contestId: contest._id
          });

          if (existingReminders.length === 0) {
            const reminders = await Reminder.createForContest(userId, contest, user);
            createdCount += reminders.length;
          } else {
            errors.push(`Reminders already exist for ${contest.name}`);
          }
        } catch (error) {
          errors.push(`Failed to create reminder for ${contest.name}: ${error.message}`);
        }
      }

      res.json({
        success: true,
        message: `Created ${createdCount} reminders`,
        data: {
          createdCount,
          errors: errors.length > 0 ? errors : undefined
        }
      });
    } catch (error) {
      console.error('Bulk create reminders error:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating bulk reminders'
      });
    }
  }
}

export default ReminderController;