#!/bin/bash

# Obscura Full Deployment Script
# Deploys contracts and updates all .env files

set -e

echo "🎭 Obscura Deployment Script"
echo "============================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found. Run setup.sh first.${NC}"
    exit 1
fi

# Load environment variables
source .env

# Check if private key is set
if [ -z "$PRIVATE_KEY" ] || [ "$PRIVATE_KEY" = "your_private_key_here" ]; then
    echo -e "${RED}❌ PRIVATE_KEY not set in .env${NC}"
    exit 1
fi

# Check if RPC URL is set
if [ -z "$SEPOLIA_RPC_URL" ] || [[ "$SEPOLIA_RPC_URL" == *"YOUR_INFURA_KEY"* ]]; then
    echo -e "${RED}❌ SEPOLIA_RPC_URL not properly configured in .env${NC}"
    exit 1
fi

echo -e "${BLUE}Deploying to Sepolia testnet...${NC}"
echo ""

# Compile contracts
echo -e "${GREEN}📝 Compiling contracts...${NC}"
cd contracts
npm run build

# Deploy contracts
echo -e "${GREEN}🚀 Deploying contracts...${NC}"
npm run deploy

# Check if deployment was successful
if [ ! -f deployments/sepolia.json ]; then
    echo -e "${RED}❌ Deployment failed. Check logs above.${NC}"
    exit 1
fi

# Extract contract address
CONTRACT_ADDRESS=$(node -p "require('./deployments/sepolia.json').contracts.Obscura")

echo ""
echo -e "${GREEN}✅ Contracts deployed successfully!${NC}"
echo -e "${BLUE}Contract Address: ${CONTRACT_ADDRESS}${NC}"
echo ""

# Update frontend .env.local
if [ -f ../frontend/.env.local ]; then
    echo -e "${GREEN}📝 Updating frontend/.env.local...${NC}"
    if grep -q "NEXT_PUBLIC_OBSCURA_CONTRACT_ADDRESS=" ../frontend/.env.local; then
        sed -i.bak "s|NEXT_PUBLIC_OBSCURA_CONTRACT_ADDRESS=.*|NEXT_PUBLIC_OBSCURA_CONTRACT_ADDRESS=${CONTRACT_ADDRESS}|" ../frontend/.env.local
    else
        echo "NEXT_PUBLIC_OBSCURA_CONTRACT_ADDRESS=${CONTRACT_ADDRESS}" >> ../frontend/.env.local
    fi
fi

# Update worker .env
if [ -f ../worker/.env ]; then
    echo -e "${GREEN}📝 Updating worker/.env...${NC}"
    if grep -q "OBSCURA_CONTRACT_ADDRESS=" ../worker/.env; then
        sed -i.bak "s|OBSCURA_CONTRACT_ADDRESS=.*|OBSCURA_CONTRACT_ADDRESS=${CONTRACT_ADDRESS}|" ../worker/.env
    else
        echo "OBSCURA_CONTRACT_ADDRESS=${CONTRACT_ADDRESS}" >> ../worker/.env
    fi
fi

cd ..

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo -e "${BLUE}Contract Address: ${CONTRACT_ADDRESS}${NC}"
echo -e "${BLUE}View on Etherscan: https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Verify contract on Etherscan (optional)"
echo "2. Start worker: npm run dev:worker"
echo "3. Start frontend: npm run dev:frontend"
echo ""

