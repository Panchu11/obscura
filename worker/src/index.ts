import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import * as http from 'http';
import { logger } from './utils/logger';
import { JobListener } from './listener';
import { ComputationEngine } from './computations/engine';

dotenv.config();

class ObscuraWorker {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contractAddress: string;
  private listener: JobListener;
  private engine: ComputationEngine;

  constructor() {
    // Initialize provider
    const rpcUrl = process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_KEY';
    this.provider = new ethers.JsonRpcProvider(rpcUrl);

    // Initialize wallet
    const privateKey = process.env.WORKER_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('WORKER_PRIVATE_KEY not set in environment');
    }
    this.wallet = new ethers.Wallet(privateKey, this.provider);

    // Get contract address
    this.contractAddress = process.env.OBSCURA_CONTRACT_ADDRESS || '';
    if (!this.contractAddress) {
      throw new Error('OBSCURA_CONTRACT_ADDRESS not set in environment');
    }

    // Initialize computation engine
    this.engine = new ComputationEngine();

    // Initialize job listener
    this.listener = new JobListener(
      this.provider,
      this.wallet,
      this.contractAddress,
      this.engine
    );

    logger.info('Obscura Worker initialized', {
      workerAddress: this.wallet.address,
      contractAddress: this.contractAddress,
    });
  }

  async start() {
    try {
      logger.info('Starting Obscura Worker...');

      // Check balance
      const balance = await this.provider.getBalance(this.wallet.address);
      logger.info(`Worker balance: ${ethers.formatEther(balance)} ETH`);

      if (balance === 0n) {
        logger.warn('Worker has no ETH balance. Please fund the wallet.');
      }

      // Start HTTP health check server for Render
      this.startHealthCheckServer();

      // Start listening for jobs
      await this.listener.start();

      logger.info('✅ Obscura Worker is running and listening for jobs');
    } catch (error) {
      logger.error('Failed to start worker:', error);
      throw error;
    }
  }

  private startHealthCheckServer() {
    const PORT = process.env.PORT || 3000;

    const server = http.createServer((req, res) => {
      if (req.url === '/health' || req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'healthy',
          worker: this.wallet.address,
          contract: this.contractAddress,
          timestamp: new Date().toISOString()
        }));
      } else {
        res.writeHead(404);
        res.end('Not Found');
      }
    });

    server.listen(PORT, () => {
      logger.info(`Health check server listening on port ${PORT}`);
    });
  }

  async stop() {
    logger.info('Stopping Obscura Worker...');
    await this.listener.stop();
    logger.info('Worker stopped');
  }
}

// Main execution
async function main() {
  const worker = new ObscuraWorker();

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    logger.info('Received SIGINT signal');
    await worker.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    logger.info('Received SIGTERM signal');
    await worker.stop();
    process.exit(0);
  });

  // Start worker
  await worker.start();
}

// Run if this is the main module
if (require.main === module) {
  main().catch((error) => {
    logger.error('Fatal error:', error);
    process.exit(1);
  });
}

export { ObscuraWorker };

