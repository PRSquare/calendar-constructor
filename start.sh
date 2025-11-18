#!/bin/bash

echo "🚀 Starting Calendar Generator - SIMPLE MODE!"

# Stop any running containers
docker-compose down 2>/dev/null || true

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Start development server accessible from outside
echo "🔥 Starting server..."
npm run dev -- --host 0.0.0.0 --port 5173

echo "✅ Server started!"
echo "🌐 Access your calendar at: http://YOUR-SERVER-IP:5173"