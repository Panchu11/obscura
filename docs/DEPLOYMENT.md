# 🚢 Obscura Deployment Guide

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Smart Contract Deployment](#smart-contract-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Worker Node Deployment](#worker-node-deployment)
- [Production Checklist](#production-checklist)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git**
- **MetaMask** or compatible wallet
- **Infura/Alchemy** account (for RPC access)
- **Etherscan** API key (for contract verification)

### Required Accounts

1. **Deployer Wallet**: For deploying smart contracts (needs Sepolia ETH)
2. **Worker Wallet**: For running worker nodes (needs Sepolia ETH)
3. **Infura/Alchemy**: For RPC endpoints
4. **Etherscan**: For contract verification
5. **Vercel** (optional): For frontend hosting

### Get Sepolia ETH

Visit these faucets to get test ETH:
- https://sepoliafaucet.com/
- https://www.alchemy.com/faucets/ethereum-sepolia
- https://faucet.quicknode.com/ethereum/sepolia

---

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/obscura.git
cd obscura
```

### 2. Install Dependencies

```bash
# Root dependencies
npm install

# Contract dependencies
cd contracts
npm install
cd ..

# Frontend dependencies
cd frontend
npm install
cd ..

# Worker dependencies
cd worker
npm install
cd ..
```

### 3. Configure Environment Variables

#### Contracts (.env)

```bash
cd contracts
cp .env.example .env
nano .env
```

Add:
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_deployer_private_key_without_0x
ETHERSCAN_API_KEY=your_etherscan_api_key
```

#### Frontend (.env.local)

```bash
cd ../frontend
cp .env.example .env.local
nano .env.local
```

Add:
```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
NEXT_PUBLIC_OBSCURA_CONTRACT_ADDRESS=will_be_filled_after_deployment
```

#### Worker (.env)

```bash
cd ../worker
cp .env.example .env
nano .env
```

Add:
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
WORKER_PRIVATE_KEY=your_worker_private_key_without_0x
OBSCURA_CONTRACT_ADDRESS=will_be_filled_after_deployment
WORKER_NAME=Worker-1
LOG_LEVEL=info
```

---

## Smart Contract Deployment

### 1. Compile Contracts

```bash
cd contracts
npx hardhat compile
```

Expected output:
```
Compiled 15 Solidity files successfully
```

### 2. Run Tests

```bash
npx hardhat test
```

Ensure all tests pass before deploying.

### 3. Deploy to Sepolia

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

Expected output:
```
Deploying Obscura contract...
Obscura deployed to: 0x37F563b87B48bBcb12497A0a824542CafBC06d1F
Deployment transaction: 0x...
```

**Save the contract address!** You'll need it for frontend and worker configuration.

### 4. Verify Contract on Etherscan

```bash
npx hardhat verify --network sepolia 0x37F563b87B48bBcb12497A0a824542CafBC06d1F
```

Expected output:
```
Successfully verified contract Obscura on Etherscan.
https://sepolia.etherscan.io/address/0x37F563b87B48bBcb12497A0a824542CafBC06d1F#code
```

### 5. Update Configuration Files

Update the contract address in:
- `frontend/.env.local` → `NEXT_PUBLIC_OBSCURA_CONTRACT_ADDRESS`
- `worker/.env` → `OBSCURA_CONTRACT_ADDRESS`

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

#### A. Via Vercel CLI

```bash
cd frontend

# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? **obscura**
- Directory? **./frontend**
- Override settings? **N**

#### B. Via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. Add Environment Variables:
   ```
   NEXT_PUBLIC_CHAIN_ID=11155111
   NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
   NEXT_PUBLIC_OBSCURA_CONTRACT_ADDRESS=0x37F563b87B48bBcb12497A0a824542CafBC06d1F
   ```

6. Click "Deploy"

#### C. Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### Option 2: Self-Hosted

```bash
cd frontend

# Build for production
npm run build

# Start production server
npm start
```

For production, use a process manager like PM2:

```bash
npm install -g pm2
pm2 start npm --name "obscura-frontend" -- start
pm2 save
pm2 startup
```

---

## Worker Node Deployment

### Option 1: Local Development

```bash
cd worker
npm run dev
```

### Option 2: Production Server (Ubuntu/Debian)

#### 1. Set Up Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Git
sudo apt-get install -y git

# Clone repository
git clone https://github.com/yourusername/obscura.git
cd obscura/worker

# Install dependencies
npm install
```

#### 2. Configure Environment

```bash
cp .env.example .env
nano .env
```

Fill in all required values.

#### 3. Build TypeScript

```bash
npm run build
```

#### 4. Run with PM2

```bash
# Install PM2
sudo npm install -g pm2

# Start worker
pm2 start npm --name "obscura-worker" -- run dev

# Save PM2 configuration
pm2 save

# Set up auto-restart on reboot
pm2 startup
# Follow the instructions printed

# Monitor logs
pm2 logs obscura-worker
```

#### 5. Set Up Firewall (Optional)

```bash
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### Option 3: Docker (Advanced)

Create `worker/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

CMD ["npm", "run", "dev"]
```

Build and run:

```bash
cd worker
docker build -t obscura-worker .
docker run -d --name obscura-worker --env-file .env obscura-worker
```

---

## Production Checklist

### Smart Contracts

- [ ] All tests passing
- [ ] Contract deployed to Sepolia
- [ ] Contract verified on Etherscan
- [ ] Contract address saved and distributed
- [ ] Deployer wallet secured

### Frontend

- [ ] Environment variables configured
- [ ] Build successful
- [ ] Deployed to Vercel/hosting
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Wallet connection tested
- [ ] All features working

### Worker Node

- [ ] Environment variables configured
- [ ] Worker wallet funded with ETH
- [ ] Worker registered on contract
- [ ] PM2 process running
- [ ] Auto-restart configured
- [ ] Logs being generated
- [ ] Job claiming working

### Security

- [ ] Private keys stored securely
- [ ] Environment files not committed to Git
- [ ] RPC endpoints secured
- [ ] Rate limiting configured (if applicable)
- [ ] Monitoring set up

---

## Monitoring & Maintenance

### Monitor Smart Contract

**Etherscan:**
- View contract: https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
- Monitor transactions
- Check events
- View contract state

**Blockchain Explorer:**
```bash
# Get job count
cast call YOUR_CONTRACT_ADDRESS "jobCounter()(uint256)" --rpc-url $SEPOLIA_RPC_URL

# Get worker info
cast call YOUR_CONTRACT_ADDRESS "getWorker(address)(tuple)" YOUR_WORKER_ADDRESS --rpc-url $SEPOLIA_RPC_URL
```

### Monitor Frontend

**Vercel Dashboard:**
- View deployment logs
- Monitor analytics
- Check error rates
- View performance metrics

**Browser Console:**
- Check for JavaScript errors
- Monitor network requests
- Verify wallet connections

### Monitor Worker Node

**PM2 Commands:**
```bash
# View status
pm2 status

# View logs
pm2 logs obscura-worker

# View detailed info
pm2 show obscura-worker

# Restart
pm2 restart obscura-worker

# Stop
pm2 stop obscura-worker
```

**Log Files:**
```bash
# View worker logs
tail -f worker/logs/combined.log

# View error logs
tail -f worker/logs/error.log
```

### Health Checks

Create a monitoring script:

```bash
#!/bin/bash
# health-check.sh

# Check if worker is running
if pm2 list | grep -q "obscura-worker.*online"; then
    echo "✅ Worker is running"
else
    echo "❌ Worker is down"
    pm2 restart obscura-worker
fi

# Check worker balance
BALANCE=$(cast balance YOUR_WORKER_ADDRESS --rpc-url $SEPOLIA_RPC_URL)
echo "Worker balance: $BALANCE"

if [ "$BALANCE" -lt "100000000000000000" ]; then
    echo "⚠️ Low balance! Please fund worker wallet"
fi
```

Run with cron:
```bash
# Edit crontab
crontab -e

# Add line (check every 5 minutes)
*/5 * * * * /path/to/health-check.sh >> /var/log/obscura-health.log 2>&1
```

---

## Troubleshooting

### Contract Deployment Issues

**Error: Insufficient funds**
```
Solution: Fund deployer wallet with Sepolia ETH
```

**Error: Nonce too low**
```bash
# Reset nonce
npx hardhat clean
rm -rf cache artifacts
npx hardhat compile
```

**Error: Contract verification failed**
```bash
# Try manual verification
npx hardhat verify --network sepolia \
  --constructor-args arguments.js \
  YOUR_CONTRACT_ADDRESS
```

### Frontend Issues

**Error: Cannot connect to wallet**
```
Solution: 
1. Check you're on Sepolia network
2. Clear browser cache
3. Try different wallet
```

**Error: RPC error**
```
Solution:
1. Check NEXT_PUBLIC_RPC_URL is correct
2. Verify Infura/Alchemy key is valid
3. Try different RPC provider
```

**Error: Build failed**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Worker Node Issues

**Error: Worker not claiming jobs**
```
Solution:
1. Check worker is registered: contract.getWorker(address)
2. Verify worker has ETH for gas
3. Check logs for errors
4. Restart worker: pm2 restart obscura-worker
```

**Error: Out of gas**
```
Solution:
1. Fund worker wallet
2. Increase gas limit in code
```

**Error: Connection timeout**
```
Solution:
1. Check RPC URL is correct
2. Try different RPC provider
3. Check network connectivity
```

---

## Backup & Recovery

### Backup Important Data

```bash
# Backup environment files (encrypted!)
tar -czf obscura-env-backup.tar.gz \
  contracts/.env \
  frontend/.env.local \
  worker/.env

# Encrypt backup
gpg -c obscura-env-backup.tar.gz

# Store securely (NOT in Git!)
```

### Recovery Procedure

1. **Contract Lost**: Redeploy from source code
2. **Frontend Down**: Redeploy from Git
3. **Worker Down**: Restart PM2 process
4. **Private Key Lost**: Generate new wallet, re-register worker

---

## Scaling

### Multiple Workers

Run multiple worker instances:

```bash
# Worker 1
pm2 start npm --name "obscura-worker-1" -- run dev

# Worker 2 (different wallet)
pm2 start npm --name "obscura-worker-2" -- run dev
```

### Load Balancing

Use Nginx for frontend load balancing:

```nginx
upstream obscura_frontend {
    server localhost:3000;
    server localhost:3001;
}

server {
    listen 80;
    server_name obscura.example.com;
    
    location / {
        proxy_pass http://obscura_frontend;
    }
}
```

---

## Support

For deployment help:
- **GitHub Issues**: [github.com/yourusername/obscura/issues](https://github.com/yourusername/obscura/issues)
- **Discord**: [Join our community](https://discord.gg/obscura)
- **Email**: support@obscura.fhe

---

**Congratulations! Your Obscura deployment is complete!** 🎉

