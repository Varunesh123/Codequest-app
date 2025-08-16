const mongoose = require('mongoose');

const platformSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true
  },
  baseUrl: {
    type: String,
    required: true
  },
  apiEndpoint: {
    type: String,
    required: true
  },
  logoUrl: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  fetchConfig: {
    method: {
      type: String,
      enum: ['GET', 'POST'],
      default: 'GET'
    },
    headers: {
      type: Map,
      of: String,
      default: new Map()
    },
    rateLimit: {
      requests: {
        type: Number,
        default: 60
      },
      per: {
        type: String,
        enum: ['minute', 'hour', 'day'],
        default: 'hour'
      }
    }
  },
  lastFetch: {
    type: Date,
    default: null
  },
  fetchStatus: {
    type: String,
    enum: ['success', 'error', 'pending'],
    default: 'pending'
  },
  errorCount: {
    type: Number,
    default: 0
  },
  totalContestsFetched: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Method to check if platform can be fetched (rate limiting)
platformSchema.methods.canFetch = function() {
  if (!this.lastFetch) return true;
  
  const now = new Date();
  const timeDiff = now - this.lastFetch;
  const { requests, per } = this.fetchConfig.rateLimit;
  
  let intervalMs;
  switch (per) {
    case 'minute':
      intervalMs = 60 * 1000;
      break;
    case 'hour':
      intervalMs = 60 * 60 * 1000;
      break;
    case 'day':
      intervalMs = 24 * 60 * 60 * 1000;
      break;
    default:
      intervalMs = 60 * 60 * 1000; // Default to hour
  }
  
  return timeDiff >= (intervalMs / requests);
};

// Method to update fetch status
platformSchema.methods.updateFetchStatus = function(status, contestCount = 0) {
  this.fetchStatus = status;
  this.lastFetch = new Date();
  
  if (status === 'success') {
    this.errorCount = 0;
    this.totalContestsFetched += contestCount;
  } else if (status === 'error') {
    this.errorCount += 1;
  }
  
  return this.save();
};

export default mongoose.model('Platforms', platformSchema);