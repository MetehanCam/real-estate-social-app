export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'API is working!', 
      timestamp: new Date().toISOString(),
      environment: {
        hasMongoUri: !!process.env.MONGODB_URI,
        hasJwtSecret: !!process.env.JWT_SECRET,
        mongoUriLength: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0
      }
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}