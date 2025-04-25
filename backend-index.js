// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Create Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Define port
const PORT = process.env.PORT || 5000;

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

// Define Attendance Schema
const attendanceSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

// Create Attendance model
const Attendance = mongoose.model('Attendance', attendanceSchema);

// POST route to save attendance data
app.post('/attend', async (req, res) => {
  try {
    // Extract data from request body
    const { username, fullName, time } = req.body;

    // Data validation
    if (!username || !fullName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and full name are required' 
      });
    }

    // Create a new attendance record
    const newAttendance = new Attendance({
      username,
      fullName,
      time: time || new Date() // Use provided time or current time
    });

    // Save the attendance record to database
    await newAttendance.save();

    // Send success response
    return res.status(201).json({
      success: true,
      message: 'Attendance recorded successfully',
      data: newAttendance
    });

  } catch (error) {
    console.error('Error saving attendance:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET route to fetch all attendance records
app.get('/attendances', async (req, res) => {
  try {
    const attendances = await Attendance.find().sort({ time: -1 });
    return res.status(200).json({
      success: true,
      count: attendances.length,
      data: attendances
    });
  } catch (error) {
    console.error('Error fetching attendances:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Simple GET route to test if the server is running
app.get('/', (req, res) => {
  res.send('Korean Class Attendance API is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
