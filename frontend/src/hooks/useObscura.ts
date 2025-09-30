import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { OBSCURA_ADDRESS, OBSCURA_ABI, JobStatus, ComputationType } from '@/lib/contracts';

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

export function useObscura() {
  const { address, isConnected } = useAccount();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [isWorker, setIsWorker] = useState(false);
  const [workerInfo, setWorkerInfo] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(false);

  // Get wallet provider (supports MetaMask, Rabby, Leap, etc.)
  const getWalletProvider = () => {
    if (typeof window === 'undefined') return null;

    // Check for various wallet providers
    const win = window as any;

    // Try different provider locations
    if (win.ethereum) {
      return win.ethereum;
    }

    if (win.leap?.ethereum) {
      return win.leap.ethereum;
    }

    if (win.keplr?.ethereum) {
      return win.keplr.ethereum;
    }

    return null;
  };

  // Get contract instance using browser provider
  const getContract = async () => {
    if (typeof window === 'undefined') return null;

    try {
      const ethereum = getWalletProvider();
      if (!ethereum) return null;

      const provider = new ethers.BrowserProvider(ethereum);
      return new ethers.Contract(OBSCURA_ADDRESS, OBSCURA_ABI, provider);
    } catch (error) {
      return null;
    }
  };

  // Get signer contract
  const getSignerContract = async () => {
    if (typeof window === 'undefined') return null;

    try {
      const ethereum = getWalletProvider();
      if (!ethereum) {
        throw new Error('Please connect your wallet');
      }

      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      return new ethers.Contract(OBSCURA_ADDRESS, OBSCURA_ABI, signer);
    } catch (error: any) {
      if (error.message?.includes('connect')) {
        throw error;
      }
      throw new Error('Please connect your wallet');
    }
  };

  // Fetch all jobs
  const fetchJobs = async () => {
    if (!isConnected) return;

    try {
      const contract = await getContract();
      if (!contract) return;

      const jobCounter = await contract.jobCounter();
      const jobPromises = [];

      for (let i = 0; i < Number(jobCounter); i++) {
        jobPromises.push(contract.getJob(i));
      }

      const jobsData = await Promise.all(jobPromises);

      const formattedJobs: Job[] = jobsData.map((job: any) => ({
        jobId: job.jobId.toString(),
        client: job.client,
        worker: job.worker,
        computationType: Number(job.computationType),
        encryptedInputs: job.encryptedInputs,
        encryptedResult: job.encryptedResult,
        reward: ethers.formatEther(job.reward),
        createdAt: Number(job.createdAt),
        completedAt: Number(job.completedAt),
        status: Number(job.status),
        resultDecrypted: job.resultDecrypted,
      }));

      setJobs(formattedJobs);

      // Filter my jobs
      if (address) {
        const myJobsFiltered = formattedJobs.filter(
          (job) => job.client.toLowerCase() === address.toLowerCase()
        );
        setMyJobs(myJobsFiltered);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  // Fetch worker info
  const fetchWorkerInfo = async () => {
    if (!address || !isConnected) return;

    try {
      const contract = await getContract();
      if (!contract) return;

      const worker = await contract.getWorker(address);

      if (worker.isActive) {
        setIsWorker(true);
        setWorkerInfo({
          workerAddress: worker.workerAddress,
          name: worker.name,
          stake: ethers.formatEther(worker.stake),
          completedJobs: Number(worker.completedJobs),
          reputation: Number(worker.reputation),
          isActive: worker.isActive,
          registeredAt: Number(worker.registeredAt),
        });
      } else {
        setIsWorker(false);
        setWorkerInfo(null);
      }
    } catch (error) {
      console.error('Error fetching worker info:', error);
    }
  };

  // Create job
  const createJob = async (
    computationType: ComputationType,
    inputData: string,
    reward: string
  ) => {
    try {
      setLoading(true);

      const contract = await getSignerContract();
      if (!contract) throw new Error('Please connect your wallet');

      const rewardWei = ethers.parseEther(reward);

      const tx = await contract.createJob(computationType, inputData, {
        value: rewardWei,
      });

      await tx.wait();
      await fetchJobs();

      return tx.hash;
    } catch (error: any) {
      // Simple error handling
      if (error.code === 'INSUFFICIENT_FUNDS') {
        throw new Error('Insufficient ETH balance');
      }
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        throw new Error('Transaction rejected');
      }
      if (error.message?.includes('connect')) {
        throw new Error('Please connect your wallet');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register as worker
  const registerWorker = async (name: string, stake: string) => {
    try {
      setLoading(true);
      const contract = await getSignerContract();
      if (!contract) throw new Error('Please connect your wallet');

      const stakeWei = ethers.parseEther(stake);
      const tx = await contract.registerWorker(name, { value: stakeWei });

      await tx.wait();
      await fetchWorkerInfo();

      return tx.hash;
    } catch (error: any) {
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        throw new Error('Transaction rejected');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Claim job
  const claimJob = async (jobId: string) => {
    try {
      setLoading(true);
      const contract = await getSignerContract();
      if (!contract) throw new Error('Please connect your wallet');

      const tx = await contract.claimJob(jobId);
      await tx.wait();
      await fetchJobs();

      return tx.hash;
    } catch (error: any) {
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        throw new Error('Transaction rejected');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Verify and pay
  const verifyAndPay = async (jobId: string) => {
    try {
      setLoading(true);
      const contract = await getSignerContract();
      if (!contract) throw new Error('Please connect your wallet');

      const tx = await contract.verifyAndPay(jobId);
      await tx.wait();
      await fetchJobs();
      
      return tx.hash;
    } catch (error: any) {
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        throw new Error('Transaction rejected');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Cancel job
  const cancelJob = async (jobId: string) => {
    try {
      setLoading(true);
      const contract = await getSignerContract();
      if (!contract) throw new Error('Please connect your wallet');

      const tx = await contract.cancelJob(jobId);
      await tx.wait();
      await fetchJobs();

      return tx.hash;
    } catch (error: any) {
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        throw new Error('Transaction rejected');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (isConnected && address) {
      fetchJobs();
      fetchWorkerInfo();
    }
  }, [isConnected, address]);

  // Poll for updates every 10 seconds
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      fetchJobs();
      if (address) {
        fetchWorkerInfo();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isConnected, address]);

  return {
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
    refetch: fetchJobs,
  };
}

