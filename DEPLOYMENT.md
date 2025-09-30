# Obscura Deployment Guide

## Prerequisites

- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH (get from faucet)
- Infura or Alchemy API key (optional, for better RPC)

## Quick Start

### 1. Install Dependencies

```bash
# Install all workspace dependencies
npm install

# Or install individually
cd contracts && npm install
cd ../frontend && npm install
cd ../worker && npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update:

```bash
cp .env.example .env
```

Update the following in `.env`:
- `SEPOLIA_RPC_URL` - Your Sepolia RPC endpoint
- `PRIVATE_KEY` - Already set to your funded wallet
- `ETHERSCAN_API_KEY` - For contract verification (optional)

### 3. Deploy Smart Contracts

```bash
# Compile contracts
npm run build:contracts

# Deploy to Sepolia
npm run deploy

# Verify on Etherscan (optional)
cd contracts
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

The deployment script will automatically:
- Deploy the Obscura contract
- Save deployment info to `contracts/deployments/sepolia.json`
- Update `.env` with contract address

### 4. Start Worker Node

```bash
# In a new terminal
npm run dev:worker
```

The worker will:
- Connect to Sepolia testnet
- Listen for new job events
- Automatically claim and execute jobs
- Submit results back to the contract

### 5. Start Frontend

```bash
# In another terminal
npm run dev:frontend
```

Access the app at `http://localhost:3000`

## Detailed Deployment Steps

### Smart Contract Deployment

#### Local Testing (Hardhat Network)

```bash
# Terminal 1: Start local node
cd contracts
npx hardhat node

# Terminal 2: Deploy to local network
npx hardhat run scripts/deploy.ts --network localhost

# Terminal 3: Run tests
npx hardhat test
```

#### Sepolia Testnet

```bash
cd contracts

# Compile
npx hardhat compile

# Deploy
npx hardhat run scripts/deploy.ts --network sepolia

# Verify (replace with your contract address)
npx hardhat verify --network sepolia 0xYourContractAddress
```

### Frontend Deployment

#### Local Development

```bash
cd frontend
npm run dev
```

#### Production Build

```bash
cd frontend
npm run build
npm start
```

#### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Or connect GitHub repo to Vercel dashboard
```

**Environment Variables for Vercel:**
- `NEXT_PUBLIC_CHAIN_ID=11155111`
- `NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY`
- `NEXT_PUBLIC_OBSCURA_CONTRACT_ADDRESS=<deployed_address>`
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=<your_project_id>`

### Worker Node Deployment

#### Local Development

```bash
cd worker
npm run dev
```

#### Production Deployment (PM2)

```bash
cd worker

# Build
npm run build

# Install PM2
npm install -g pm2

# Start with PM2
pm2 start dist/index.js --name obscura-worker

# Save PM2 config
pm2 save

# Setup auto-restart on reboot
pm2 startup
```

#### Deploy to Cloud (AWS EC2 Example)

```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repo
git clone <your-repo-url>
cd obscura/worker

# Install dependencies
npm install

# Create .env file
nano .env
# Paste your environment variables

# Build
npm run build

# Install PM2
sudo npm install -g pm2

# Start worker
pm2 start dist/index.js --name obscura-worker

# Monitor
pm2 logs obscura-worker
pm2 monit
```

## Configuration

### Contract Configuration

Edit `contracts/hardhat.config.ts` for:
- Network settings
- Gas price configuration
- Compiler optimization
- Etherscan API key

### Frontend Configuration

Edit `frontend/next.config.js` for:
- Environment variables
- Build optimization
- Webpack configuration

### Worker Configuration

Edit `worker/src/index.ts` for:
- Computation engine settings
- Job claiming strategy
- Logging configuration

## Testing

### Smart Contract Tests

```bash
cd contracts

# Run all tests
npx hardhat test

# Run specific test
npx hardhat test test/Obscura.test.ts

# Run with gas reporting
REPORT_GAS=true npx hardhat test

# Run with coverage
npx hardhat coverage
```

### Frontend Tests

```bash
cd frontend

# Run tests (when implemented)
npm test

# Run E2E tests
npm run test:e2e
```

