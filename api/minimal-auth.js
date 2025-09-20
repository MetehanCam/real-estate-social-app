// Minimal auth endpoint for Vercel serverless functions
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Check environment variables first
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      return res.status(500).json({ 
        error: 'Database configuration missing',
        debug: 'MONGODB_URI not found in environment'
      });
    }

    // Import MongoDB client
    const { MongoClient } = await import('mongodb');
    
    let client;
    try {
      // Create connection with timeout
      client = new MongoClient(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });

      await client.connect();
      const db = client.db('real-estate-social');
      
      // Find user
      const user = await db.collection('users').findOne({ email });
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Simple password check (in production, use bcrypt)
      if (user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Success response
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      });

    } finally {
      if (client) {
        await client.close();
      }
    }

  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({
      error: 'Authentication failed',
      message: error.message,
      type: error.constructor.name
    });
  }
}