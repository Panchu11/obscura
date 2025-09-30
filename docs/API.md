# 📚 Obscura API Reference

## Table of Contents

- [Smart Contract API](#smart-contract-api)
- [Frontend Hooks API](#frontend-hooks-api)
- [Worker Node API](#worker-node-api)
- [Events](#events)
- [Types & Enums](#types--enums)
- [Error Codes](#error-codes)

---

## Smart Contract API

### Contract Address

**Sepolia Testnet:** `0x37F563b87B48bBcb12497A0a824542CafBC06d1F`

### Job Management Functions

#### createJob

Creates a new computation job.

```solidity
function createJob(
    uint8 computationType,
    bytes memory encryptedInputs
) external payable returns (uint256 jobId)
```

**Parameters:**
- `computationType` (uint8): Type of computation (0=Addition, 1=Multiplication, 2=Comparison)
- `encryptedInputs` (bytes): Encrypted input data

**Returns:**
- `jobId` (uint256): Unique identifier for the created job

**Requirements:**
- `msg.value` must be > 0 (job reward + platform fee)
- Platform fee (2%) is deducted from msg.value

**Events Emitted:**
- `JobCreated(jobId, client, computationType, reward)`

**Example:**
```typescript
const tx = await contract.createJob(
    0, // Addition
    encryptedInputs,
    { value: ethers.parseEther('0.001') }
);
const receipt = await tx.wait();
const jobId = receipt.logs[0].args.jobId;
```

---

#### claimJob

Worker claims a pending job.

```solidity
function claimJob(uint256 jobId) external
```

**Parameters:**
- `jobId` (uint256): ID of the job to claim

**Requirements:**
- Caller must be a registered, active worker
- Job must exist and be in Pending status
- Job must not already have a worker assigned

**Events Emitted:**
- `JobAssigned(jobId, worker)`

**Example:**
```typescript
const tx = await contract.claimJob(1);
await tx.wait();
```

---

#### submitResult

Worker submits the computation result.

```solidity
function submitResult(
    uint256 jobId,
    bytes memory encryptedResult
) external
```

**Parameters:**
- `jobId` (uint256): ID of the job
- `encryptedResult` (bytes): Encrypted computation result

**Requirements:**
- Caller must be the assigned worker
- Job must be in Assigned status

**Events Emitted:**
- `ResultSubmitted(jobId, worker, encryptedResult)`

**Example:**
```typescript
const tx = await contract.submitResult(1, encryptedResult);
await tx.wait();
```

---

#### verifyAndPay

Client verifies the result and releases payment to worker.

```solidity
function verifyAndPay(uint256 jobId) external
```

**Parameters:**
- `jobId` (uint256): ID of the job

**Requirements:**
- Caller must be the job client
- Job must be in Completed status
- Uses ReentrancyGuard for security

**Events Emitted:**
- `JobCompleted(jobId, worker, reward)`

**Example:**
```typescript
const tx = await contract.verifyAndPay(1);
await tx.wait();
```

---

#### cancelJob

Client cancels a pending job and receives refund.

```solidity
function cancelJob(uint256 jobId) external
```

**Parameters:**
- `jobId` (uint256): ID of the job to cancel

**Requirements:**
- Caller must be the job client
- Job must be in Pending status
- Uses ReentrancyGuard for security

**Events Emitted:**
- `JobCancelled(jobId, client)`

**Example:**
```typescript
const tx = await contract.cancelJob(1);
await tx.wait();
```

---

### Worker Management Functions

#### registerWorker

Register as a worker by staking ETH.

```solidity
function registerWorker(string memory name) external payable
```

**Parameters:**
- `name` (string): Worker name/identifier

**Requirements:**
- Caller must not already be registered
- `msg.value` must be >= MIN_WORKER_STAKE (0.1 ETH)

**Events Emitted:**
- `WorkerRegistered(worker, name, stake)`

**Example:**
```typescript
const tx = await contract.registerWorker('My Worker', {
    value: ethers.parseEther('0.1')
});
await tx.wait();
```

---

#### deregisterWorker

Deregister as a worker and withdraw stake.

```solidity
function deregisterWorker() external
```

**Requirements:**
- Caller must be a registered, active worker
- Worker must have stake > 0
- Uses ReentrancyGuard for security

**Events Emitted:**
- `WorkerDeregistered(worker)`

**Example:**
```typescript
const tx = await contract.deregisterWorker();
await tx.wait();
```

---

### View Functions

#### getJob

Get job details.

```solidity
function getJob(uint256 jobId) 
    external view returns (Job memory)
```

**Parameters:**
- `jobId` (uint256): ID of the job

**Returns:**
- `Job` struct with all job details

**Example:**
```typescript
const job = await contract.getJob(1);
console.log(job.status); // 0 = Pending, 1 = Assigned, etc.
```

---

#### getWorker

Get worker information.

```solidity
function getWorker(address workerAddress) 
    external view returns (Worker memory)
```

**Parameters:**
- `workerAddress` (address): Address of the worker

**Returns:**
- `Worker` struct with worker details

**Example:**
```typescript
const worker = await contract.getWorker('0x742d...');
console.log(worker.reputation); // 0-100
```

---

#### getClientJobs

Get all jobs created by a client.

```solidity
function getClientJobs(address client) 
    external view returns (uint256[] memory)
```

**Parameters:**
- `client` (address): Address of the client

**Returns:**
- Array of job IDs

**Example:**
```typescript
const jobIds = await contract.getClientJobs(address);
```

---

#### getWorkerJobs

Get all jobs assigned to a worker.

```solidity
function getWorkerJobs(address worker) 
    external view returns (uint256[] memory)
```

**Parameters:**
- `worker` (address): Address of the worker

**Returns:**
- Array of job IDs

**Example:**
```typescript
const jobIds = await contract.getWorkerJobs(workerAddress);
```

---

#### getAllWorkers

Get all registered workers.

```solidity
function getAllWorkers() 
    external view returns (address[] memory)
```

**Returns:**
- Array of worker addresses

**Example:**
```typescript
const workers = await contract.getAllWorkers();
```

---

## Frontend Hooks API

### useObscura Hook

Main React hook for interacting with Obscura.

```typescript
const {
  jobs,
  myJobs,
  isWorker,
  workerInfo,
  loading,
  createJob,
  registerWorker,
  claimJob,
  verifyAndPay,
  cancelJob,
  refreshJobs
} = useObscura();
```

#### State

**jobs** (Job[]): All jobs in the system
**myJobs** (Job[]): Jobs created by connected wallet
**isWorker** (boolean): Is connected wallet a registered worker
**workerInfo** (Worker | null): Worker information if registered
**loading** (boolean): Loading state

#### Functions

**createJob**
```typescript
async function createJob(
  computationType: ComputationType,
  number1: string,
  number2: string,
  reward: string
): Promise<string>
```

**registerWorker**
```typescript
async function registerWorker(
  name: string,
  stake: string
): Promise<string>
```

**claimJob**
```typescript
async function claimJob(
  jobId: string
): Promise<string>
```

**verifyAndPay**
```typescript
async function verifyAndPay(
  jobId: string
): Promise<string>
```

**cancelJob**
```typescript
async function cancelJob(
  jobId: string
): Promise<string>
```

**refreshJobs**
```typescript
async function refreshJobs(): Promise<void>
```

---

## Worker Node API

### ObscuraWorker Class

```typescript
class ObscuraWorker {
  constructor()
  async start(): Promise<void>
  async stop(): Promise<void>
}
```

### JobListener Class

```typescript
class JobListener {
  constructor(contract: Contract, wallet: Wallet)
  async start(): Promise<void>
  async stop(): Promise<void>
  private async handleJobCreated(jobId, client, type, reward): Promise<void>
  private async claimJob(jobId: number): Promise<void>
  private async executeJob(jobId: number): Promise<void>
}
```

---

## Events

### JobCreated

Emitted when a new job is created.

```solidity
event JobCreated(
    uint256 indexed jobId,
    address indexed client,
    ComputationType computationType,
    uint256 reward
);
```

### JobAssigned

Emitted when a worker claims a job.

```solidity
event JobAssigned(
    uint256 indexed jobId,
    address indexed worker
);
```

### ResultSubmitted

Emitted when a worker submits a result.

```solidity
event ResultSubmitted(
    uint256 indexed jobId,
    address indexed worker,
    bytes encryptedResult
);
```

### JobCompleted

Emitted when a client verifies and pays.

```solidity
event JobCompleted(
    uint256 indexed jobId,
    address indexed worker,
    uint256 reward
);
```

### JobCancelled

Emitted when a client cancels a job.

```solidity
event JobCancelled(
    uint256 indexed jobId,
    address indexed client
);
```

### WorkerRegistered

Emitted when a worker registers.

```solidity
event WorkerRegistered(
    address indexed worker,
    string name,
    uint256 stake
);
```

### WorkerDeregistered

Emitted when a worker deregisters.

```solidity
event WorkerDeregistered(
    address indexed worker
);
```

---

## Types & Enums

### JobStatus

```typescript
enum JobStatus {
  Pending = 0,
  Assigned = 1,
  Completed = 2,
  Verified = 3,
  Disputed = 4,
  Cancelled = 5
}
```

### ComputationType

```typescript
enum ComputationType {
  Addition = 0,
  Multiplication = 1,
  Comparison = 2
}
```

### Job Struct

```typescript
interface Job {
  jobId: string;
  client: string;
  worker: string;
  computationType: ComputationType;
  encryptedInputs: string;
  encryptedResult: string;
  reward: string;
  createdAt: number;
  completedAt: number;
  status: JobStatus;
  resultDecrypted: boolean;
}
```

### Worker Struct

```typescript
interface Worker {
  workerAddress: string;
  name: string;
  stake: string;
  completedJobs: number;
  reputation: number;
  isActive: boolean;
  registeredAt: number;
}
```

---

## Error Codes

### Smart Contract Errors

- `"Already registered"` - Worker is already registered
- `"Insufficient stake"` - Stake amount < MIN_WORKER_STAKE
- `"Not your job"` - Caller is not the job client
- `"Job not available"` - Job is not in Pending status
- `"Job already claimed"` - Job already has a worker assigned
- `"Job not completed"` - Job is not in Completed status
- `"Cannot cancel"` - Job is not in Pending status
- `"Payment failed"` - ETH transfer to worker failed
- `"Refund failed"` - ETH refund to client failed

### Frontend Errors

- `"Please connect wallet"` - Wallet not connected
- `"Please switch to Sepolia"` - Wrong network
- `"Insufficient balance"` - Not enough ETH for transaction
- `"Transaction rejected"` - User rejected transaction in wallet
- `"Invalid input"` - Invalid form input

---

## Rate Limits

- **Job Creation**: No limit (gas costs provide natural rate limiting)
- **Job Claiming**: No limit
- **Frontend Polling**: Every 10 seconds
- **Worker Event Listening**: Real-time (no polling)

---

## Gas Estimates

| Function | Estimated Gas |
|----------|---------------|
| createJob | ~150,000 |
| claimJob | ~80,000 |
| submitResult | ~100,000 |
| verifyAndPay | ~120,000 |
| cancelJob | ~90,000 |
| registerWorker | ~150,000 |
| deregisterWorker | ~80,000 |

*Note: Actual gas usage may vary based on network conditions and input data size.*

---

For more information, see:
- [Architecture Documentation](./ARCHITECTURE.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [User Guide](./USER_GUIDE.md)

