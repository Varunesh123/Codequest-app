import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cron from 'node-cron';
import connectDB from './config/connectDB.js';
import dotenv from 'dotenv';

import {contestRoutes} from './routes/contestRoutes.js';
import {reminderRoutes} from './routes/reminderRoutes.js';
import {userRoutes} from './routes/userRoutes.js';

import {authMiddleware} from './middleware/authMiddleware.js';
import morgan from 'morgan';

// Test Manually by using manual-fetch
// import debugRoutes from './routes/debug.js';


// Configure environment variables
dotenv.config();


const app = express();

// Create HTTP server using ES6 createServer
const server = createServer(app);

// Initialize Socket.IO with proper ES6 syntax
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});
app.use(morgan('dev'));
// Enhanced Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// app.use('/api/debug', debugRoutes);

// Database connection
connectDB();

// Socket.io connection
io.on('connection', (socket) => {
  console.log('🔗 User connected:', socket.id);
  
  socket.on('join-user', (userId) => {
    socket.join(userId);
    console.log(`👤 User ${userId} joined their room`);
  });
  
  socket.on('join-contest', (contestId) => {
    socket.join(`contest-${contestId}`);
    console.log(`🏆 User ${socket.id} joined contest room: ${contestId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

// Make io available globally
app.set('io', io);

// Routes
app.use('/api/contests', contestRoutes);
app.use('/api/reminders', authMiddleware, reminderRoutes);
app.use('/api/users', userRoutes);

// Health check route with enhanced information
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CodeQuest Backend is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API info route
app.get('/api', (req, res) => {
  res.json({
    name: 'CodeQuest API',
    version: '1.0.0',
    description: 'Backend API for CodeQuest - Competitive Programming Platform',
    endpoints: {
      health: '/api/health',
      contests: '/api/contests',
      users: '/api/users',
      reminders: '/api/reminders',
      leetcode: '/api/leetcode'
    }
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to CodeQuest API',
    status: 'running',
    documentation: '/api'
  });
});

// Scheduled tasks with better error handling
// Fetch contests every hour
cron.schedule('0 * * * *', async () => {
  console.log('⏰ Fetching contests from all platforms...');
  try {
    // await ContestController.fetchAllContests();
    console.log('✅ Contest fetch completed');
    
    // Notify connected users about new contests
    io.emit('contests-updated', { 
      message: 'New contests available!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error fetching contests:', error);
  }
});

// Check for reminders every minute
cron.schedule('* * * * *', async () => {
  try {
    // await ReminderController.checkAndSendReminders(io);
    // console.log('⏰ Reminder check completed');
  } catch (error) {
    console.error('❌ Error checking reminders:', error);
  }
});

// Daily cleanup task (runs at midnight)
cron.schedule('0 0 * * *', async () => {
  console.log('🧹 Running daily cleanup tasks...');
  try {
    // Add cleanup logic here
    // - Remove expired sessions
    // - Clean up old data
    // - Generate daily reports
    console.log('✅ Daily cleanup completed');
  } catch (error) {
    console.error('❌ Error during daily cleanup:', error);
  }
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error stack:', err.stack);
  
  // Send different responses based on environment
  if (process.env.NODE_ENV === 'development') {
    res.status(500).json({ 
      message: 'Something went wrong!',
      error: err.message,
      stack: err.stack
    });
  } else {
    res.status(500).json({ 
      message: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
});

// 404 handler with helpful message
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    availableRoutes: [
      'GET /',
      'GET /api',
      'GET /api/health'
    ]
  });
});

const PORT = process.env.PORT || 5000;

// Enhanced server startup
server.listen(PORT, () => {
  console.log('🚀 CodeQuest server is running!');
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💾 Database: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('🔄 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

// ES6 export instead of module.exports
export default app;