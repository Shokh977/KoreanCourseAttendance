require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

// Telegram bot token from environment variables
const token = process.env.TELEGRAM_BOT_TOKEN;
const useWebhooks = process.env.USE_WEBHOOKS === 'true';
const webhookUrl = process.env.WEBHOOK_URL;
const port = process.env.PORT || 3000;

// IMPORTANT: This file (index.js) is the main entry point for the bot.
// If you're encountering "409 Conflict" errors, it means you might have:
// 1. Multiple instances of the bot running simultaneously
// 2. Another file (like bot.js) also trying to initialize the bot with the same token
// Make sure only ONE instance of the bot is running at any time.

// Start the bot
async function startBot() {
  try {
    console.log('Starting bot...');
    let bot;
    
    // Create a temporary bot instance for setup
    const setupBot = new TelegramBot(token, { polling: false });
      // Always remove existing webhook to start fresh
    try {
      await setupBot.deleteWebHook({ drop_pending_updates: true });
      console.log('Previous webhooks cleared');
    } catch (error) {
      console.error('Error clearing webhooks:', error);
    };
    
    if (useWebhooks && webhookUrl) {
      console.log(`Setting up webhook mode on ${webhookUrl}`);
      
      // Create Express app for webhook
      const app = express();
      app.use(express.json());
      
      // Create bot in webhook mode
      bot = new TelegramBot(token, { polling: false });
        // Set the webhook
      const webhookPath = `/bot${token}`;
      const fullWebhookUrl = `${webhookUrl}${webhookPath}`;
      
      try {
        const webhookInfo = await bot.setWebHook(fullWebhookUrl);
        console.log(`Webhook set to: ${fullWebhookUrl}`);
        console.log('Webhook info:', webhookInfo);
      } catch (error) {
        console.error('Error setting webhook:', error);
      }
      
      // Process webhook requests
      app.post(webhookPath, (req, res) => {
        bot.processUpdate(req.body);
        res.sendStatus(200);
      });
      
      // Health check endpoint
      app.get('/', (req, res) => {
        res.send('Bot server is running!');
      });
      
      // Start express server
      app.listen(port, () => {
        console.log(`Express server is listening on port ${port}`);
      });
    } else {
      console.log('Setting up polling mode');
      // Create bot in polling mode for development
      bot = new TelegramBot(token, {
        polling: {
          params: {
            timeout: 50,
            limit: 100
          },
          interval: 1000
        }
      });
      
      // Handle polling errors
      bot.on('polling_error', (error) => {
        console.error('Polling error:', error);
      });
    }
    
    console.log('Bot is running...');

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
        };        // Get API URL from environment variable, or use default URL depending on environment
        const apiUrl = process.env.API_URL || 'https://davomat-od2i.onrender.com/attend';
        
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
    const gracefulShutdown = () => {
      console.log('Shutting down bot...');
      if (useWebhooks) {
        // No need to stop anything for webhook mode
        console.log('Webhook bot shutdown complete');
      } else {
        bot.stopPolling();
        console.log('Polling stopped');
      }
    };

    process.once('SIGINT', gracefulShutdown);
    process.once('SIGTERM', gracefulShutdown);

    return bot;
  } catch (error) {
    console.error('Fatal bot error:', error);
    process.exit(1);
  }
}

// Start the bot
startBot();
