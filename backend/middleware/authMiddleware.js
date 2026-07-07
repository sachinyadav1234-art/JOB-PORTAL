const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authenticate request — verify JWT token
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, please login' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ message: 'User not found or deleted' });
    }
    next();

  } catch (error) {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};

// Authorize request — check if user role matches allowed roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user.role}' is not allowed to access this`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };