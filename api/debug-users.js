// Debug endpoint to check users in database
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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
      
      // Get all collections
      const collections = await db.listCollections().toArray();
      
      // Get users from users collection
      const users = await db.collection('users').find({}).limit(10).toArray();
      
      // Get sample user structure (without passwords)
      const sanitizedUsers = users.map(user => ({
        id: user._id,
        email: user.email,
        name: user.name,
        hasPassword: !!user.password,
        passwordLength: user.password ? user.password.length : 0,
        fields: Object.keys(user)
      }));

      return res.status(200).json({
        success: true,
        collections: collections.map(c => c.name),
        userCount: users.length,
        users: sanitizedUsers,
        dbName: db.databaseName
      });

    } finally {
      if (client) {
        await client.close();
      }
    }

  } catch (error) {
    console.error('Debug error:', error);
    return res.status(500).json({
      error: 'Debug failed',
      message: error.message,
      type: error.constructor.name
    });
  }
}