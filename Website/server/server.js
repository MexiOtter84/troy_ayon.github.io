const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const bookingRoutes = require('./routes/bookings.js');
const authRoutes = require('./routes/auth.js');
const { requireAdmin } = require('./middleware/auth.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
})); // Enable CORS with credentials
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Session middleware
app.use(session({
  secret: 'kraken-salon-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve static files (HTML, CSS, JS, images) - except admin files
app.use(express.static(path.join(__dirname, '..'), {
  index: false, // Don't serve index.html by default
  setHeaders: (res, filePath) => {
    // Don't cache admin files
    if (filePath.includes('admin')) {
      res.setHeader('Cache-Control', 'no-store');
    }
  }
}));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', requireAdmin, bookingRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Admin page - require authentication
app.get('/admin.html', (req, res) => {
  if (req.session && req.session.user) {
    res.sendFile(path.join(__dirname, '../admin.html'));
  } else {
    res.redirect('/login.html');
  }
});

// Admin alias
app.get('/admin', (req, res) => {
  res.redirect('/admin.html');
});

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/bookings`);
});
