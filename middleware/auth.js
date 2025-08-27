const jwt = require('jsonwebtoken');
const userService = require('../lib/services/userService');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Authentication required' });
      }
      const user = await userService.findById(req.user.id);
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ success: false, error: 'Forbidden: insufficient permissions' });
      }
      next();
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  };
};

module.exports = {
  authenticate,
  authorize,
};
