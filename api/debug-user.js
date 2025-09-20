import mongoose from 'mongoose';
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

export default async function handler(req, res) {
  try {
    await connectDB();
    
    // Find the user
    const user = await User.findOne({ email: 'metehancam@gmail.com' });
    
    if (!user) {
      return res.json({ 
        message: 'User not found',
        allUsers: await User.find({}, { email: 1, fullName: 1, password: 1 })
      });
    }
    
    return res.json({
      message: 'User found',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        password: user.password, // Show password for debugging
        hasComparePasswordMethod: typeof user.comparePassword === 'function'
      },
      passwordTest: {
        directComparison: user.password === '137928465',
        comparePasswordResult: await user.comparePassword('137928465')
      }
    });
    
  } catch (error) {
    console.error('Debug error:', error);
    return res.status(500).json({ 
      message: 'Error',
      error: error.message,
      stack: error.stack
    });
  }
}