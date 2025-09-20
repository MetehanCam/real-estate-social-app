// User registration endpoint
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      return res.status(500).json({ 
        error: 'Database configuration missing',
        debug: 'MONGODB_URI not found in environment'
      });
    }

    const { MongoClient } = await import('mongodb');
    
    let client;
    try {
      client = new MongoClient(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });

      await client.connect();
      const db = client.db('real-estate-social');
      
      // Check if user already exists
      const existingUser = await db.collection('users').findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Create new user
      const newUser = {
        email,
        password, // In production, hash this with bcrypt
        name,
        avatar: '',
        bio: '',
        location: '',
        joinedDate: new Date().toISOString().split('T')[0],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection('users').insertOne(newUser);
      
      // Return user without password
      const userResponse = {
        id: result.insertedId,
        email: newUser.email,
        name: newUser.name,
        avatar: newUser.avatar,
        bio: newUser.bio,
        location: newUser.location,
        joinedDate: newUser.joinedDate
      };

      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: userResponse
      });

    } finally {
      if (client) {
        await client.close();
      }
    }

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      error: 'Registration failed',
      message: error.message,
      type: error.constructor.name
    });
  }
}