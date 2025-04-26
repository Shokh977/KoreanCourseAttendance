# API Connectivity Troubleshooting Guide

This document provides a comprehensive guide to troubleshooting API connectivity issues between your dashboard and backend.

## Quick Diagnostics

1. **Run the API test script**:
   ```powershell
   .\test-api-connection.ps1
   ```

2. **Check the dashboard API test endpoint**:
   Visit `/api-test` on your dashboard URL to run a diagnostic test of backend connectivity.

3. **Verify your `.env` configuration**:
   Make sure your `dashboard.env` file has the correct API URL:
   ```
   API_URL=https://davomat-od2i.onrender.com
   ```
   Note: The dashboard will automatically add `/attendances` to the URL if needed.

## Common Issues and Solutions

### 1. Backend Service Not Running

**Symptoms:**
- All requests to backend endpoints fail
- Timeouts or connection refused errors

**Solutions:**
- Go to the Render dashboard and check if your backend service is running
- Check if the service is in a "Starting" or "Failed" state
- Restart the service if it's in a failed state
- Check the logs for any startup errors

### 2. Environment Variable Misconfiguration

**Symptoms:**
- Dashboard can't connect to the correct API URL
- Requests going to wrong endpoints

**Solutions:**
- Check the `API_URL` environment variable in your dashboard service
- Ensure it points to `https://davomat-od2i.onrender.com` (without `/attendances`)
- Verify no typos in the URL or environment variable name
- The dashboard will automatically add the `/attendances` path when needed

### 3. CORS Issues

**Symptoms:**
- API requests are being rejected with CORS errors
- Browser console shows cross-origin errors

**Solutions:**
- Ensure your backend has CORS middleware correctly configured
- Check the allowed origins in your backend CORS settings
- Add your dashboard domain to the allowed origins

### 4. Database Connection Issues

**Symptoms:**
- Backend is running but `/attendances` endpoint fails
- Backend logs show MongoDB connection errors

**Solutions:**
- Check the MongoDB connection string in your backend `.env` file
- Verify MongoDB Atlas service is running and accessible
- Check if IP address restrictions are preventing access

### 5. Request Timeouts

**Symptoms:**
- Requests take too long and eventually time out
- Dashboard shows timeout errors

**Solutions:**
- Check if your backend is under heavy load
- Consider upgrading your Render service plan
- Optimize database queries or implement caching

## Step-by-Step Verification Process

1. **Verify the base endpoint is responding:**
   ```
   https://davomat-od2i.onrender.com
   ```
   Should return: "Attendance API is running!"

2. **Verify the health endpoint is responding:**
   ```
   https://davomat-od2i.onrender.com/health
   ```
   Should return: JSON with status "ok" and MongoDB connection status

3. **Verify the attendances endpoint is responding:**
   ```
   https://davomat-od2i.onrender.com/attendances
   ```
   Should return: JSON with attendance records

4. **Check dashboard logs for API connection attempts:**
   Look for messages like "Fetching attendance data from: [URL]"

## Testing API Connectivity

Use the built-in API test endpoint to diagnose issues:

1. Visit `/api-test` on your dashboard URL
2. The response should show three successful connections:
   - Base URL (status: 200)
   - Health endpoint (status: 200)
   - Attendances endpoint (status: 200)

If any of these fail, check the specific error messages for clues.

## Dashboard URL Configuration

In production, set the environment variable:
```
API_URL=https://davomat-od2i.onrender.com
```

For local development, set in dashboard.env:
```
API_URL=http://localhost:5000
```

## When All Else Fails

If you've tried all the above and still have issues:

1. **Recreate the Backend Service**
   - Create a new service on Render
   - Deploy the same code but with a new service name
   - Update the `API_URL` to point to the new service

2. **Check for Backend Errors**
   - Look at the backend service logs for errors
   - Verify MongoDB connection is established
   - Check for runtime errors in your routes

3. **Test with an API Client**
   - Use a tool like Postman or curl to test the API directly
   - Compare responses with what your dashboard expects
