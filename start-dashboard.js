// This script starts the attendance dashboard separately from the bot
require('dotenv').config({ path: './dashboard.env' });
const { startDashboard } = require('./dashboard');

console.log('Starting Korean Class Attendance Dashboard...');
startDashboard();
