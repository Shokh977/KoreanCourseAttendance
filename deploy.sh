#!/bin/bash
# Deployment script for Korean Class Attendance Bot and Dashboard

# Display help message
show_help() {
    echo "Korean Class Attendance Deployment Script"
    echo ""
    echo "Usage: ./deploy.sh [options]"
    echo ""
    echo "Options:"
    echo "  --help          Show this help message"
    echo "  --bot-only      Deploy only the bot"
    echo "  --dashboard-only Deploy only the dashboard"
    echo "  --full          Deploy both bot and dashboard (default)"
    echo ""
    exit 0
}

deploy_bot() {
    echo "Deploying Bot to Render..."
    echo "1. Make sure you've committed your changes to Git"
    echo "2. Go to https://dashboard.render.com"
    echo "3. Navigate to your bot service"
    echo "4. Click 'Manual Deploy' > 'Clear build cache & deploy'"
    echo ""
    echo "Bot Deployment Checklist:"
    echo "✓ Verify TELEGRAM_BOT_TOKEN is set"
    echo "✓ Verify WEBHOOK_URL is set to your Render URL"
    echo "✓ Verify API_URL points to your backend service"
    echo "✓ Check logs for successful startup and webhook setup"
    echo ""
}

deploy_dashboard() {
    echo "Deploying Dashboard to Render..."
    echo "1. Make sure you've committed your changes to Git"
    echo "2. Go to https://dashboard.render.com"
    echo "3. Navigate to your dashboard service"
    echo "4. Click 'Manual Deploy' > 'Clear build cache & deploy'"
    echo ""
    echo "Dashboard Deployment Checklist:"
    echo "✓ Verify ADMIN_USERNAME and ADMIN_PASSWORD are set"
    echo "✓ Verify API_URL points to your backend service"
    echo "✓ Check logs for successful connection to the backend"
    echo ""
}

# Process command line arguments
if [[ $# -eq 0 ]]; then
    deploy_bot
    echo "------------------------"
    deploy_dashboard
    exit 0
fi

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --help)
            show_help
            ;;
        --bot-only)
            deploy_bot
            exit 0
            ;;
        --dashboard-only)
            deploy_dashboard
            exit 0
            ;;
        --full)
            deploy_bot
            echo "------------------------"
            deploy_dashboard
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help to see available options"
            exit 1
            ;;
    esac
    shift
done
