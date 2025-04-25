require('dotenv').config();
const { Telegraf } = require('telegraf');

// Create bot instance
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Configure update method based on environment
const useWebhooks = process.env.USE_WEBHOOKS === 'true';

// Function to stop previous webhook or polling
async function stopPreviousUpdates() {
  try {
    // Get bot info to verify token is valid
    const botInfo = await bot.telegram.getMe();
    console.log(`Starting ${botInfo.username}...`);
    
    // Close webhook if it exists (important to avoid the 409 error)
    await bot.telegram.deleteWebhook({ drop_pending_updates: true });
    console.log('Previous webhook or polling stopped successfully');
  } catch (error) {
    console.error('Error stopping previous updates:', error);
  }
}

// Initialize bot
async function startBot() {
  // Always stop previous updates first
  await stopPreviousUpdates();

  // Set up error handling
  bot.catch((err, ctx) => {
    console.error(`Error for ${ctx.updateType}:`, err);
  });

  // Your bot middleware and handlers go here
  // ...existing code...

  // Start the bot with appropriate method
  if (useWebhooks) {
    // Configure webhook (for production)
    const PORT = process.env.PORT || 3000;
    const URL = process.env.URL || 'https://your-app-url.com';
    
    // Start webhook
    bot.launch({
      webhook: {
        domain: URL,
        port: PORT,
      }
    });
    console.log('Bot started with webhooks');
  } else {
    // Use long polling (for development)
    bot.launch({ 
      dropPendingUpdates: true 
    });
    console.log('Bot started with long polling');
  }
}

// Handle graceful stop
process.once('SIGINT', () => {
  bot.stop('SIGINT');
  console.log('Bot stopped due to SIGINT');
});
process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
  console.log('Bot stopped due to SIGTERM');
});

// Start the bot
startBot().catch(console.error);