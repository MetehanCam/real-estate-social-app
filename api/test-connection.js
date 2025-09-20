export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Check environment variables
    const mongoUri = process.env.MONGODB_URI;
    const jwtSecret = process.env.JWT_SECRET;

    if (!mongoUri) {
      return res.status(500).json({ 
        error: 'MONGODB_URI environment variable is not set',
        env: process.env.NODE_ENV || 'unknown'
      });
    }

    if (!jwtSecret) {
      return res.status(500).json({ 
        error: 'JWT_SECRET environment variable is not set',
        env: process.env.NODE_ENV || 'unknown'
      });
    }

    // Test basic MongoDB connection
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(mongoUri);
    
    await client.connect();
    const db = client.db();
    
    // Test database connection
    const collections = await db.listCollections().toArray();
    
    await client.close();

    return res.status(200).json({
      success: true,
      message: 'MongoDB connection successful',
      collections: collections.map(c => c.name),
      env: process.env.NODE_ENV || 'unknown'
    });

  } catch (error) {
    console.error('Connection test error:', error);
    return res.status(500).json({
      error: 'Connection failed',
      message: error.message,
      stack: error.stack,
      env: process.env.NODE_ENV || 'unknown'
    });
  }
}