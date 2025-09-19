import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Post from '../models/Post.js';
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
    const route = pathname.replace('/api/posts', '') || '/';
    const segments = route.split('/').filter(Boolean);

    if (route === '/' && method === 'GET') {
      // Get all posts
      const posts = await Post.find()
        .populate('user', 'username fullName avatar')
        .populate('comments.user', 'username fullName avatar')
        .sort({ createdAt: -1 });

      res.json(posts);
    } else if (route === '/' && method === 'POST') {
      // Create a new post
      const user = await authenticate(req);
      const { content, image } = req.body;

      const post = new Post({
        user: user._id,
        content,
        image
      });

      await post.save();
      await post.populate('user', 'username fullName avatar');

      res.status(201).json(post);
    } else if (segments.length === 2 && segments[1] === 'like' && method === 'POST') {
      // Like/Unlike a post
      const user = await authenticate(req);
      const postId = segments[0];
      
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const likeIndex = post.likes.indexOf(user._id);
      if (likeIndex > -1) {
        post.likes.splice(likeIndex, 1);
      } else {
        post.likes.push(user._id);
      }

      await post.save();
      await post.populate('user', 'username fullName avatar');

      res.json(post);
    } else if (segments.length === 2 && segments[1] === 'comments' && method === 'POST') {
      // Add comment to post
      const user = await authenticate(req);
      const postId = segments[0];
      const { content } = req.body;

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      post.comments.push({
        user: user._id,
        content,
        createdAt: new Date()
      });

      await post.save();
      await post.populate('user', 'username fullName avatar');
      await post.populate('comments.user', 'username fullName avatar');

      res.json(post);
    } else if (segments.length === 1 && method === 'DELETE') {
      // Delete a post
      const user = await authenticate(req);
      const postId = segments[0];

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      if (post.user.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this post' });
      }

      await Post.findByIdAndDelete(postId);
      res.json({ message: 'Post deleted successfully' });
    } else {
      res.status(404).json({ message: 'Route not found' });
    }
  } catch (error) {
    console.error('Posts API error:', error);
    if (error.message === 'No token provided' || error.message === 'Invalid token' || error.message === 'User not found') {
      res.status(401).json({ message: 'Unauthorized' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}