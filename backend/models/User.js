import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profileImage: {
    type: String,
    default: ''
  },
  preferences: {
    platforms: [{
      type: String,
      enum: ['leetcode', 'codeforces', 'codechef', 'geeksforgeeks', 'hackerearth', 'atcoder', 'topcoder']
    }],
    notificationSettings: {
      email: {
        type: Boolean,
        default: true
      },
      browser: {
        type: Boolean,
        default: true
      },
      beforeContestHours: {
        type: Number,
        default: 3,
        min: 1,
        max: 24
      },
      reminderMinutes: {
        type: Number,
        default: 10,
        min: 1,
        max: 60
      }
    },
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  platformProfiles: {
    leetcode: {
      username: String,
      rating: Number,
      rank: Number
    },
    codeforces: {
      username: String,
      rating: Number,
      rank: String
    },
    codechef: {
      username: String,
      rating: Number,
      stars: Number
    },
    geeksforgeeks: {
      username: String,
      score: Number
    },
    hackerearth: {
      username: String,
      rating: Number
    }
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get user's preferred platforms
userSchema.methods.getPreferredPlatforms = function() {
  return this.preferences.platforms.length > 0 
    ? this.preferences.platforms 
    : ['leetcode', 'codeforces', 'codechef', 'geeksforgeeks', 'hackerearth'];
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.emailVerificationToken;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpires;
  return userObject;
};

export default mongoose.model('Users', userSchema);