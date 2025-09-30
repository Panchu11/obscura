import { ethers } from 'ethers';

export const OBSCURA_ADDRESS = process.env.NEXT_PUBLIC_OBSCURA_CONTRACT_ADDRESS || '0x37F563b87B48bBcb12497A0a824542CafBC06d1F';

export const OBSCURA_ABI = [
  // Events
  'event JobCreated(uint256 indexed jobId, address indexed client, uint8 computationType, uint256 reward)',
  'event JobAssigned(uint256 indexed jobId, address indexed worker)',
  'event ResultSubmitted(uint256 indexed jobId, address indexed worker, bytes encryptedResult)',
  'event JobCompleted(uint256 indexed jobId, address indexed worker, uint256 payment)',
  'event JobCancelled(uint256 indexed jobId, address indexed client)',
  'event WorkerRegistered(address indexed worker, string name, uint256 stake)',
  'event WorkerDeregistered(address indexed worker)',
  
  // Read functions
  'function getJob(uint256 jobId) external view returns (tuple(uint256 jobId, address client, address worker, uint8 computationType, bytes encryptedInputs, bytes encryptedResult, uint256 reward, uint256 createdAt, uint256 completedAt, uint8 status, bool resultDecrypted))',
  'function getClientJobs(address client) external view returns (uint256[])',
  'function getWorkerJobs(address worker) external view returns (uint256[])',
  'function getAllWorkers() external view returns (address[])',
  'function getWorker(address worker) external view returns (tuple(address workerAddress, string name, uint256 stake, uint256 completedJobs, uint256 reputation, bool isActive, uint256 registeredAt))',
  'function jobCounter() external view returns (uint256)',
  'function workers(address) external view returns (address workerAddress, string name, uint256 stake, uint256 completedJobs, uint256 reputation, bool isActive, uint256 registeredAt)',
  
  // Write functions
  'function createJob(uint8 computationType, bytes memory encryptedInputs) external payable returns (uint256)',
  'function claimJob(uint256 jobId) external',
  'function submitResult(uint256 jobId, bytes memory encryptedResult) external',
  'function verifyAndPay(uint256 jobId) external',
  'function cancelJob(uint256 jobId) external',
  'function registerWorker(string memory name) external payable',
  'function deregisterWorker() external',
];

export enum JobStatus {
  Pending = 0,
  Assigned = 1,
  Completed = 2,
  Verified = 3,
  Disputed = 4,
  Cancelled = 5,
}

export enum ComputationType {
  SUM = 0,
  AVERAGE = 1,
  MAX = 2,
  MIN = 3,
  LINEAR_REGRESSION = 4,
  DECISION_TREE = 5,
}

export const COMPUTATION_TYPE_NAMES: Record<ComputationType, string> = {
  [ComputationType.SUM]: 'Encrypted Sum',
  [ComputationType.AVERAGE]: 'Encrypted Average',
  [ComputationType.MAX]: 'Encrypted Maximum',
  [ComputationType.MIN]: 'Encrypted Minimum',
  [ComputationType.LINEAR_REGRESSION]: 'Linear Regression',
  [ComputationType.DECISION_TREE]: 'Decision Tree Inference',
};

export const JOB_STATUS_NAMES: Record<JobStatus, string> = {
  [JobStatus.Pending]: 'Pending',
  [JobStatus.Assigned]: 'Assigned',
  [JobStatus.Completed]: 'Completed',
  [JobStatus.Verified]: 'Verified',
  [JobStatus.Disputed]: 'Disputed',
  [JobStatus.Cancelled]: 'Cancelled',
};

