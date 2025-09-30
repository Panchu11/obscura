# 🏗️ Obscura Architecture

## Table of Contents

- [Overview](#overview)
- [System Components](#system-components)
- [Data Flow](#data-flow)
- [Smart Contract Architecture](#smart-contract-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Worker Node Architecture](#worker-node-architecture)
- [Security Model](#security-model)
- [Scalability Considerations](#scalability-considerations)

---

## Overview

Obscura is a decentralized marketplace for Fully Homomorphic Encrypted (FHE) computation. The system consists of three main components:

1. **Smart Contracts** - On-chain job management and escrow
2. **Frontend** - User interface for clients and workers
3. **Worker Nodes** - Off-chain computation engines

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         OBSCURA SYSTEM                           │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   CLIENTS    │         │  BLOCKCHAIN  │         │   WORKERS    │
│              │         │              │         │              │
│ • Web UI     │────────▶│ • Obscura    │◀────────│ • Node.js    │
│ • Wallet     │         │   Contract   │         │ • Event      │
│ • Encrypt    │         │ • Escrow     │         │   Listener   │
│ • Decrypt    │         │ • Events     │         │ • FHE Engine │
└──────────────┘         └──────────────┘         └──────────────┘
       │                        │                        │
       │                        │                        │
       └────────────────────────┴────────────────────────┘
                         Sepolia Testnet
```

---

## System Components

### 1. Smart Contracts (Solidity)

**Location:** `contracts/src/Obscura.sol`

**Responsibilities:**
- Job lifecycle management (create, claim, complete, verify, cancel)
- Worker registration and reputation tracking
- Escrow and payment handling
- Event emission for off-chain listeners
- Platform fee collection

**Key Features:**
- Minimum worker stake: 0.1 ETH
- Platform fee: 2% of job reward
- Job statuses: Pending, Assigned, Completed, Verified, Disputed, Cancelled
- Worker reputation: 0-100 score

**Dependencies:**
- OpenZeppelin Ownable (access control)
- OpenZeppelin ReentrancyGuard (security)
- Hardhat (development & testing)

### 2. Frontend (Next.js 14)

**Location:** `frontend/src/`

**Responsibilities:**
- User interface for job creation and management
- Wallet connection and transaction signing
- Real-time job status updates
- Worker dashboard and registration
- Analytics and visualization

**Key Features:**
- 5 interactive tabs (FHE Demo, Privacy, Client, Worker, Analytics)
- Multi-wallet support (MetaMask, Rabby, Leap, Coinbase, WalletConnect)
- Responsive design (mobile-friendly)
- Real-time updates (10-second polling)
- Client-side encryption/decryption

**Tech Stack:**
- Next.js 14 (App Router)
- TypeScript
- Wagmi (React hooks for Ethereum)
- RainbowKit (wallet UI)
- TailwindCSS (styling)
- Framer Motion (animations)

### 3. Worker Nodes (Node.js)

**Location:** `worker/src/`

**Responsibilities:**
- Listen for JobCreated events
- Automatically claim available jobs
- Execute FHE computations
- Submit encrypted results
- Logging and monitoring

**Key Features:**
- Event-driven architecture
- Automatic job claiming
- FHE computation engine
- Comprehensive logging
- Error handling and retry logic

**Tech Stack:**
- Node.js 18+
- TypeScript
- Ethers.js v6
- Winston (logging)

---

## Data Flow

### Complete Job Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 1: JOB CREATION                                           │
└─────────────────────────────────────────────────────────────────┘

Client (Browser)                 Smart Contract
      │                                │
      │ 1. Encrypt data (10, 20)       │
      │    using client-side FHE       │
      │                                │
      │ 2. createJob(                  │
      │      type: Addition,           │
      │      encrypted: 0x4a7b...,     │
      │      reward: 0.001 ETH         │
      │    )                            │
      ├───────────────────────────────▶│
      │                                │ 3. Store job on-chain
      │                                │    Status: Pending
      │                                │
      │                                │ 4. Emit JobCreated event
      │                                │    (jobId, client, type, reward)
      │                                │
      │ 5. Transaction confirmed       │
      │◀───────────────────────────────┤
      │                                │

┌─────────────────────────────────────────────────────────────────┐
│ PHASE 2: JOB CLAIMING                                           │
└─────────────────────────────────────────────────────────────────┘

Smart Contract                   Worker Node
      │                                │
      │ 1. JobCreated event            │
      ├───────────────────────────────▶│ 2. Detect new job
      │                                │    Parse event data
      │                                │
      │ 3. claimJob(jobId)             │
      │◀───────────────────────────────┤
      │                                │
      │ 4. Update job                  │
      │    worker: 0x742d...           │
      │    status: Assigned            │
      │                                │
      │ 5. Emit JobAssigned event      │
      ├───────────────────────────────▶│
      │                                │

┌─────────────────────────────────────────────────────────────────┐
│ PHASE 3: COMPUTATION                                            │
└─────────────────────────────────────────────────────────────────┘

Worker Node
      │
      │ 1. Fetch encrypted inputs from contract
      │    encryptedInputs: 0x4a7b...
      │
      │ 2. Execute FHE computation
      │    encrypted(10) + encrypted(20)
      │    = encrypted(30)
      │    
      │    ⚠️ Worker NEVER sees plaintext values!
      │
      │ 3. Generate encrypted result
      │    encryptedResult: 0x8f2c...
      │

┌─────────────────────────────────────────────────────────────────┐
│ PHASE 4: RESULT SUBMISSION                                      │
└─────────────────────────────────────────────────────────────────┘

Worker Node                      Smart Contract
      │                                │
      │ 1. submitResult(               │
      │      jobId,                    │
      │      encryptedResult: 0x8f2c...│
      │    )                            │
      ├───────────────────────────────▶│
      │                                │ 2. Store encrypted result
      │                                │    Status: Completed
      │                                │
      │                                │ 3. Emit ResultSubmitted event
      │                                │
      │ 4. Transaction confirmed       │
      │◀───────────────────────────────┤
      │                                │

┌─────────────────────────────────────────────────────────────────┐
│ PHASE 5: VERIFICATION & PAYMENT                                 │
└─────────────────────────────────────────────────────────────────┘

Client (Browser)                 Smart Contract                Worker
      │                                │                         │
      │ 1. Fetch encrypted result      │                         │
      │◀───────────────────────────────┤                         │
      │                                │                         │
      │ 2. Decrypt result              │                         │
      │    using client private key    │                         │
      │    Result: 30 ✅               │                         │
      │                                │                         │
      │ 3. verifyAndPay(jobId)         │                         │
      ├───────────────────────────────▶│                         │
      │                                │                         │
      │                                │ 4. Update status        │
      │                                │    Status: Verified     │
      │                                │                         │
      │                                │ 5. Transfer reward      │
      │                                │    to worker            │
      │                                ├────────────────────────▶│
      │                                │                         │
      │                                │ 6. Update worker stats  │
      │                                │    completedJobs++      │
      │                                │                         │
      │ 7. Transaction confirmed       │                         │
      │◀───────────────────────────────┤                         │
      │                                │                         │
```

---

## Smart Contract Architecture

### Contract Structure

```solidity
contract Obscura is Ownable, ReentrancyGuard {
    // Enums
    enum JobStatus { Pending, Assigned, Completed, Verified, Disputed, Cancelled }
    enum ComputationType { Addition, Multiplication, Comparison }
    
    // Structs
    struct Job {
        uint256 jobId;
        address client;
        address worker;
        ComputationType computationType;
        bytes encryptedInputs;
        bytes encryptedResult;
        uint256 reward;
        uint256 createdAt;
        uint256 completedAt;
        JobStatus status;
        bool resultDecrypted;
    }
    
    struct Worker {
        address workerAddress;
        string name;
        uint256 stake;
        uint256 completedJobs;
        uint256 reputation;
        bool isActive;
        uint256 registeredAt;
    }
    
    // State Variables
    uint256 public jobCounter;
    uint256 public constant MIN_WORKER_STAKE = 0.1 ether;
    uint256 public constant PLATFORM_FEE_PERCENT = 2;
    
    mapping(uint256 => Job) public jobs;
    mapping(address => Worker) public workers;
    mapping(address => uint256[]) public clientJobs;
    mapping(address => uint256[]) public workerJobs;
    
    // Functions
    function createJob(...) external payable returns (uint256)
    function claimJob(uint256 jobId) external
    function submitResult(uint256 jobId, bytes memory result) external
    function verifyAndPay(uint256 jobId) external
    function cancelJob(uint256 jobId) external
    function registerWorker(string memory name) external payable
    function deregisterWorker() external
}
```

### State Transitions

```
Job Lifecycle:
┌─────────┐  claimJob()   ┌──────────┐  submitResult()  ┌───────────┐
│ Pending ├──────────────▶│ Assigned ├─────────────────▶│ Completed │
└────┬────┘               └──────────┘                  └─────┬─────┘
     │                                                         │
     │ cancelJob()                                verifyAndPay()│
     │                                                         │
     ▼                                                         ▼
┌───────────┐                                          ┌──────────┐
│ Cancelled │                                          │ Verified │
└───────────┘                                          └──────────┘
```

---

## Frontend Architecture

### Component Hierarchy

```
App (page.tsx)
├── Providers (Wagmi + RainbowKit)
│   └── QueryClientProvider
│
├── Header
│   ├── Logo
│   └── ConnectButton (RainbowKit)
│
├── Hero
│   └── CreateJobButton
│
├── Stats
│   ├── TotalJobs
│   ├── ActiveWorkers
│   └── TotalRewards
│
├── TabNavigation
│   ├── FHETab
│   ├── PrivacyTab
│   ├── ClientTab
│   ├── WorkerTab
│   └── AnalyticsTab
│
├── TabContent
│   ├── FHEPlayground (interactive demo)
│   ├── PrivacyDashboard (privacy metrics)
│   ├── JobList (client jobs)
│   ├── WorkerDashboard (worker interface)
│   └── AdvancedAnalytics (charts & stats)
│
├── CreateJobModal
│   ├── ComputationTypeSelector
│   ├── InputFields
│   └── RewardInput
│
└── Footer
```

### State Management

```typescript
// useObscura Hook (main state management)
const useObscura = () => {
  // Blockchain connection
  const { address, isConnected } = useAccount();
  const provider = useWalletProvider();
  
  // State
  const [jobs, setJobs] = useState<Job[]>([]);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [isWorker, setIsWorker] = useState(false);
  const [workerInfo, setWorkerInfo] = useState<Worker | null>(null);
  
  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(fetchJobs, 10000);
    return () => clearInterval(interval);
  }, []);
  
  // Functions
  const createJob = async (...) => { ... };
  const registerWorker = async (...) => { ... };
  const claimJob = async (...) => { ... };
  
  return { jobs, myJobs, isWorker, workerInfo, createJob, ... };
};
```

---

## Worker Node Architecture

### Worker Components

```
Worker Node
├── Main (index.ts)
│   ├── Initialize provider
│   ├── Initialize wallet
│   ├── Initialize contract
│   └── Start listener
│
├── Listener (listener.ts)
│   ├── Subscribe to JobCreated events
│   ├── Filter pending jobs
│   ├── Claim jobs
│   └── Execute computations
│
├── Computation Engine (computations/engine.ts)
│   ├── Addition
│   ├── Multiplication
│   └── Comparison
│
└── Logger (utils/logger.ts)
    ├── Info logs
    ├── Error logs
    └── Debug logs
```

### Event Processing Flow

```typescript
// Listener.ts
class JobListener {
  async start() {
    // Subscribe to JobCreated events
    this.contract.on('JobCreated', async (jobId, client, type, reward) => {
      logger.info(`New job detected: ${jobId}`);
      
      // Fetch job details
      const job = await this.contract.getJob(jobId);
      
      // Check if job is still pending
      if (job.status === JobStatus.Pending) {
        await this.claimJob(jobId);
      }
    });
  }
  
  async claimJob(jobId: number) {
    // Claim the job
    const tx = await this.contract.claimJob(jobId);
    await tx.wait();
    
    // Execute computation
    await this.executeJob(jobId);
  }
  
  async executeJob(jobId: number) {
    // Fetch job
    const job = await this.contract.getJob(jobId);
    
    // Execute FHE computation
    const result = await this.computationEngine.execute(
      job.computationType,
      job.encryptedInputs
    );
    
    // Submit result
    const tx = await this.contract.submitResult(jobId, result);
    await tx.wait();
    
    logger.info(`✅ Job ${jobId} completed`);
  }
}
```

---

## Security Model

### Threat Model

**Threats:**
1. Malicious workers trying to see plaintext data
2. Clients refusing to pay after receiving results
3. Workers submitting incorrect results
4. Reentrancy attacks on payment functions
5. Front-running job claims

**Mitigations:**
1. ✅ FHE ensures workers never see plaintext
2. ✅ Escrow system holds funds until verification
3. ✅ Reputation system tracks worker reliability
4. ✅ ReentrancyGuard on all payment functions
5. ✅ First-come-first-served job claiming

### Privacy Guarantees

```
Data Privacy Layers:

Layer 1: Client-Side Encryption
├─ Data encrypted in browser
├─ Private key never leaves client
└─ Encrypted data sent to contract

Layer 2: On-Chain Storage
├─ Only encrypted data stored
├─ No plaintext on blockchain
└─ Public can see encrypted bytes

Layer 3: Worker Computation
├─ FHE computation on encrypted data
├─ Worker never sees plaintext
└─ Result remains encrypted

Layer 4: Client-Side Decryption
├─ Client fetches encrypted result
├─ Decrypts with private key
└─ Plaintext only visible to client
```

---

## Scalability Considerations

### Current Limitations

- **Gas Costs**: On-chain storage of encrypted data is expensive
- **Computation Time**: FHE operations are slower than plaintext
- **Worker Availability**: Limited number of workers
- **Network Congestion**: Sepolia testnet can be slow

### Future Optimizations

1. **Batch Processing**: Process multiple jobs in one transaction
2. **Off-Chain Storage**: Store encrypted data on IPFS, only hash on-chain
3. **Layer 2**: Deploy on Optimism/Arbitrum for lower gas costs
4. **Worker Pools**: Implement worker pools for load balancing
5. **Caching**: Cache frequently used computations

---

## Conclusion

Obscura's architecture is designed for:
- **Privacy**: FHE ensures data never leaves encrypted form
- **Security**: Multiple layers of protection
- **Usability**: Simple UI abstracts complexity
- **Scalability**: Modular design allows future improvements

For more details, see:
- [API Reference](./API.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [User Guide](./USER_GUIDE.md)

