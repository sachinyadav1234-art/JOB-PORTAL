const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Login check — token valid hai ki nahi
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
    next();

  } catch (error) {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};

// Role check — sirf admin ya recruiter hi access kar sake
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