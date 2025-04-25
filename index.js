// Import required modules
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config();

// Create a bot instance with your Telegram Bot Token
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Store user states
const userStates = {};

// Bot start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  // Set user state to 'awaitingName'
  userStates[userId] = 'awaitingName';
  
  // Send welcome message in Uzbek and ask for the user's name
  bot.sendMessage(chatId, 'Assalomu alaykum! Davomat uchun ismingizni yozing:');
});

// Handle text messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text;

  // Ignore commands (they start with '/')
  if (text && text.startsWith('/')) {
    return;
  }
  // Check if we're waiting for the user's name
  if (userStates[userId] === 'awaitingName') {
    // Get username (or "unknown" if not available)
    const username = msg.from.username || 'unknown';
    
    // Get the full name they provided
    const fullName = text;
    
    // Get current timestamp
    const time = new Date().toISOString();
      // Prepare data for API request
    const attendanceData = {
      username,
      fullName,
      time
    };
      // Send attendance data to Express API (use the deployed URL in production)
    const apiUrl = process.env.NODE_ENV === 'production' 
      ? 'https://attendance-backend.onrender.com/attend' 
      : 'http://localhost:5000/attend';
      
    axios.post(apiUrl, attendanceData)
      .then(response => {
        // Send success message in Uzbek
        bot.sendMessage(chatId, "Rahmat, davomatingiz yozib qo'yildi ✅");
      })      .catch(error => {
        console.error('Error sending attendance data:', error);
        bot.sendMessage(chatId, "Kechirasiz, xatolik yuz berdi ❌");
      })
      .finally(() => {
        // Reset user state
        delete userStates[userId];
      });
  }
});

// Log that the bot has started
console.log('Bot is running...');
