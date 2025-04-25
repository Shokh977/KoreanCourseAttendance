# This file contains a troubleshooting guide for your Telegram bot

## Common Issues and Solutions

### 1. 409 Conflict Error

**Problem**: When you see "ETELEGRAM: 409 Conflict: terminated by other getUpdates request", it means multiple instances of your bot are running at the same time.

**Solution**: 
- Ensure only one instance of your bot is running
- Clear existing webhooks manually via API: `https://api.telegram.org/bot<TOKEN>/deleteWebhook?drop_pending_updates=true`

### 2. Bot not responding to messages

**Problem**: Bot appears online but doesn't respond to messages.

**Solution**:
- Check webhook setup in Render logs
- Verify webhook URL matches your actual Render URL
- Make sure Express server is running and webhook path is correct
- Check Telegram webhook info: `https://api.telegram.org/bot<TOKEN>/getWebhookInfo`

### 3. Error saving attendance data

**Problem**: Bot shows "Kechirasiz, xatolik yuz berdi ❌" error when trying to save attendance.

**Solution**:
- Check logs in Render dashboard for both bot and backend services
- Verify MongoDB connection is working
- Check network connectivity between bot and backend services
- Test the API endpoint directly: `curl -X POST -H "Content-Type: application/json" -d '{"username":"test","fullName":"Test User"}' https://davomat-od2i.onrender.com/attend`

### 4. Dashboard not showing attendance data

**Problem**: Dashboard loads but doesn't show any attendance records.

**Solution**:
- Check if backend endpoint `/attendances` is accessible
- Verify API URL in dashboard.js points to correct backend URL
- Check browser console for any errors
- Test API directly: `curl https://davomat-od2i.onrender.com/attendances`

## Checking Service Status

### Bot Service
- Check if running: Visit `https://koreancourseattendance.onrender.com/`
- Check webhook: `https://api.telegram.org/bot<TOKEN>/getWebhookInfo`

### Backend Service
- Check if running: Visit `https://davomat-od2i.onrender.com/`
- Check health: Visit `https://davomat-od2i.onrender.com/health`

## Debug Commands

When troubleshooting, try these commands:

1. **Clear webhook**:
   ```
   https://api.telegram.org/bot<TOKEN>/deleteWebhook?drop_pending_updates=true
   ```

2. **Get webhook info**:
   ```
   https://api.telegram.org/bot<TOKEN>/getWebhookInfo
   ```

3. **Test backend connectivity**:
   ```
   curl https://davomat-od2i.onrender.com/health
   ```

4. **Test attendance API**:
   ```
   curl -X POST -H "Content-Type: application/json" -d '{"username":"test","fullName":"Test User"}' https://davomat-od2i.onrender.com/attend
   ```
