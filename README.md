# Korean Language Class Attendance Bot

A Telegram bot for tracking attendance in Korean language classes with an integrated dashboard for visualization.

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
   
   # Dashboard settings
   DASHBOARD_PORT=4000
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your_password
   ```

### Running Locally

**Run the bot with integrated dashboard:**
```
npm start
```

**Run just the dashboard:**
```
npm run dashboard
```

The bot will run in polling mode when `USE_WEBHOOKS=false`.

### Deployment

For deployment instructions to Render, see [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md).

## Project Structure

- `index.js` - Main bot implementation using node-telegram-bot-api
- `dashboard.js` - Web dashboard for viewing attendance records
- `start-dashboard.js` - Script to run the dashboard independently 
- `public/` - Static assets for the dashboard
- `views/` - EJS templates for the dashboard

## Features

### Bot Features
- Track student attendance via Telegram
- Simple user interface with just a name input
- Records attendance with timestamps

### Dashboard Features
- Interactive web dashboard with statistical overview
- Track attendance trends over time with charts
- Filter attendance records by date
- Display student participation percentages
- Show attendance records organized by date
- Responsive design for mobile and desktop

## Documentation

- [Deployment Guide](./RENDER_DEPLOYMENT.md) - How to deploy the bot to Render
- [Dashboard Guide](./DASHBOARD.md) - Detailed dashboard documentation
- [Troubleshooting Guide](./TROUBLESHOOTING.md) - Solutions to common issues
