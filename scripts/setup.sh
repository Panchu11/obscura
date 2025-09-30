#!/bin/bash

# Obscura Setup Script
# This script sets up the entire Obscura project

set -e

echo "🎭 Obscura Setup Script"
echo "======================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

echo -e "${BLUE}Node.js version: $(node --version)${NC}"
echo ""

# Install root dependencies
echo -e "${GREEN}📦 Installing root dependencies...${NC}"
npm install

# Install contract dependencies
echo -e "${GREEN}📦 Installing contract dependencies...${NC}"
cd contracts
npm install
cd ..

# Install frontend dependencies
echo -e "${GREEN}📦 Installing frontend dependencies...${NC}"
cd frontend
npm install
cd ..

# Install worker dependencies
echo -e "${GREEN}📦 Installing worker dependencies...${NC}"
cd worker
npm install
cd ..

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${GREEN}📝 Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please update .env with your configuration${NC}"
else
    echo -e "${BLUE}✓ .env file already exists${NC}"
fi

# Create frontend .env.local if it doesn't exist
if [ ! -f frontend/.env.local ]; then
    echo -e "${GREEN}📝 Creating frontend/.env.local file...${NC}"
    cp frontend/.env.example frontend/.env.local
    echo -e "${YELLOW}⚠️  Please update frontend/.env.local with your configuration${NC}"
else
    echo -e "${BLUE}✓ frontend/.env.local file already exists${NC}"
fi

# Create worker .env if it doesn't exist
if [ ! -f worker/.env ]; then
    echo -e "${GREEN}📝 Creating worker/.env file...${NC}"
    cp worker/.env.example worker/.env
    echo -e "${YELLOW}⚠️  Please update worker/.env with your configuration${NC}"
else
    echo -e "${BLUE}✓ worker/.env file already exists${NC}"
fi

# Create logs directory for worker
mkdir -p worker/logs

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Update .env files with your configuration"
echo "2. Get Sepolia ETH from a faucet"
echo "3. Deploy contracts: npm run deploy"
echo "4. Start worker: npm run dev:worker"
echo "5. Start frontend: npm run dev:frontend"
echo ""
echo -e "${BLUE}For more information, see DEPLOYMENT.md${NC}"

