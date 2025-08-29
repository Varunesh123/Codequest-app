import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log('📡 Already connected to MongoDB');
      return;
    }

    // Prevent multiple connections
    if (mongoose.connection.readyState === 2) {
      console.log('⏳ MongoDB connection is connecting...');
      return;
    }

    // Modern MongoDB connection options (only supported ones)
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10, // Maximum number of connections in the connection pool
      serverSelectionTimeoutMS: 30000, // How long to try selecting a server
      socketTimeoutMS: 45000, // How long a send or receive on a socket can take
      heartbeatFrequencyMS: 10000, // How often to check the connection
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
      retryWrites: true, // Automatically retry write operations upon a network error
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`🏷️  Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    
    // Don't retry immediately in case of configuration errors
    if (error.message.includes('not supported') || error.message.includes('authentication')) {
      console.error('❌ Configuration error - please check your MongoDB URI and options');
      process.exit(1);
    }
    
    // Retry connection after 5 seconds for network errors
    console.log('🔄 Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

// Handle connection events (only set up once)
let eventsSet = false;

const setupConnectionEvents = () => {
  if (eventsSet) return;
  
  mongoose.connection.on('connected', () => {
    console.log('🔗 Mongoose connected to MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ Mongoose connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('🔌 Mongoose disconnected from MongoDB');
    
    // Attempt to reconnect if not in shutdown process
    if (!process.env.SHUTDOWN_IN_PROGRESS) {
      console.log('🔄 Attempting to reconnect in 5 seconds...');
      setTimeout(() => {
        if (mongoose.connection.readyState === 0) { // Only if disconnected
          connectDB();
        }
      }, 5000);
    }
  });

  mongoose.connection.on('reconnected', () => {
    console.log('🔄 Mongoose reconnected to MongoDB');
  });

  // MongoDB driver events
  mongoose.connection.on('close', () => {
    console.log('🔒 MongoDB connection closed');
  });

  mongoose.connection.on('fullsetup', () => {
    console.log('🌐 MongoDB replica set connection established');
  });

  eventsSet = true;
};

// Graceful shutdown handling
const setupGracefulShutdown = () => {
  const gracefulShutdown = async (signal) => {
    console.log(`🔄 ${signal} received, shutting down gracefully...`);
    process.env.SHUTDOWN_IN_PROGRESS = 'true';
    
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
        console.log('🔒 MongoDB connection closed gracefully.');
      }
      process.exit(0);
    } catch (error) {
      console.error('❌ Error closing MongoDB connection:', error);
      process.exit(1);
    }
  };

  // Handle different termination signals
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  
  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    gracefulShutdown('UNCAUGHT_EXCEPTION');
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err);
    gracefulShutdown('UNHANDLED_REJECTION');
  });
};

// Initialize connection events and shutdown handlers
setupConnectionEvents();
setupGracefulShutdown();

export default connectDB;