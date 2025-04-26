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
  // Skip auth check for API test endpoint
  if (req.path === '/api-test') {
    return next();
  }
  
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

// Apply authentication middleware to all routes
dashboard.use(auth);

// Logout route
dashboard.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// API test endpoint - useful for diagnosing connection issues
dashboard.get('/api-test', async (req, res) => {
  try {
    // Get base API URL without the /attendances path
    const apiUrl = process.env.API_URL || 
                 (process.env.NODE_ENV === 'production' 
                   ? 'https://davomat-od2i.onrender.com' 
                   : 'http://localhost:5000');
    
    // Remove /attendances from the end if it exists
    const baseApiUrl = apiUrl.replace(/\/attendances$/, '');
    
    console.log(`Testing API connectivity to: ${baseApiUrl}`);
    
    // Test the base URL
    const baseResponse = await axios.get(baseApiUrl, { timeout: 5000 });
    
    // Test the health endpoint
    const healthResponse = await axios.get(`${baseApiUrl}/health`, { timeout: 5000 });
    
    // Test the attendances endpoint
    const attendancesUrl = `${baseApiUrl}/attendances`;
    const attendancesResponse = await axios.get(attendancesUrl, { timeout: 5000 });
    
    res.json({
      status: 'success',
      baseUrl: {
        url: baseApiUrl,
        status: baseResponse.status,
        data: baseResponse.data
      },
      healthEndpoint: {
        url: `${baseApiUrl}/health`,
        status: healthResponse.status,
        data: healthResponse.data
      },
      attendancesEndpoint: {
        url: attendancesUrl,
        status: attendancesResponse.status,
        recordCount: attendancesResponse.data?.count || 'unknown'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      code: error.code,
      isAxiosError: error.isAxiosError,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : 'No response',
      request: error.request ? 'Request was made but no response received' : 'No request was made'
    });
  }
});

// Dashboard home page
dashboard.get('/', async (req, res) => {
  try {
    // Get date filter parameters
    const { startDate, endDate } = req.query;
    
    // Get API URL from environment variable with fallbacks
    let apiUrl = process.env.API_URL || 
                (process.env.NODE_ENV === 'production' 
                  ? 'https://davomat-od2i.onrender.com/attendances' 
                  : 'http://localhost:5000/attendances');
    
    // Make sure the URL ends with /attendances
    if (!apiUrl.endsWith('/attendances')) {
      apiUrl = `${apiUrl}/attendances`;
    }
    
    console.log(`Fetching attendance data from: ${apiUrl}`);
    
    // Set a timeout for the request
    const axiosConfig = {
      timeout: 10000, // 10 seconds timeout
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    
    const response = await axios.get(apiUrl, axiosConfig);
    let attendances = response.data.data || [];
    
    console.log(`Successfully fetched ${attendances.length} attendance records`);
    
    // Apply date filtering if parameters are present
    if (startDate && endDate) {
      const startDateTime = new Date(startDate);
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999); // Set to end of day
      
      attendances = attendances.filter(record => {
        const recordDate = new Date(record.time);
        return recordDate >= startDateTime && recordDate <= endDateTime;
      });
    }
    
    // Process data for display
    const attendanceByDate = {};
    const participantCounts = {};
    const lastAttendanceDate = {};
    const attendanceDates = {};
    let totalAttendances = 0;
    
    attendances.forEach(record => {
      // Format date (YYYY-MM-DD)
      const date = new Date(record.time).toISOString().split('T')[0];
      
      // Group by date
      if (!attendanceByDate[date]) {
        attendanceByDate[date] = [];
      }
      attendanceByDate[date].push(record);
      
      // Count attendance by date
      if (!attendanceDates[date]) {
        attendanceDates[date] = 0;
      }
      attendanceDates[date]++;
      
      // Track last attendance date for each participant
      if (!lastAttendanceDate[record.fullName] || new Date(record.time) > new Date(lastAttendanceDate[record.fullName])) {
        lastAttendanceDate[record.fullName] = record.time;
      }
      
      // Count participation by user
      if (!participantCounts[record.fullName]) {
        participantCounts[record.fullName] = 1;
      } else {
        participantCounts[record.fullName]++;
      }
      
      // Increment total attendance count
      totalAttendances++;
    });
    
    // Sort dates in descending order
    const sortedDates = Object.keys(attendanceByDate).sort((a, b) => new Date(b) - new Date(a));
    
    // Render dashboard template
    res.render('dashboard', {
      attendanceByDate,
      sortedDates,
      participantCounts,
      lastAttendanceDate,
      attendanceDates,
      totalAttendances,
      startDate,
      endDate
    });  } catch (error) {
    console.error('Error fetching attendance data:', error);
    
    // Extract more detailed error information
    let errorMessage = 'Could not fetch attendance data';
    let errorDetails = '';
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      errorMessage += ': Backend service is not responding';
      errorDetails = `Connection error (${error.code}): The backend service at ${process.env.API_URL || 'https://davomat-od2i.onrender.com'} is not responding. It may be down or restarting.`;
    } else if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage += `: Backend returned status ${error.response.status}`;
      errorDetails = `Response data: ${JSON.stringify(error.response.data)}`;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage += ': No response from backend';
      errorDetails = 'The request was made but no response was received. The backend may be down.';
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage += `: ${error.message}`;
      errorDetails = error.stack;
    }
    
    res.status(500).render('error', { 
      error: errorMessage,
      details: errorDetails
    });
  }
});

// Start the dashboard server separately
const startDashboard = () => {
  const DASHBOARD_PORT = process.env.DASHBOARD_PORT || 4000;
  dashboard.listen(DASHBOARD_PORT, () => {
    console.log(`Admin dashboard running at http://localhost:${DASHBOARD_PORT}`);
  });
};

// If this file is being run directly, start the dashboard
if (require.main === module) {
  startDashboard();
}

// Export the dashboard app
module.exports = { dashboard, startDashboard };
