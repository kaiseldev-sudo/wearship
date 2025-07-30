const User = require('../models/User');

// Simple authentication middleware
// In a real app, this would verify JWT tokens
const authenticateToken = async (req, res, next) => {
  try {
    // Get user ID from request headers (frontend should send this)
    const userId = req.headers['x-user-id'] || req.body.user_id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Verify user exists and is active
    const user = await User.findById(parseInt(userId));
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is not active'
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

module.exports = {
  authenticateToken
}; 