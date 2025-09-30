# 🏗️ Obscura Architecture (Summary)

> **Note**: For detailed architecture documentation, see [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

## Quick Overview

Obscura is a decentralized marketplace for Fully Homomorphic Encrypted (FHE) computation. The system enables clients to submit encrypted computation jobs that workers execute without ever seeing the plaintext data.

## System Components

### 1. Smart Contracts (Sepolia Testnet)

**Obscura.sol** - Main marketplace contract
- Job creation and management
- Worker registration with stake requirements (0.1 ETH minimum)
- Escrow and payment handling
- Result submission and verification
- Platform fee collection (2%)
- Reputation system (0-100 score)

**Contract Address**: `0x37F563b87B48bBcb12497A0a824542CafBC06d1F`

### 2. Frontend (Next.js 14 + React)

**Technology Stack:**
- Next.js 14 with App Router
- TypeScript for type safety
- TailwindCSS for styling
- RainbowKit for wallet connection
- Wagmi for Ethereum interactions
- Framer Motion for animations
- React Hot Toast for notifications

**Key Features:**
- Client dashboard for job creation and monitoring
- Worker dashboard for claiming and executing jobs
- Real-time job status updates
- Encrypted data submission interface
- Result decryption interface
- Wallet integration (MetaMask, WalletConnect, etc.)

### 3. Worker Nodes (TypeScript/Node.js)

**Responsibilities:**
- Listen for new job events from smart contract
- Automatically claim available jobs
- Execute FHE computations
- Submit encrypted results back to contract
- Maintain uptime and reputation

**Computation Types Supported:**
1. **Encrypted Sum** - Add encrypted values
2. **Encrypted Average** - Calculate mean of encrypted dataset
3. **Encrypted Max** - Find maximum value
4. **Encrypted Min** - Find minimum value
5. **Linear Regression** - Train model on encrypted data
6. **Decision Tree** - Inference on encrypted inputs

### 4. Shared Types

Common TypeScript types and interfaces used across all components for consistency.

## Data Flow

### Job Creation Flow

```
1. Client encrypts data using FHE
   ↓
2. Client creates job on smart contract with encrypted inputs
   ↓
3. Smart contract emits JobCreated event
   ↓
4. Worker nodes listen for event
   ↓
5. First worker to claim gets the job
   ↓
6. Smart contract emits JobAssigned event
```

### Computation Flow

```
1. Worker retrieves encrypted inputs from contract
   ↓
2. Worker performs FHE computation
   ↓
3. Worker submits encrypted result to contract
   ↓
4. Smart contract emits ResultSubmitted event
   ↓
5. Client retrieves encrypted result
   ↓
6. Client decrypts result using their private key
   ↓
7. Client verifies and releases payment
```

## Security Model

### Encryption
- All sensitive data is encrypted using Zama's FHE scheme
- Workers never have access to plaintext data
- Only the client can decrypt results using their private key

### Economic Security
- Workers must stake ETH to participate
- Stake can be slashed for malicious behavior (future feature)
- Reputation system incentivizes honest behavior
- Escrow ensures fair payment

### Smart Contract Security
- ReentrancyGuard on all payment functions
- Access control using OpenZeppelin's Ownable
- Input validation on all public functions
- Event emission for transparency

## Scalability Considerations

### Current Design
- Single contract deployment
- Sequential job processing per worker
- On-chain result storage

### Future Improvements
- Multi-contract sharding for parallel processing
- Off-chain result storage with on-chain commitments
- Worker pools for load balancing
- Optimistic verification with dispute resolution

## FHE Integration

### Zama FHEVM Features Used
- **TFHE.sol** - Core FHE operations library
- **GatewayCaller** - Interface for FHE gateway
- **Encrypted types** - euint8, euint16, euint32, etc.

### Computation Patterns
1. **Homomorphic Addition** - For sum and average
2. **Homomorphic Comparison** - For max/min
3. **Encrypted Matrix Operations** - For linear regression
4. **Encrypted Branching** - For decision trees

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Sepolia Testnet                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Obscura Smart Contract                   │  │
│  │  - Job Management                                │  │
│  │  - Worker Registry                               │  │
│  │  - Payment Escrow                                │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ▲
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Worker 1   │  │   Worker 2   │  │   Worker N   │
│  (Node.js)   │  │  (Node.js)   │  │  (Node.js)   │
└──────────────┘  └──────────────┘  └──────────────┘
        ▲
        │
        │ (WebSocket/HTTP)
        │
        ▼
┌─────────────────────────────────────────────────────────┐
│              Frontend (Next.js)                         │
│  - Client Interface                                     │
│  - Worker Dashboard                                     │
│  - Wallet Integration                                   │
└─────────────────────────────────────────────────────────┘
```

## Development Workflow

### Local Development
1. Start local Hardhat node
2. Deploy contracts locally
3. Start worker nodes
4. Start frontend dev server
5. Connect wallet to local network

### Testnet Deployment
1. Deploy contracts to Sepolia
2. Verify contracts on Etherscan
3. Update .env with contract addresses
4. Deploy worker nodes to cloud (AWS/GCP/Azure)
5. Deploy frontend to Vercel/Netlify

## Monitoring and Logging

### Worker Logs
- Winston logger with multiple transports
- File logging (error.log, combined.log)
- Console logging with colors
- Structured JSON logs for parsing

### Contract Events
- JobCreated
- JobAssigned
- ResultSubmitted
- JobCompleted
- WorkerRegistered
- WorkerDeregistered

## Testing Strategy

### Smart Contract Tests
- Unit tests for all functions
- Integration tests for full workflows
- Gas optimization tests
- Security audit tests

### Frontend Tests
- Component unit tests
- Integration tests with mock contracts
- E2E tests with Playwright

### Worker Tests
- Computation accuracy tests
- Event listener tests
- Error handling tests

## Future Enhancements

1. **Multi-party Computation** - Allow multiple workers to verify results
2. **Dispute Resolution** - On-chain arbitration for disputed results
3. **Advanced Computations** - Neural network inference, encrypted search
4. **Cross-chain Support** - Deploy to multiple EVM chains
5. **Decentralized Storage** - IPFS for large encrypted datasets
6. **Worker Incentives** - Token rewards for high-reputation workers
7. **Client SDK** - Easy-to-use library for job submission
8. **Mobile App** - React Native app for mobile access

## Resources

- [Zama Documentation](https://docs.zama.ai/)
- [FHEVM GitHub](https://github.com/zama-ai/fhevm)
- [Concrete ML](https://github.com/zama-ai/concrete-ml)
- [Zama Developer Program](https://www.zama.ai/programs/developer-program)

