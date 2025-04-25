const express = require('express');
const path = require('path');
const axios = require('axios');
const session = require('express-session');
const basicAuth = require('basic-auth');
require('dotenv').config();

// Create dashboard app
const dashboard = express();

// Set view engine
dashboard.set('view engine', 'ejs');
dashboard.set('views', path.join(__dirname, 'views'));

// Authentication middleware
const auth = (req, res, next) => {
  // Skip auth check if already authenticated in session
  if (req.session && req.session.authenticated) {
    return next();
  }

  // Default credentials (you should change these and store in environment variables)
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'koreanclass2025';
  
  // Get credentials from HTTP Basic Auth
  const credentials = basicAuth(req);
  
  // Check credentials
  if (!credentials || credentials.name !== username || credentials.pass !== password) {
    res.set('WWW-Authenticate', 'Basic realm="Korean Class Admin Dashboard"');
    return res.status(401).send('Authentication required');
  }
  
  // Mark session as authenticated
  req.session.authenticated = true;
  next();
};

// Session configuration
dashboard.use(session({
  secret: process.env.SESSION_SECRET || 'korean-class-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600000 // 1 hour
  }
}));

// Serve static files
dashboard.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI;

// Apply authentication middleware to all routes
dashboard.use(auth);

// Logout route
dashboard.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Dashboard home page
dashboard.get('/', async (req, res) => {
  try {    // Fetch attendance data from MongoDB using the API
    const apiUrl = process.env.NODE_ENV === 'production' 
      ? 'https://davomat-od2i.onrender.com/attendances' 
      : 'http://localhost:5000/attendances';
    
    const response = await axios.get(apiUrl);
    const attendances = response.data.data || [];
    
    // Process data for display
    const attendanceByDate = {};
    const participantCounts = {};
    
    attendances.forEach(record => {
      // Format date (YYYY-MM-DD)
      const date = new Date(record.time).toISOString().split('T')[0];
      
      // Group by date
      if (!attendanceByDate[date]) {
        attendanceByDate[date] = [];
      }
      attendanceByDate[date].push(record);
      
      // Count participation by user
      if (!participantCounts[record.fullName]) {
        participantCounts[record.fullName] = 1;
      } else {
        participantCounts[record.fullName]++;
      }
    });
    
    // Sort dates in descending order
    const sortedDates = Object.keys(attendanceByDate).sort((a, b) => new Date(b) - new Date(a));
    
    // Render dashboard template
    res.render('dashboard', {
      attendanceByDate,
      sortedDates,
      participantCounts
    });
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    res.status(500).render('error', { error: 'Could not fetch attendance data' });
  }
});

// Start the dashboard server
const DASHBOARD_PORT = process.env.DASHBOARD_PORT || 3000;
dashboard.listen(DASHBOARD_PORT, () => {
  console.log(`Admin dashboard running at http://localhost:${DASHBOARD_PORT}`);
});

module.exports = dashboard;
