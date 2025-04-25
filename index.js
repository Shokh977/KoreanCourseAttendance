require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Telegram bot token from environment variables
const token = process.env.TELEGRAM_BOT_TOKEN;

// Start the bot
async function startBot() {
  try {
    // First, create a temporary bot instance to clean up any existing webhooks
    const cleanupBot = new TelegramBot(token, { polling: false });
    
    // Delete any existing webhook and drop pending updates
    await cleanupBot.deleteWebhook({ drop_pending_updates: true });
    console.log('Previous webhooks cleared');
    
    // Configure bot with polling options
    const bot = new TelegramBot(token, {
      polling: {
        params: {
          timeout: 50, // Using params instead of timeout directly
          limit: 100,
          allowed_updates: [], // Receive all updates
          offset: -1 // Start with the latest update
        },
        interval: 1000 // Poll every second
      }
    });

    console.log('Bot is running...');

    // Handle errors
    bot.on('polling_error', (error) => {
      console.error('Polling error:', error);
      
      // If we encounter a 409 conflict, try to restart
      if (error.code === 'ETELEGRAM' && error.message.includes('409 Conflict')) {
        console.log('Detected polling conflict, attempting to restart...');
        bot.stopPolling()
          .then(() => {
            console.log('Polling stopped, waiting before restart...');
            // Wait a bit before trying to restart
            setTimeout(() => {
              console.log('Restarting bot...');
              startBot();
            }, 5000);
          })
          .catch(err => console.error('Error stopping polling:', err));
      }
    });

    // Your bot command handlers and logic here
    // Import required modules
    const axios = require('axios');

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
        const time = new Date().toISOString();    // Prepare data for API request
        const attendanceData = {
          username,
          fullName,
          time
        };
        
        // Get API URL from environment variable, or use default URL depending on environment
        // Replace this URL with your actual deployed API URL from Render dashboard
        const apiUrl = process.env.API_URL || 'https://your-api-name.onrender.com/attend';
        
        console.log(`Sending attendance data to: ${apiUrl}`);
        
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

    // Graceful shutdown
    process.once('SIGINT', () => {
      bot.stopPolling({ cancel: true });
      console.log('Bot polling stopped due to SIGINT');
    });
    
    process.once('SIGTERM', () => {
      bot.stopPolling({ cancel: true });
      console.log('Bot polling stopped due to SIGTERM');
    });

    return bot;
  } catch (error) {
    console.error('Fatal bot error:', error);
    process.exit(1);
  }
}

// Start the bot
startBot();
