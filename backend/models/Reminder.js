import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contest',
    required: true
  },
  reminderType: {
    type: String,
    enum: ['early', 'before'],
    required: true
  },
  reminderTime: {
    type: Date,
    required: true
  },
  customMessage: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isSent: {
    type: Boolean,
    default: false
  },
  sentAt: {
    type: Date,
    default: null
  },
  deliveryMethod: [{
    type: String,
    enum: ['email', 'browser', 'socket'],
    default: ['browser']
  }],
  snoozeUntil: {
    type: Date,
    default: null
  },
  attempts: {
    type: Number,
    default: 0
  },
  maxAttempts: {
    type: Number,
    default: 3
  },
  metadata: {
    contestName: String,
    platform: String,
    contestStartTime: Date
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
reminderSchema.index({ userId: 1, contestId: 1, reminderType: 1 });
reminderSchema.index({ reminderTime: 1, isActive: 1, isSent: 1 });
reminderSchema.index({ userId: 1, isSent: 1 });

// Method to check if reminder should be sent
reminderSchema.methods.shouldSend = function() {
  const now = new Date();
  return (
    this.isActive &&
    !this.isSent &&
    this.reminderTime <= now &&
    this.attempts < this.maxAttempts &&
    (!this.snoozeUntil || this.snoozeUntil <= now)
  );
};

// Method to mark as sent
reminderSchema.methods.markAsSent = function() {
  this.isSent = true;
  this.sentAt = new Date();
  return this.save();
};

// Method to increment attempts
reminderSchema.methods.incrementAttempts = function() {
  this.attempts += 1;
  return this.save();
};

// Method to snooze reminder
reminderSchema.methods.snooze = function(minutes = 5) {
  const now = new Date();
  this.snoozeUntil = new Date(now.getTime() + minutes * 60 * 1000);
  return this.save();
};

// Static method to create reminder for contest
reminderSchema.statics.createForContest = async function(userId, contest, user) {
  const reminders = [];
  const { beforeContestHours, reminderMinutes } = user.preferences.notificationSettings;
  
  // Early reminder (3 hours before by default)
  const earlyReminderTime = new Date(contest.startTime.getTime() - beforeContestHours * 60 * 60 * 1000);
  if (earlyReminderTime > new Date()) {
    reminders.push({
      userId,
      contestId: contest._id,
      reminderType: 'early',
      reminderTime: earlyReminderTime,
      deliveryMethod: user.preferences.notificationSettings.email ? ['email', 'browser'] : ['browser'],
      metadata: {
        contestName: contest.name,
        platform: contest.platform,
        contestStartTime: contest.startTime
      }
    });
  }
  
  // Before reminder (10 minutes before by default)
  const beforeReminderTime = new Date(contest.startTime.getTime() - reminderMinutes * 60 * 1000);
  if (beforeReminderTime > new Date()) {
    reminders.push({
      userId,
      contestId: contest._id,
      reminderType: 'before',
      reminderTime: beforeReminderTime,
      deliveryMethod: ['browser', 'socket'],
      metadata: {
        contestName: contest.name,
        platform: contest.platform,
        contestStartTime: contest.startTime
      }
    });
  }
  
  if (reminders.length > 0) {
    return await this.insertMany(reminders);
  }
  
  return [];
};

// Static method to get pending reminders
reminderSchema.statics.getPendingReminders = function() {
  const now = new Date();
  return this.find({
    isActive: true,
    isSent: false,
    reminderTime: { $lte: now },
    attempts: { $lt: this.maxAttempts },
    $or: [
      { snoozeUntil: { $exists: false } },
      { snoozeUntil: null },
      { snoozeUntil: { $lte: now } }
    ]
  }).populate('userId contestId');
};

export default mongoose.model('Reminders', reminderSchema);