### Integration Testing

```bash
# Terminal 1: Local node
cd contracts && npx hardhat node

# Terminal 2: Deploy contracts
npx hardhat run scripts/deploy.ts --network localhost

# Terminal 3: Start worker
cd worker && npm run dev

# Terminal 4: Start frontend
cd frontend && npm run dev

# Test the full flow in browser
```

## Monitoring

### Worker Monitoring

```bash
# View logs
pm2 logs obscura-worker

# Monitor resources
pm2 monit

# View status
pm2 status
```

### Contract Monitoring

- View on Etherscan: `https://sepolia.etherscan.io/address/<contract_address>`
- Monitor events in real-time
- Track gas usage
- Verify transactions

### Frontend Monitoring

- Vercel Analytics (if deployed on Vercel)
- Browser console for errors
- Network tab for RPC calls

## Troubleshooting

### Common Issues

#### 1. "Insufficient funds" error

**Solution:** Ensure your wallet has enough Sepolia ETH
```bash
# Check balance
npx hardhat run scripts/checkBalance.ts --network sepolia

# Get testnet ETH from faucets:
# - https://sepoliafaucet.com/
# - https://www.alchemy.com/faucets/ethereum-sepolia
```

#### 2. "Nonce too high" error

**Solution:** Reset MetaMask account
- Settings → Advanced → Reset Account

#### 3. Worker not claiming jobs

**Solution:** Check worker logs
```bash
pm2 logs obscura-worker

# Ensure:
# - Worker is registered on contract
# - Worker has sufficient ETH for gas
# - RPC endpoint is working
```

#### 4. Frontend not connecting to wallet

**Solution:**
- Ensure MetaMask is on Sepolia network
- Check browser console for errors
- Verify contract address in .env

#### 5. Contract deployment fails

**Solution:**
```bash
# Check Hardhat config
cat contracts/hardhat.config.ts

# Verify private key is set
echo $PRIVATE_KEY

# Try with higher gas price
# Edit hardhat.config.ts and add:
# gasPrice: 50000000000 // 50 gwei
```

## Security Checklist

Before mainnet deployment:

- [ ] Audit smart contracts
- [ ] Test all edge cases
- [ ] Implement rate limiting
- [ ] Add circuit breakers
- [ ] Set up monitoring alerts
- [ ] Implement multi-sig for admin functions
- [ ] Test with small amounts first
- [ ] Have emergency pause mechanism
- [ ] Document all admin functions
- [ ] Set up bug bounty program

## Maintenance

### Updating Contracts

```bash
# Deploy new version
npx hardhat run scripts/deploy.ts --network sepolia

# Update frontend .env with new address
# Update worker .env with new address

# Restart services
pm2 restart obscura-worker
```

### Updating Worker

```bash
# Pull latest code
git pull

# Rebuild
cd worker
npm run build

# Restart
pm2 restart obscura-worker
```

### Updating Frontend

```bash
# Pull latest code
git pull

# Rebuild
cd frontend
npm run build

# Redeploy (Vercel auto-deploys on git push)
vercel --prod
```

## Performance Optimization

### Contract Optimization

- Use `calldata` instead of `memory` where possible
- Batch operations to reduce gas
- Use events instead of storage for historical data
- Optimize struct packing

### Frontend Optimization

- Enable Next.js image optimization
- Implement code splitting
- Use React.memo for expensive components
- Lazy load components
- Optimize bundle size

### Worker Optimization

- Implement job queue for parallel processing
- Cache frequently used data
- Optimize FHE computation algorithms
- Use connection pooling for RPC calls

## Backup and Recovery

### Contract Data

- Events are permanent on blockchain
- Export important data regularly
- Keep deployment artifacts
- Document all contract addresses

### Worker Data

```bash
# Backup logs
tar -czf logs-backup-$(date +%Y%m%d).tar.gz worker/logs/

# Backup configuration
cp .env .env.backup
```

## Support

- GitHub Issues: [Your Repo URL]
- Discord: [Your Discord]
- Email: [Your Email]
- Documentation: [Your Docs URL]

## License

MIT License - see LICENSE file for details

