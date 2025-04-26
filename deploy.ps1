# Korean Class Attendance Deployment Script (PowerShell)
param (
    [switch]$Help,
    [switch]$BotOnly,
    [switch]$DashboardOnly,
    [switch]$Full
)

# Display help message
function Show-Help {
    Write-Host "Korean Class Attendance Deployment Script"
    Write-Host ""
    Write-Host "Usage: .\deploy.ps1 [options]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Help           Show this help message"
    Write-Host "  -BotOnly        Deploy only the bot"
    Write-Host "  -DashboardOnly  Deploy only the dashboard"
    Write-Host "  -Full           Deploy both bot and dashboard (default)"
    Write-Host ""
    exit 0
}

function Deploy-Bot {
    Write-Host "Deploying Bot to Render..." -ForegroundColor Green
    Write-Host "1. Make sure you've committed your changes to Git"
    Write-Host "2. Go to https://dashboard.render.com"
    Write-Host "3. Navigate to your bot service"
    Write-Host "4. Click 'Manual Deploy' > 'Clear build cache & deploy'"
    Write-Host ""
    Write-Host "Bot Deployment Checklist:" -ForegroundColor Yellow
    Write-Host "✓ Verify TELEGRAM_BOT_TOKEN is set"
    Write-Host "✓ Verify WEBHOOK_URL is set to your Render URL"
    Write-Host "✓ Verify API_URL points to your backend service"
    Write-Host "✓ Check logs for successful startup and webhook setup"
    Write-Host ""
}

function Deploy-Dashboard {
    Write-Host "Deploying Dashboard to Render..." -ForegroundColor Green
    Write-Host "1. Make sure you've committed your changes to Git"
    Write-Host "2. Go to https://dashboard.render.com"
    Write-Host "3. Navigate to your dashboard service"
    Write-Host "4. Click 'Manual Deploy' > 'Clear build cache & deploy'"
    Write-Host ""
    Write-Host "Dashboard Deployment Checklist:" -ForegroundColor Yellow
    Write-Host "✓ Verify ADMIN_USERNAME and ADMIN_PASSWORD are set"
    Write-Host "✓ Verify API_URL points to your backend service"
    Write-Host "✓ Check logs for successful connection to the backend"
    Write-Host ""
}

# Process command line arguments
if ($Help) {
    Show-Help
}
elseif ($BotOnly) {
    Deploy-Bot
}
elseif ($DashboardOnly) {
    Deploy-Dashboard
}
elseif ($Full) {
    Deploy-Bot
    Write-Host "------------------------" -ForegroundColor Gray
    Deploy-Dashboard
}
else {
    # Default behavior - deploy both
    Deploy-Bot
    Write-Host "------------------------" -ForegroundColor Gray
    Deploy-Dashboard
}
