import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// MongoDB connection
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

// Auth middleware
const authenticate = async (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// CORS configuration
const setCorsHeaders = (res, origin) => {
  const allowedOrigins = ['https://real-estate-social-app-9ca6.vercel.app', 'http://localhost:5173'];
  const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
};

export default async function handler(req, res) {
  const { method } = req;
  const origin = req.headers.origin;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    setCorsHeaders(res, origin);
    return res.status(200).end();
  }

  // Set CORS headers for all requests
  setCorsHeaders(res, origin);

  // Connect to database
  await connectDB();

  try {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    const route = pathname.replace('/api/users', '') || '/';
    const segments = route.split('/').filter(Boolean);

    if (route === '/' && method === 'GET') {
      // Get all users
      const users = await User.find()
        .select('-password')
        .sort({ createdAt: -1 });

      res.json(users);
    } else if (segments.length === 1 && method === 'GET') {
      // Get user by ID
      const userId = segments[0];
      
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } else if (route === '/profile' && method === 'PUT') {
      // Update user profile
      const user = await authenticate(req);
      const { fullName, bio, location, avatar } = req.body;
      
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { fullName, bio, location, avatar },
        { new: true, runValidators: true }
      ).select('-password');

      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'Route not found' });
    }
  } catch (error) {
    console.error('Users API error:', error);
    if (error.message === 'No token provided' || error.message === 'Invalid token' || error.message === 'User not found') {
      res.status(401).json({ message: 'Unauthorized' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}