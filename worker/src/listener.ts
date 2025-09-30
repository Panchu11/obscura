import { ethers } from 'ethers';
import { logger } from './utils/logger';
import { ComputationEngine } from './computations/engine';

const OBSCURA_ABI = [
  'event JobCreated(uint256 indexed jobId, address indexed client, uint8 computationType, uint256 reward)',
  'event JobAssigned(uint256 indexed jobId, address indexed worker)',
  'function claimJob(uint256 jobId) external',
  'function submitResult(uint256 jobId, bytes memory encryptedResult) external',
  'function getJob(uint256 jobId) external view returns (tuple(uint256 jobId, address client, address worker, uint8 computationType, bytes encryptedInputs, bytes encryptedResult, uint256 reward, uint256 createdAt, uint256 completedAt, uint8 status, bool resultDecrypted))',
];

export class JobListener {
  private contract: ethers.Contract;
  private isListening: boolean = false;

  constructor(
    private provider: ethers.JsonRpcProvider,
    private wallet: ethers.Wallet,
    private contractAddress: string,
    private engine: ComputationEngine
  ) {
    this.contract = new ethers.Contract(contractAddress, OBSCURA_ABI, wallet);
  }

  async start() {
    if (this.isListening) {
      logger.warn('Already listening for jobs');
      return;
    }

    this.isListening = true;
    logger.info('Starting to listen for job events...');

    // Listen for JobCreated events
    this.contract.on('JobCreated', async (jobId, client, computationType, reward, event) => {
      logger.info('New job detected', {
        jobId: jobId.toString(),
        client,
        computationType,
        reward: ethers.formatEther(reward),
      });

      await this.handleNewJob(jobId);
    });

    // Also check for existing pending jobs
    await this.checkPendingJobs();
  }

  async stop() {
    if (!this.isListening) {
      return;
    }

    this.isListening = false;
    this.contract.removeAllListeners();
    logger.info('Stopped listening for jobs');
  }

  private async handleNewJob(jobId: bigint) {
    try {
      logger.info(`Attempting to claim job ${jobId}`);

      // Claim the job
      const tx = await this.contract.claimJob(jobId);
      logger.info(`Claim transaction sent: ${tx.hash}`);

      await tx.wait();
      logger.info(`Successfully claimed job ${jobId}`);

      // Execute the computation
      await this.executeJob(jobId);
    } catch (error: any) {
      if (error.message?.includes('Job already claimed')) {
        logger.warn(`Job ${jobId} was already claimed by another worker`);
      } else {
        logger.error(`Failed to claim job ${jobId}:`, error);
      }
    }
  }

  private async executeJob(jobId: bigint) {
    try {
      logger.info(`Executing job ${jobId}`);

      // Get job details
      const job = await this.contract.getJob(jobId);
      logger.info('Job details retrieved', {
        jobId: job.jobId.toString(),
        computationType: job.computationType,
        inputsLength: job.encryptedInputs.length,
      });

      // Execute computation
      const result = await this.engine.execute(
        job.computationType,
        job.encryptedInputs
      );

      logger.info(`Computation completed for job ${jobId}`);

      // Submit result
      const tx = await this.contract.submitResult(jobId, result);
      logger.info(`Result submission transaction sent: ${tx.hash}`);

      await tx.wait();
      logger.info(`✅ Successfully submitted result for job ${jobId}`);
    } catch (error) {
      logger.error(`Failed to execute job ${jobId}:`, error);
    }
  }

  private async checkPendingJobs() {
    // TODO: Implement logic to check for existing pending jobs
    // This would query the contract for jobs with status = Pending
    logger.info('Checking for existing pending jobs...');
  }
}

