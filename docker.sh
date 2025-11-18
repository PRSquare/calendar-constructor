#!/bin/bash

# Calendar Generator Docker Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Calendar Generator Docker Management"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev       Start development environment"
    echo "  build     Build production assets"
    echo "  preview   Start preview server with production build"
    echo "  prod      Start production environment with Nginx"
    echo "  stop      Stop all containers"
    echo "  clean     Stop containers and remove volumes"
    echo "  logs      Show logs for running containers"
    echo "  shell     Open shell in development container"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev                    # Start development server on http://localhost:5173"
    echo "  $0 build                  # Build production assets"
    echo "  $0 prod                   # Start production server on http://localhost:80"
    echo "  $0 logs calendar-generator-dev  # Show logs for dev container"
}

# Function to start development environment
start_dev() {
    print_status "Starting development environment..."
    docker-compose --profile dev up -d
    print_success "Development environment started!"
    print_status "Application available at: http://localhost:5173"
    print_status "View logs with: $0 logs calendar-generator-dev"
}

# Function to build production assets
build_prod() {
    print_status "Building production assets..."
    docker-compose --profile build up --build
    print_success "Production build completed!"
    print_status "Assets built in ./dist directory"
}

# Function to start preview environment
start_preview() {
    print_status "Starting preview environment..."
    docker-compose --profile preview up -d
    print_success "Preview environment started!"
    print_status "Preview available at: http://localhost:4173"
    print_status "View logs with: $0 logs calendar-generator-preview"
}

# Function to start production environment
start_prod() {
    print_status "Starting production environment..."
    
    # Build first if dist doesn't exist
    if [ ! -d "./dist" ]; then
        print_warning "No build found. Building first..."
        build_prod
    fi
    
    docker-compose --profile prod up -d
    print_success "Production environment started!"
    print_status "Application available at: http://localhost:80"
    print_status "View logs with: $0 logs calendar-generator-prod"
}

# Function to stop all containers
stop_all() {
    print_status "Stopping all containers..."
    docker-compose --profile dev --profile build --profile preview --profile prod down
    print_success "All containers stopped!"
}

# Function to clean up
clean_all() {
    print_status "Cleaning up containers and volumes..."
    docker-compose --profile dev --profile build --profile preview --profile prod down -v
    print_success "Cleanup completed!"
}

# Function to show logs
show_logs() {
    if [ -z "$2" ]; then
        docker-compose logs -f
    else
        docker-compose logs -f "$2"
    fi
}

# Function to open shell in development container
open_shell() {
    print_status "Opening shell in development container..."
    docker-compose --profile dev exec calendar-generator-dev sh
}

# Main script logic
case "${1:-help}" in
    "dev")
        start_dev
        ;;
    "build")
        build_prod
        ;;
    "preview")
        start_preview
        ;;
    "prod")
        start_prod
        ;;
    "stop")
        stop_all
        ;;
    "clean")
        clean_all
        ;;
    "logs")
        show_logs "$@"
        ;;
    "shell")
        open_shell
        ;;
    "help"|*)
        show_usage
        ;;
esac