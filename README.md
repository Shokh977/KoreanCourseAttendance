# Korean Language Class Attendance Bot

A Telegram bot for tracking attendance in Korean language classes.

## Setup Instructions

### Prerequisites
- Node.js 16+ 
- npm or yarn
- MongoDB account (using MongoDB Atlas)
- Telegram bot token (from BotFather)

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   # Telegram bot token (get this from BotFather in Telegram)
   TELEGRAM_BOT_TOKEN=your_bot_token_here

   # MongoDB connection URI
   MONGODB_URI=your_mongodb_connection_string

   # For local development
   USE_WEBHOOKS=false

   # For production deployment (on Render)
   # USE_WEBHOOKS=true
   # PORT=3000
   # WEBHOOK_URL=https://your-render-service-name.onrender.com
   ```

### Running Locally

```
npm start
```

The bot will run in polling mode when `USE_WEBHOOKS=false`.

### Deployment

For deployment instructions to Render, see [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md).

## Project Structure

- `index.js` - Main bot implementation using node-telegram-bot-api
- `bot.js` - Alternative implementation using Telegraf (not used in production)
- `dashboard.js` - Web dashboard for viewing attendance records
- `public/` - Static assets for the dashboard
- `views/` - EJS templates for the dashboard

## Features

- Track student attendance via Telegram
- Web dashboard to view attendance records
- Display statistics by student and date

## Troubleshooting

If you encounter "409 Conflict" errors, see the troubleshooting section in [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md).
