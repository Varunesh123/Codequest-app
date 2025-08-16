import mongoose from "mongoose";

const contestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['leetcode', 'codeforces', 'codechef', 'geeksforgeeks', 'hackerearth', 'atcoder', 'topcoder'],
    lowercase: true
  },
  url: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // Duration in minutes
    required: true
  },
  registrationUrl: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Mixed'],
    default: 'Mixed'
  },
  participants: {
    type: Number,
    default: 0
  },
  prizes: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  platformId: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
contestSchema.index({ platform: 1, startTime: 1 });
contestSchema.index({ startTime: 1 });
contestSchema.index({ platformId: 1 });

// Virtual for contest status
contestSchema.virtual('status').get(function() {
  const now = new Date();
  if (now < this.startTime) return 'upcoming';
  if (now >= this.startTime && now <= this.endTime) return 'ongoing';
  return 'ended';
});

// Virtual for time until start
contestSchema.virtual('timeUntilStart').get(function() {
  const now = new Date();
  return Math.max(0, this.startTime.getTime() - now.getTime());
});

// Method to check if contest is starting soon (within 3 hours)
contestSchema.methods.isStartingSoon = function() {
  const now = new Date();
  const threeHoursFromNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  return this.startTime <= threeHoursFromNow && this.startTime > now;
};

// Method to check if contest is starting very soon (within 10 minutes)
contestSchema.methods.isStartingVerySoon = function() {
  const now = new Date();
  const tenMinutesFromNow = new Date(now.getTime() + 10 * 60 * 1000);
  return this.startTime <= tenMinutesFromNow && this.startTime > now;
};

contestSchema.set('toJSON', { virtuals: true });
contestSchema.set('toObject', { virtuals: true });

// module.exports = mongoose.model('Contest', contestSchema);
export default mongoose.model('Contests', contestSchema);
