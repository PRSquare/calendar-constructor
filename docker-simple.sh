#!/bin/bash

echo "🚀 Starting Calendar Generator - DOCKER SIMPLE!"

# Stop everything
docker-compose down 2>/dev/null || true

# Run development container directly
docker run -it --rm \
  -p 5173:5173 \
  -v $(pwd):/app \
  -w /app \
  node:20-alpine \
  sh -c "npm install && npm run dev -- --host 0.0.0.0"