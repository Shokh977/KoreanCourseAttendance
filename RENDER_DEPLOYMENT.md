# Deploying the Korean Language Class Attendance Bot to Render

This document explains how to properly deploy the Korean Language Class Attendance Bot to Render to avoid "409 Conflict" errors.

## Understanding the Error

The error "ETELEGRAM: 409 Conflict: terminated by other getUpdates request" happens when:

1. Multiple instances of the bot are running simultaneously
2. The bot is trying to use both webhook and polling modes at the same time

## Deployment Steps

1. **Update Environment Variables**

   Make sure your `.env` file has the correct settings:

   ```   # Set to true in production
   USE_WEBHOOKS=true   # Webhook settings
   PORT=3000
   WEBHOOK_URL=https://koreancourseattendance.onrender.com
   
   # API endpoint for the backend service
   API_URL=https://davomat-od2i.onrender.com/attend
   ```

   Replace `your-actual-render-service-name.onrender.com` with your actual Render service URL.

2. **Configure Render Service**

   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Environment Variables**: Add all the variables from your `.env` file

3. **Initial Deployment**

   - After deployment, check the logs to ensure the bot started properly
   - Look for messages like "Webhook set to: ..." and "Bot is running..."

4. **Troubleshooting**

   - If you see 409 Conflict errors, it could mean another instance is running
   - Go to your Telegram Bot's settings using BotFather and check API requests
   - You can use the Telegram API directly to delete all webhooks before starting the bot
   
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/deleteWebhook?drop_pending_updates=true
   ```

5. **Local vs Production**

   - Locally, you can set `USE_WEBHOOKS=false` to use polling mode
   - In production (Render), always use `USE_WEBHOOKS=true`

## Important Files

- `index.js`: Main entry point that initializes the bot
- `.env`: Configuration settings for different environments
- `bot.js`: Alternative bot implementation (not used in production)

Remember that only ONE instance of the bot should be running at any time.
