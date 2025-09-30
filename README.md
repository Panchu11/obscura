# 🎭 Obscura

> **Computing in the Shadows - Where Your Data Remains Hidden**

A decentralized marketplace for Fully Homomorphic Encrypted (FHE) computation. Obscura enables clients to outsource sensitive computations to untrusted workers while maintaining complete data privacy through end-to-end encryption.

## 🌐 Live Application

**🚀 Frontend**: https://obscura-frontend.vercel.app/

**📝 Smart Contract**: [0x37F563b87B48bBcb12497A0a824542CafBC06d1F](https://sepolia.etherscan.io/address/0x37F563b87B48bBcb12497A0a824542CafBC06d1F) (Sepolia Testnet)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Sepolia Testnet](https://img.shields.io/badge/Network-Sepolia-purple)](https://sepolia.etherscan.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

**Live Demo:** [obscura-fhe.vercel.app](https://obscura-fhe.vercel.app) | **Contract:** [0x37F563b87B48bBcb12497A0a824542CafBC06d1F](https://sepolia.etherscan.io/address/0x37F563b87B48bBcb12497A0a824542CafBC06d1F)

---

## 📖 Table of Contents

- [What is Obscura?](#-what-is-obscura)
- [Key Features](#-key-features)
- [Quick Start](#-quick-start)
- [How It Works](#-how-it-works)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Usage Guide](#-usage-guide)
- [API Reference](#-api-reference)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 What is Obscura?

Obscura is a **privacy-preserving compute marketplace** that leverages Fully Homomorphic Encryption (FHE) to enable computation on encrypted data. Workers can execute complex computations without ever seeing the plaintext data, ensuring complete privacy for clients.

### The Problem

Organizations need to perform computations on sensitive data but cannot trust third-party compute providers with plaintext access. Traditional encryption requires decryption before computation, creating a security vulnerability.

### Our Solution

Obscura uses FHE technology to enable computation on encrypted data. Workers execute jobs without ever seeing the plaintext, ensuring complete data privacy while maintaining computational utility.

### Real-World Use Cases

- 🏥 **Healthcare Analytics**: Analyze patient data without exposing sensitive information (HIPAA compliant)
- 💰 **Financial Risk Assessment**: Perform risk calculations on encrypted financial data
- 🔬 **Scientific Research**: Run statistical analysis on confidential datasets
- 🤖 **Private ML Inference**: Execute model predictions on encrypted user data
- 📊 **Supply Chain Analytics**: Compute aggregates without revealing competitive information

---

## ✨ Key Features

### For Clients
- ✅ **Complete Privacy**: Your data never leaves encrypted form
- ✅ **Easy Integration**: Simple API for job submission
- ✅ **Trustless Execution**: Smart contract escrow ensures fair payment
- ✅ **Multiple Computation Types**: Addition, Multiplication, Comparison, and more
- ✅ **Real-time Tracking**: Monitor job status and progress

### For Workers
- ✅ **Earn Rewards**: Get paid for executing computations
- ✅ **Reputation System**: Build trust and earn more jobs
- ✅ **Automated Processing**: Worker nodes handle jobs automatically
- ✅ **Stake-based Security**: Minimum stake ensures commitment
- ✅ **Fair Compensation**: Transparent reward system

### Technical Features
- ✅ **Fully Homomorphic Encryption**: Compute on encrypted data
- ✅ **Smart Contract Escrow**: Automated, trustless payments
- ✅ **Multi-Wallet Support**: MetaMask, Rabby, Leap, Coinbase, WalletConnect
- ✅ **Gas Optimized**: Efficient on-chain operations
- ✅ **Event-Driven Architecture**: Real-time job updates
- ✅ **Comprehensive Testing**: 15+ smart contract tests

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MetaMask** (or compatible wallet) with Sepolia ETH
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/obscura.git
cd obscura

# Install dependencies for all packages
npm install
cd contracts && npm install && cd ..
cd frontend && npm install && cd ..
cd worker && npm install && cd ..
```

### Configuration

1. **Set up environment variables:**

```bash
# Frontend (.env.local)
cd frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
NEXT_PUBLIC_OBSCURA_CONTRACT_ADDRESS=0x37F563b87B48bBcb12497A0a824542CafBC06d1F
```

```bash
# Worker (.env)
cd ../worker
cp .env.example .env
```

Edit `worker/.env`:
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
WORKER_PRIVATE_KEY=your_worker_private_key
OBSCURA_CONTRACT_ADDRESS=0x37F563b87B48bBcb12497A0a824542CafBC06d1F
WORKER_NAME=Worker-1
LOG_LEVEL=info
```

2. **Get Sepolia ETH:**
   - Visit [Sepolia Faucet](https://sepoliafaucet.com/)
   - Get test ETH for your wallet and worker address

### Running the Application

**Terminal 1 - Start the Worker Node:**
```bash
cd worker
npm run dev
```

**Terminal 2 - Start the Frontend:**
```bash
cd frontend
npm run dev
```

**Access the Application:**
- Open http://localhost:3000 in your browser
- Connect your wallet (Sepolia network)
- Start creating jobs!

---

## 💡 How It Works

### Complete Job Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. CLIENT CREATES JOB                                           │
│    • Encrypts data client-side                                  │
│    • Submits job with reward to smart contract                  │
│    • Funds are held in escrow                                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. JOB BECOMES VISIBLE                                          │
│    • JobCreated event emitted on blockchain                     │
│    • Appears in "Available Jobs" for all workers                │
│    • Client sees it in "My Jobs" (Pending status)               │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. WORKER CLAIMS JOB                                            │
│    • Worker node detects new job event                          │
│    • Calls claimJob() on smart contract                         │
│    • Job status: Pending → Assigned                             │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. WORKER EXECUTES COMPUTATION                                  │
│    • Performs FHE computation on encrypted data                 │
│    • Worker never sees plaintext values                         │
│    • Computation takes ~10-30 seconds                           │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. WORKER SUBMITS RESULT                                        │
│    • Calls submitResult() with encrypted result                 │
│    • Job status: Assigned → Completed                           │
│    • Result stored on-chain (still encrypted)                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. CLIENT VERIFIES & PAYS                                       │
│    • Client calls verifyAndPay()                                │
│    • Decrypts result client-side                                │
│    • Smart contract releases payment to worker                  │
│    • Job status: Completed → Verified                           │
└─────────────────────────────────────────────────────────────────┘
```

### Example: Private Addition

```typescript
// 1. Client encrypts numbers (10 + 20)
const job = await createJob({
  type: 'Addition',
  number1: 10,
  number2: 20,
  reward: '0.001' // ETH
});

// 2. Worker detects and claims job
// 3. Worker computes: encrypted(10) + encrypted(20) = encrypted(30)
// 4. Worker submits encrypted result

// 5. Client verifies and sees result
const result = await verifyAndPay(jobId);
console.log(result); // 30 ✅
```

---

## 🏗️ Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                         OBSCURA ECOSYSTEM                         │
└──────────────────────────────────────────────────────────────────┘

┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   CLIENT        │         │  SMART CONTRACT  │         │   WORKER        │
│   (Browser)     │         │  (Sepolia)       │         │   (Node.js)     │
│                 │         │                  │         │                 │
│ • Next.js UI    │────────▶│ • Obscura.sol    │◀────────│ • Event Listener│
│ • Wallet (MM)   │         │ • Job Management │         │ • FHE Engine    │
│ • FHE Encrypt   │         │ • Escrow System  │         │ • Auto-claim    │
│ • Result Decrypt│         │ • Worker Registry│         │ • Result Submit │
└─────────────────┘         └──────────────────┘         └─────────────────┘
```

### Component Details

#### Smart Contract (Obscura.sol)
- **Job Management**: Create, claim, complete, verify, cancel
- **Worker Registry**: Register with stake (min 0.1 ETH), reputation tracking
- **Escrow System**: Holds funds until job verification
- **Platform Fees**: 2% fee on job rewards
- **Events**: JobCreated, JobAssigned, JobCompleted, etc.

#### Frontend (Next.js 14)
- **5 Interactive Tabs**:
  - FHE Demo: Interactive playground
  - Privacy: Privacy metrics dashboard
  - Client: Your jobs management
  - Worker: Available jobs & worker dashboard
  - Analytics: Charts and statistics
- **Multi-Wallet Support**: MetaMask, Rabby, Leap, Coinbase, WalletConnect
- **Real-time Updates**: Auto-refresh every 10 seconds
- **Responsive Design**: Mobile-friendly UI

#### Worker Node (TypeScript)
- **Event Listener**: Monitors blockchain for new jobs
- **Auto-claim**: Automatically claims available jobs
- **FHE Computation**: Executes encrypted computations
- **Result Submission**: Submits encrypted results on-chain
- **Logging**: Comprehensive logging system

---

## 📦 Project Structure

```
obscura/
├── contracts/                    # Smart Contracts
│   ├── src/
│   │   └── Obscura.sol          # Main marketplace contract
│   ├── scripts/
│   │   └── deploy.ts            # Deployment script
│   ├── test/
│   │   └── Obscura.test.ts      # Contract tests
│   ├── hardhat.config.ts        # Hardhat configuration
│   └── package.json
│
├── frontend/                     # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx         # Main page with 5 tabs
│   │   │   ├── layout.tsx       # Root layout
│   │   │   └── globals.css      # Global styles
│   │   ├── components/
│   │   │   ├── Header.tsx       # Navigation header
│   │   │   ├── Hero.tsx         # Hero section
│   │   │   ├── JobList.tsx      # Client jobs list
│   │   │   ├── WorkerDashboard.tsx  # Worker interface
│   │   │   ├── FHEPlayground.tsx    # Interactive FHE demo
│   │   │   ├── PrivacyDashboard.tsx # Privacy metrics
│   │   │   ├── AdvancedAnalytics.tsx # Charts & stats
│   │   │   └── CreateJobModal.tsx   # Job creation form
│   │   ├── hooks/
│   │   │   └── useObscura.ts    # Main blockchain hook
│   │   └── lib/
│   │       ├── contracts.ts     # Contract ABI & config
│   │       └── fhe.ts           # FHE utilities
│   ├── public/                  # Static assets
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── package.json
│
├── worker/                       # Worker Node
│   ├── src/
│   │   ├── index.ts             # Main worker entry
│   │   ├── listener.ts          # Event listener
│   │   ├── computations/
│   │   │   └── engine.ts        # FHE computation engine
│   │   └── utils/
│   │       └── logger.ts        # Logging utility
│   ├── .env.example             # Environment template
│   └── package.json
│
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md          # Architecture details
│   ├── API.md                   # API reference
│   ├── DEPLOYMENT.md            # Deployment guide
│   └── USER_GUIDE.md            # User guide
│
├── .gitignore
├── LICENSE
└── README.md                     # This file
```

---

## 🔧 Technology Stack

### Smart Contracts
- **Solidity 0.8.24** - Smart contract language
- **Hardhat** - Development environment & testing
- **OpenZeppelin** - Secure contract libraries (Ownable, ReentrancyGuard)
- **Ethers.js v6** - Ethereum interaction library

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript 5.0** - Type safety
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript Ethereum library
- **RainbowKit** - Wallet connection UI
- **TailwindCSS** - Utility-first CSS
- **Framer Motion** - Animations
- **Recharts** - Data visualization

### Worker Node
- **Node.js 18+** - Runtime environment
- **TypeScript** - Type safety
- **Ethers.js v6** - Blockchain interaction
- **Winston** - Logging library

### Development Tools
- **Git** - Version control
- **npm** - Package management
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## 🎯 Supported Computations

| Type | Description | Use Case | Complexity |
|------|-------------|----------|------------|
| **Addition** | Add two encrypted numbers | Sum calculations | Simple |
| **Multiplication** | Multiply two encrypted numbers | Product calculations | Simple |
| **Comparison** | Compare two encrypted numbers | Greater than/less than | Simple |

### Future Computations (Roadmap)
- Encrypted Average
- Encrypted Max/Min
- Linear Regression
- Decision Tree Inference
- Neural Network Inference

---

## 📱 Usage Guide

### For Clients (Job Creators)

#### 1. Connect Wallet
- Click "Connect Wallet" in the header
- Select your wallet (MetaMask, Rabby, Leap, etc.)
- Ensure you're on Sepolia network
- Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)

#### 2. Create a Job
- Click "Create Job" button
- Select computation type (Addition, Multiplication, Comparison)
- Enter your numbers (they will be encrypted automatically)
- Set reward amount (minimum 0.001 ETH recommended)
- Click "Submit Job" and approve transaction

#### 3. Monitor Your Job
- Go to "Client" tab
- See your job in "Your Jobs" list
- Watch status change: Pending → Assigned → Completed
- Filter by status: All, Pending, Assigned, Completed

#### 4. Verify Result
- When status is "Completed", click "View Details"
- Click "Verify & Pay" button
- Approve transaction
- See the decrypted result!
- Worker receives payment automatically

### For Workers

#### 1. Register as Worker
- Go to "Worker" tab
- Enter worker name
- Set stake amount (minimum 0.1 ETH)
- Click "Register as Worker"
- Approve transaction

#### 2. Run Worker Node
```bash
cd worker
npm run dev
```

#### 3. Monitor Jobs
- Worker node automatically detects new jobs
- Claims jobs automatically
- Executes FHE computations
- Submits results on-chain
- Check Terminal for logs

#### 4. Earn Rewards
- When client verifies result, you get paid
- Build reputation by completing jobs
- Higher reputation = more trust

## 📚 API Reference

### Smart Contract Functions

#### Job Management

```solidity
// Create a new job
function createJob(
    uint8 computationType,
    bytes memory encryptedInputs
) external payable returns (uint256 jobId)

// Claim a pending job (workers only)
function claimJob(uint256 jobId) external

// Submit computation result (workers only)
function submitResult(
    uint256 jobId,
    bytes memory encryptedResult
) external

// Verify result and release payment (clients only)
function verifyAndPay(uint256 jobId) external

// Cancel a pending job (clients only)
function cancelJob(uint256 jobId) external
```

#### Worker Management

```solidity
// Register as a worker
function registerWorker(string memory name) external payable

// Deregister and withdraw stake
function deregisterWorker() external

// Get worker information
function getWorker(address workerAddress)
    external view returns (Worker memory)

// Get all registered workers
function getAllWorkers()
    external view returns (address[] memory)
```

#### View Functions

```solidity
// Get job details
function getJob(uint256 jobId)
    external view returns (Job memory)

// Get client's jobs
function getClientJobs(address client)
    external view returns (uint256[] memory)

// Get worker's jobs
function getWorkerJobs(address worker)
    external view returns (uint256[] memory)
```

### Frontend Hooks

#### useObscura Hook

```typescript
const {
  // State
  jobs,              // All jobs
  myJobs,            // Jobs created by connected wallet
  isWorker,          // Is connected wallet a registered worker
  workerInfo,        // Worker information
  loading,           // Loading state

  // Functions
  createJob,         // Create a new job
  registerWorker,    // Register as worker
  claimJob,          // Claim a job
  verifyAndPay,      // Verify and pay for job
  cancelJob,         // Cancel a job

  // Refresh
  refreshJobs,       // Manually refresh jobs
} = useObscura();
```

#### Example Usage

```typescript
// Create a job
const txHash = await createJob(
  ComputationType.Addition,  // 0 = Addition, 1 = Multiplication, 2 = Comparison
  '10',                      // First number
  '20',                      // Second number
  '0.001'                    // Reward in ETH
);

// Register as worker
const txHash = await registerWorker(
  'My Worker',               // Worker name
  '0.1'                      // Stake amount in ETH
);

// Verify and pay
const txHash = await verifyAndPay(jobId);
```

---

## 🔐 Security Features

### Smart Contract Security
- ✅ **ReentrancyGuard**: Prevents reentrancy attacks
- ✅ **Ownable**: Access control for admin functions
- ✅ **Input Validation**: All inputs validated
- ✅ **Safe Math**: Solidity 0.8.24 built-in overflow protection
- ✅ **Event Logging**: All actions emit events for transparency

### Privacy Guarantees
- ✅ **End-to-End Encryption**: Data encrypted client-side
- ✅ **FHE Computation**: Workers compute on encrypted data
- ✅ **No Plaintext Exposure**: Workers never see actual values
- ✅ **Client-Side Decryption**: Only client can decrypt results
- ✅ **On-Chain Privacy**: Encrypted data stored on blockchain

### Economic Security
- ✅ **Worker Staking**: Minimum 0.1 ETH stake required
- ✅ **Escrow System**: Funds held until verification
- ✅ **Reputation System**: Track worker reliability
- ✅ **Platform Fees**: 2% fee for platform sustainability

---

## 🧪 Testing

### Run Contract Tests

```bash
cd contracts
npm test
```

**Test Coverage:**
- ✅ Worker registration and deregistration
- ✅ Job creation with various computation types
- ✅ Job claiming by workers
- ✅ Result submission
- ✅ Payment verification
- ✅ Job cancellation
- ✅ Edge cases and error handling
- ✅ Gas optimization tests

### Run Frontend Tests

```bash
cd frontend
npm test
```

### Integration Testing

```bash
# Start all services
npm run dev:all

# Run integration tests
npm run test:integration
```

---

## 🚢 Deployment

### Deploy Smart Contracts

1. **Set up environment:**

```bash
cd contracts
cp .env.example .env
```

Edit `.env`:
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_deployer_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

2. **Deploy:**

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

3. **Verify on Etherscan:**

```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

### Deploy Frontend (Vercel)

1. **Push to GitHub:**

```bash
git add .
git commit -m "Deploy Obscura"
git push origin main
```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set environment variables
   - Deploy!

### Run Worker Node (Production)

1. **Set up server** (Ubuntu/Debian):

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone https://github.com/yourusername/obscura.git
cd obscura/worker

# Install dependencies
npm install

# Set up environment
cp .env.example .env
nano .env  # Edit with your values
```

2. **Run with PM2:**

```bash
# Install PM2
npm install -g pm2

# Start worker
pm2 start npm --name "obscura-worker" -- run dev

# Save PM2 configuration
pm2 save

# Set up auto-restart on reboot
pm2 startup
```

3. **Monitor:**

```bash
# View logs
pm2 logs obscura-worker

# Monitor status
pm2 status

# Restart
pm2 restart obscura-worker
```

---

## 🛠️ Development

### Local Development Setup

```bash
# Install all dependencies
npm install
cd contracts && npm install && cd ..
cd frontend && npm install && cd ..
cd worker && npm install && cd ..

# Start local blockchain (optional)
cd contracts
npx hardhat node

# Deploy to local network
npx hardhat run scripts/deploy.ts --network localhost

# Start frontend
cd ../frontend
npm run dev

# Start worker
cd ../worker
npm run dev
```

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: add your feature"

# Push and create PR
git push origin feature/your-feature
```

---

## 🐛 Troubleshooting

### Common Issues

#### RPC Error: "Unexpected token '<'"
**Solution:** Check your RPC URL in `.env` files. Make sure you're using a valid Infura/Alchemy key.

```env
# Frontend
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY

# Worker
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

#### Worker Not Detecting Jobs
**Solution:**
1. Check worker is running: `pm2 status` or check terminal
2. Verify contract address in worker `.env`
3. Check worker has ETH for gas fees
4. Review worker logs for errors

#### Transaction Fails
**Solution:**
1. Ensure you're on Sepolia network
2. Check you have enough ETH for gas + reward
3. Verify contract address is correct
4. Try increasing gas limit

#### Jobs Not Showing in UI
**Solution:**
1. Hard refresh browser (Ctrl+Shift+R)
2. Check you're connected to correct wallet
3. Verify you're on Sepolia network
4. Check browser console for errors

### Get Help

- **GitHub Issues**: [github.com/yourusername/obscura/issues](https://github.com/yourusername/obscura/issues)
- **Discord**: [Join our community](https://discord.gg/obscura)
- **Email**: support@obscura.fhe

---

## 🗺️ Roadmap

### Phase 1: Core Functionality ✅ (Completed)
- ✅ Smart contract development
- ✅ Basic FHE operations (Add, Multiply, Compare)
- ✅ Frontend UI with wallet integration
- ✅ Worker node implementation
- ✅ Deployment on Sepolia

### Phase 2: Enhanced Features 🚧 (In Progress)
- 🚧 Advanced computations (Average, Max/Min)
- 🚧 Batch job processing
- 🚧 Worker reputation improvements
- 🚧 Gas optimization
- 🚧 Mobile app

### Phase 3: Production Ready 📋 (Planned)
- 📋 Mainnet deployment
- 📋 Audit by security firm
- 📋 Advanced ML computations
- 📋 Multi-chain support
- 📋 DAO governance

### Phase 4: Ecosystem Growth 🔮 (Future)
- 🔮 SDK for developers
- 🔮 Marketplace for computation templates
- 🔮 Integration with major dApps
- 🔮 Enterprise solutions
- 🔮 Academic partnerships

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

- 🐛 **Report Bugs**: Open an issue with detailed reproduction steps
- 💡 **Suggest Features**: Share your ideas for improvements
- 📝 **Improve Documentation**: Help make our docs better
- 🔧 **Submit PRs**: Fix bugs or add features
- 🧪 **Write Tests**: Improve test coverage
- 🎨 **Design**: Improve UI/UX

### Contribution Process

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Write/update tests**
5. **Commit**: `git commit -m 'feat: add amazing feature'`
6. **Push**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Keep PRs focused and small

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Obscura

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- **Ethereum Foundation** - For the Sepolia testnet
- **OpenZeppelin** - For secure smart contract libraries
- **Vercel** - For frontend hosting
- **Infura** - For RPC infrastructure
- **The Community** - For feedback and support

---

## 📞 Contact & Links

- **Website**: [obscura-fhe.vercel.app](https://obscura-fhe.vercel.app)
- **GitHub**: [github.com/yourusername/obscura](https://github.com/yourusername/obscura)
- **Twitter**: [@ObscuraFHE](https://twitter.com/ObscuraFHE)
- **Discord**: [Join our community](https://discord.gg/obscura)
- **Email**: hello@obscura.fhe
- **Contract**: [0x37F563b87B48bBcb12497A0a824542CafBC06d1F](https://sepolia.etherscan.io/address/0x37F563b87B48bBcb12497A0a824542CafBC06d1F)

---

## ⭐ Star History

If you find Obscura useful, please consider giving it a star on GitHub!

---

<div align="center">

### 🎭 Obscura - Computing in the Shadows

**Built with ❤️ for privacy-preserving computation**

[Get Started](#-quick-start) • [Documentation](#-api-reference) • [Community](https://discord.gg/obscura)

<sub>Privacy in the Light, Computation in the Shadows</sub>

</div>

---

