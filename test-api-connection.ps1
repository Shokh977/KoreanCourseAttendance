# API Connection Test Script
# This script tests connectivity to your API endpoints

# Import required modules
$ErrorActionPreference = "Stop"
Write-Host "API Connection Test Script" -ForegroundColor Green
Write-Host "=======================" -ForegroundColor Green
Write-Host ""

# Configuration
$baseUrl = "https://davomat-od2i.onrender.com"
$endpoints = @(
    "/",
    "/health", 
    "/attendances"
)

Write-Host "Testing connectivity to: $baseUrl" -ForegroundColor Yellow
Write-Host ""

# Test each endpoint
foreach ($endpoint in $endpoints) {
    $url = "$baseUrl$endpoint"
    Write-Host "Testing endpoint: $url" -ForegroundColor Cyan
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 10
        Write-Host "  Status: $($response.StatusCode) ($($response.StatusDescription))" -ForegroundColor Green
        Write-Host "  Content Length: $($response.Content.Length) bytes" -ForegroundColor Green
        
        if ($response.Content.Length -lt 1000) {
            Write-Host "  Content: $($response.Content)" -ForegroundColor Gray
        } else {
            Write-Host "  Content: [Large response - first 200 chars] $($response.Content.Substring(0, [Math]::Min(200, $response.Content.Length)))..." -ForegroundColor Gray
        }
    }
    catch {
        Write-Host "  ERROR: $_" -ForegroundColor Red
        
        if ($_.Exception.Response) {
            Write-Host "  Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        }
        
        if ($_.Exception -is [System.Net.WebException]) {
            Write-Host "  Connection Error: $($_.Exception.Status)" -ForegroundColor Red
        }
    }
    
    Write-Host ""
}

Write-Host "API Connection Test Completed" -ForegroundColor Green
Write-Host ""

# Provide troubleshooting tips
Write-Host "Troubleshooting Tips:" -ForegroundColor Yellow
Write-Host "1. If all connections failed, your backend may be down or unreachable."
Write-Host "   - Check if the backend service is running on Render"
Write-Host "   - Verify there are no network issues or firewalls blocking the connection"
Write-Host ""
Write-Host "2. If some endpoints work but others don't, check your backend code:"
Write-Host "   - Verify the route handlers are correctly implemented"
Write-Host "   - Check for any runtime errors in your backend logs"
Write-Host ""
Write-Host "3. If the /attendances endpoint fails, check your database connection:"
Write-Host "   - Verify your MongoDB connection string"
Write-Host "   - Check if MongoDB Atlas IP whitelist settings are correct"
Write-Host "   - Look for database-related errors in your backend logs"
