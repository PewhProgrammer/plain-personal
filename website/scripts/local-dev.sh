#!/bin/bash

echo "🚀 Starting local development environment"
echo ""

# Check which app to run
APP=${1:-landing}

case $APP in
  landing)
    echo "Starting Landing Page (http://localhost:5173)"
    cd apps/landing
    npm run dev
    ;;
  photo)
    echo "Starting Photo Sharing App (http://localhost:5174)"
    echo ""
    echo "⚠️  Make sure to set VITE_API_BASE_URL to your API Gateway endpoint"
    echo "   Example: export VITE_API_BASE_URL=https://abc123.execute-api.us-east-1.amazonaws.com"
    echo ""
    cd apps/photo-sharing/frontend
    npm run dev
    ;;
  *)
    echo "Unknown app: $APP"
    echo ""
    echo "Usage: ./scripts/local-dev.sh [landing|photo]"
    exit 1
    ;;
esac
