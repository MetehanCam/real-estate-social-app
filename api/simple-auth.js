import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

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

  if (method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Simple auth request:', {
      body: req.body,
      mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not set',
      jwtSecret: process.env.JWT_SECRET ? 'Set' : 'Not set'
    });

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Simple MongoDB connection
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    const db = client.db();
    const user = await db.collection('users').findOne({ email });
    
    await client.close();

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error('Simple auth error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}