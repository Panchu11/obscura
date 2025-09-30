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

export interface Job {
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

export interface Worker {
  workerAddress: string;
  name: string;
  stake: string;
  completedJobs: number;
  reputation: number;
  isActive: boolean;
  registeredAt: number;
}

export interface ComputationResult {
  success: boolean;
  encryptedResult?: string;
  error?: string;
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

