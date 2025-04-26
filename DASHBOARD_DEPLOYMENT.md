# Deploying the Dashboard to Render

This guide explains how to deploy the Korean Class Attendance Dashboard as a separate service on Render.

## Why Deploy Separately?

Deploying the dashboard as a separate service from the bot offers several advantages:

1. **Independent Scaling**: The dashboard can be scaled based on web traffic independently from the bot
2. **Improved Reliability**: Issues with the dashboard won't affect the bot's operation
3. **Separate Domains**: The dashboard can have its own user-friendly URL

## Deployment Steps

### 1. Create a New Web Service on Render

1. Go to the [Render Dashboard](https://dashboard.render.com/)
2. Click "New" > "Web Service"
3. Connect your repository
4. Configure the following settings:

   - **Name**: `korean-attendance-dashboard` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node start-dashboard.js`
   - **Plan**: Free or Standard (based on your needs)

### 2. Set Environment Variables

Add the following environment variables:

```
DASHBOARD_PORT=4000
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
SESSION_SECRET=your_secure_session_secret
API_URL=https://davomat-od2i.onrender.com
NODE_ENV=production
```

Replace values with your actual settings. Make sure to use strong, unique values for `ADMIN_PASSWORD` and `SESSION_SECRET`.

**Important**: For the `API_URL`, provide just the base URL without the `/attendances` path. The dashboard will automatically append this path when needed.

### 3. Deploy

Click "Create Web Service" and Render will build and deploy your dashboard.

### 4. Access Your Dashboard

Once deployed, your dashboard will be available at:
```
https://korean-attendance-dashboard.onrender.com
```

## Customizing the Dashboard URL

If you want a custom domain:

1. Go to your service settings in Render
2. Click on "Custom Domains"
3. Follow the instructions to add your domain

## Updating the Dashboard

When you make changes to the dashboard code:

1. Commit and push your changes to your repository
2. Render will automatically rebuild and deploy your dashboard

## Troubleshooting

### Dashboard Shows Error Connecting to API

If your dashboard can't connect to the backend API:

1. Verify your API service is running
2. Check that the `API_URL` environment variable is set correctly
3. Make sure CORS is properly configured on your backend

### Authentication Issues

If you can't log in to the dashboard:

1. Make sure you're using the correct username and password
2. Check the `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables
3. Try clearing your browser cookies and cache

### Performance Issues

If the dashboard is slow:

1. Consider upgrading from the free tier to a paid tier on Render
2. Implement pagination for large data sets
3. Optimize database queries in your backend
