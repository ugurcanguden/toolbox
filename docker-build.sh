#!/bin/bash

# Toolbox - Docker Build & Deploy Script
# This script helps you build and deploy the Toolbox application using Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🐳 Toolbox Docker Build Script${NC}\n"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker is installed${NC}"

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${YELLOW}⚠️  .env.production not found. Creating from template...${NC}"
    cat > .env.production << EOF
# Production Environment Variables
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
EOF
    echo -e "${GREEN}✅ Created .env.production${NC}"
fi

# Build Docker image
echo -e "\n${GREEN}📦 Building Docker image...${NC}"
docker build -t toolbox:latest .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Docker image built successfully!${NC}"
else
    echo -e "${RED}❌ Docker build failed!${NC}"
    exit 1
fi

# Show image size
IMAGE_SIZE=$(docker images toolbox:latest --format "{{.Size}}")
echo -e "${GREEN}📊 Image size: ${IMAGE_SIZE}${NC}"

# Ask if user wants to start the container
echo -e "\n${YELLOW}Do you want to start the container now? (y/n)${NC}"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo -e "\n${GREEN}🚀 Starting container...${NC}"
    
    # Stop existing container if running
    if docker ps -a --format '{{.Names}}' | grep -q "^toolbox$"; then
        echo -e "${YELLOW}⚠️  Stopping existing container...${NC}"
        docker stop toolbox
        docker rm toolbox
    fi
    
    # Start new container
    docker run -d \
      --name toolbox \
      -p 3000:3000 \
      -e NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
      --restart unless-stopped \
      toolbox:latest
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Container started successfully!${NC}"
        echo -e "${GREEN}🌐 Application is running at: http://localhost:3000${NC}"
        echo -e "\n${YELLOW}Useful commands:${NC}"
        echo -e "  - View logs: ${GREEN}docker logs -f toolbox${NC}"
        echo -e "  - Stop container: ${GREEN}docker stop toolbox${NC}"
        echo -e "  - Restart container: ${GREEN}docker restart toolbox${NC}"
    else
        echo -e "${RED}❌ Failed to start container!${NC}"
        exit 1
    fi
else
    echo -e "\n${GREEN}✅ Build complete! You can start the container manually with:${NC}"
    echo -e "${YELLOW}docker run -d --name toolbox -p 3000:3000 toolbox:latest${NC}"
fi

echo -e "\n${GREEN}🎉 Done!${NC}"
