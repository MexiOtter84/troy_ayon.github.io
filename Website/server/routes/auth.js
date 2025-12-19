const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth.js');

// POST /api/auth/login - Login endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: 'Username and password are required'
    });
  }

  // Authenticate user
  const user = authenticateUser(username, password);

  if (user) {
    // Store user in session
    req.session.user = user;

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        username: user.username,
        role: user.role
      }
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Invalid credentials',
      message: 'Incorrect username or password'
    });
  }
});

// POST /api/auth/logout - Logout endpoint
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Failed to logout'
      });
    }

    res.json({
      success: true,
      message: 'Logout successful'
    });
  });
});

// GET /api/auth/session - Check session status
router.get('/session', (req, res) => {
  if (req.session && req.session.user) {
    res.json({
      success: true,
      authenticated: true,
      user: {
        username: req.session.user.username,
        role: req.session.user.role
      }
    });
  } else {
    res.json({
      success: true,
      authenticated: false
    });
  }
});

module.exports = router;
