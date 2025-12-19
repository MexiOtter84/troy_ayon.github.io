// Authentication middleware

// Simple in-memory user store (for demo - in production use database)
const users = {
  admin: {
    username: 'admin',
    password: 'admin123', // In production, use hashed passwords!
    role: 'admin'
  }
};

// Middleware to check if user is authenticated
function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({
      success: false,
      error: 'Authentication required',
      message: 'Please login to access this resource'
    });
  }
}

// Middleware to check if user is admin
function requireAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: 'Admin access required'
    });
  }
}

// Authenticate user
function authenticateUser(username, password) {
  const user = users[username];

  if (!user) {
    return null;
  }

  // In production, use bcrypt.compare for password hashing
  if (user.password === password) {
    return {
      username: user.username,
      role: user.role
    };
  }

  return null;
}

module.exports = {
  requireAuth,
  requireAdmin,
  authenticateUser,
  users
};
