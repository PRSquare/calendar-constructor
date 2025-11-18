#!/bin/bash
echo "🚀 Starting Calendar Generator..."
docker-compose up -d
echo "✅ Done! Access at http://$(grep SERVER_IP .env | cut -d'=' -f2)"