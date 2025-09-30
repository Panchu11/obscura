import { expect } from "chai";
import { ethers } from "hardhat";
import { Obscura } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("Obscura", function () {
  let obscura: Obscura;
  let owner: SignerWithAddress;
  let client: SignerWithAddress;
  let worker: SignerWithAddress;
  let worker2: SignerWithAddress;

  const MIN_STAKE = ethers.parseEther("0.1");
  const JOB_REWARD = ethers.parseEther("0.05");

  beforeEach(async function () {
    [owner, client, worker, worker2] = await ethers.getSigners();

    const ObscuraFactory = await ethers.getContractFactory("Obscura");
    obscura = await ObscuraFactory.deploy();
    await obscura.waitForDeployment();
  });

  describe("Worker Registration", function () {
    it("Should allow worker registration with sufficient stake", async function () {
      await expect(
        obscura.connect(worker).registerWorker("Worker1", { value: MIN_STAKE })
      )
        .to.emit(obscura, "WorkerRegistered")
        .withArgs(worker.address, "Worker1", MIN_STAKE);

      const workerInfo = await obscura.getWorker(worker.address);
      expect(workerInfo.isActive).to.be.true;
      expect(workerInfo.stake).to.equal(MIN_STAKE);
      expect(workerInfo.reputation).to.equal(100);
    });

    it("Should reject registration with insufficient stake", async function () {
      const insufficientStake = ethers.parseEther("0.05");
      await expect(
        obscura.connect(worker).registerWorker("Worker1", { value: insufficientStake })
      ).to.be.revertedWith("Insufficient stake");
    });

    it("Should prevent double registration", async function () {
      await obscura.connect(worker).registerWorker("Worker1", { value: MIN_STAKE });
      
      await expect(
        obscura.connect(worker).registerWorker("Worker1", { value: MIN_STAKE })
      ).to.be.revertedWith("Already registered");
    });

    it("Should allow worker deregistration and stake withdrawal", async function () {
      await obscura.connect(worker).registerWorker("Worker1", { value: MIN_STAKE });
      
      const balanceBefore = await ethers.provider.getBalance(worker.address);
      const tx = await obscura.connect(worker).deregisterWorker();
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;
      const balanceAfter = await ethers.provider.getBalance(worker.address);

      expect(balanceAfter).to.equal(balanceBefore + MIN_STAKE - gasUsed);

      const workerInfo = await obscura.getWorker(worker.address);
      expect(workerInfo.isActive).to.be.false;
      expect(workerInfo.stake).to.equal(0);
    });
  });

  describe("Job Creation", function () {
    it("Should create a job with encrypted inputs", async function () {
      const encryptedInputs = ethers.hexlify(ethers.toUtf8Bytes("encrypted_data"));
      
      await expect(
        obscura.connect(client).createJob(0, encryptedInputs, { value: JOB_REWARD })
      )
        .to.emit(obscura, "JobCreated")
        .withArgs(0, client.address, 0, JOB_REWARD * 98n / 100n); // After 2% fee

      const job = await obscura.getJob(0);
      expect(job.client).to.equal(client.address);
      expect(job.status).to.equal(0); // Pending
      expect(job.computationType).to.equal(0); // SUM
    });

    it("Should reject job creation with zero reward", async function () {
      const encryptedInputs = ethers.hexlify(ethers.toUtf8Bytes("encrypted_data"));
      
      await expect(
        obscura.connect(client).createJob(0, encryptedInputs, { value: 0 })
      ).to.be.revertedWith("Reward must be greater than 0");
    });

    it("Should reject job creation with empty inputs", async function () {
      await expect(
        obscura.connect(client).createJob(0, "0x", { value: JOB_REWARD })
      ).to.be.revertedWith("Empty inputs");
    });

    it("Should track client jobs", async function () {
      const encryptedInputs = ethers.hexlify(ethers.toUtf8Bytes("encrypted_data"));
      
      await obscura.connect(client).createJob(0, encryptedInputs, { value: JOB_REWARD });
      await obscura.connect(client).createJob(1, encryptedInputs, { value: JOB_REWARD });

      const clientJobs = await obscura.getClientJobs(client.address);
      expect(clientJobs.length).to.equal(2);
      expect(clientJobs[0]).to.equal(0);
      expect(clientJobs[1]).to.equal(1);
    });
  });

  describe("Job Assignment", function () {
    beforeEach(async function () {
      await obscura.connect(worker).registerWorker("Worker1", { value: MIN_STAKE });
      
      const encryptedInputs = ethers.hexlify(ethers.toUtf8Bytes("encrypted_data"));
      await obscura.connect(client).createJob(0, encryptedInputs, { value: JOB_REWARD });
    });

    it("Should allow active worker to claim job", async function () {
      await expect(obscura.connect(worker).claimJob(0))
        .to.emit(obscura, "JobAssigned")
        .withArgs(0, worker.address);

      const job = await obscura.getJob(0);
      expect(job.worker).to.equal(worker.address);
      expect(job.status).to.equal(1); // Assigned
    });

    it("Should reject claim from non-worker", async function () {
      await expect(
        obscura.connect(client).claimJob(0)
      ).to.be.revertedWith("Not an active worker");
    });

    it("Should prevent double claiming", async function () {
      await obscura.connect(worker).claimJob(0);
      
      await obscura.connect(worker2).registerWorker("Worker2", { value: MIN_STAKE });
      await expect(
        obscura.connect(worker2).claimJob(0)
      ).to.be.revertedWith("Job already claimed");
    });
  });

  describe("Result Submission and Payment", function () {
    beforeEach(async function () {
      await obscura.connect(worker).registerWorker("Worker1", { value: MIN_STAKE });
      
      const encryptedInputs = ethers.hexlify(ethers.toUtf8Bytes("encrypted_data"));
      await obscura.connect(client).createJob(0, encryptedInputs, { value: JOB_REWARD });
      await obscura.connect(worker).claimJob(0);
    });

    it("Should allow worker to submit result", async function () {
      const encryptedResult = ethers.hexlify(ethers.toUtf8Bytes("encrypted_result"));
      
      await expect(obscura.connect(worker).submitResult(0, encryptedResult))
        .to.emit(obscura, "ResultSubmitted")
        .withArgs(0, worker.address, encryptedResult);

      const job = await obscura.getJob(0);
      expect(job.status).to.equal(2); // Completed
      expect(job.encryptedResult).to.equal(encryptedResult);
    });

    it("Should reject result from non-assigned worker", async function () {
      await obscura.connect(worker2).registerWorker("Worker2", { value: MIN_STAKE });
      const encryptedResult = ethers.hexlify(ethers.toUtf8Bytes("encrypted_result"));
      
      await expect(
        obscura.connect(worker2).submitResult(0, encryptedResult)
      ).to.be.revertedWith("Not assigned to you");
    });

    it("Should allow client to verify and pay", async function () {
      const encryptedResult = ethers.hexlify(ethers.toUtf8Bytes("encrypted_result"));
      await obscura.connect(worker).submitResult(0, encryptedResult);

      const workerBalanceBefore = await ethers.provider.getBalance(worker.address);
      
      await expect(obscura.connect(client).verifyAndPay(0))
        .to.emit(obscura, "JobCompleted");

      const workerBalanceAfter = await ethers.provider.getBalance(worker.address);
      const job = await obscura.getJob(0);
      
      expect(job.status).to.equal(3); // Verified
      expect(workerBalanceAfter).to.be.gt(workerBalanceBefore);

      const workerInfo = await obscura.getWorker(worker.address);
      expect(workerInfo.completedJobs).to.equal(1);
    });
  });

  describe("Job Cancellation", function () {
    it("Should allow client to cancel pending job", async function () {
      const encryptedInputs = ethers.hexlify(ethers.toUtf8Bytes("encrypted_data"));
      await obscura.connect(client).createJob(0, encryptedInputs, { value: JOB_REWARD });

      const clientBalanceBefore = await ethers.provider.getBalance(client.address);
      
      const tx = await obscura.connect(client).cancelJob(0);
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;
      
      const clientBalanceAfter = await ethers.provider.getBalance(client.address);
      const job = await obscura.getJob(0);

      expect(job.status).to.equal(5); // Cancelled
      // Client gets refund minus gas
      expect(clientBalanceAfter).to.be.closeTo(
        clientBalanceBefore + (JOB_REWARD * 98n / 100n) - gasUsed,
        ethers.parseEther("0.001") // Allow small variance
      );
    });

    it("Should reject cancellation of assigned job", async function () {
      await obscura.connect(worker).registerWorker("Worker1", { value: MIN_STAKE });
      
      const encryptedInputs = ethers.hexlify(ethers.toUtf8Bytes("encrypted_data"));
      await obscura.connect(client).createJob(0, encryptedInputs, { value: JOB_REWARD });
      await obscura.connect(worker).claimJob(0);

      await expect(
        obscura.connect(client).cancelJob(0)
      ).to.be.revertedWith("Cannot cancel");
    });
  });

  describe("Platform Fees", function () {
    it("Should collect platform fees", async function () {
      const encryptedInputs = ethers.hexlify(ethers.toUtf8Bytes("encrypted_data"));
      await obscura.connect(client).createJob(0, encryptedInputs, { value: JOB_REWARD });

      const platformBalance = await obscura.platformBalance();
      const expectedFee = JOB_REWARD * 2n / 100n; // 2% fee
      
      expect(platformBalance).to.equal(expectedFee);
    });

    it("Should allow owner to withdraw platform fees", async function () {
      const encryptedInputs = ethers.hexlify(ethers.toUtf8Bytes("encrypted_data"));
      await obscura.connect(client).createJob(0, encryptedInputs, { value: JOB_REWARD });

      const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
      const platformBalance = await obscura.platformBalance();
      
      const tx = await obscura.connect(owner).withdrawPlatformFees();
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;
      
      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);

      expect(ownerBalanceAfter).to.equal(ownerBalanceBefore + platformBalance - gasUsed);
      expect(await obscura.platformBalance()).to.equal(0);
    });
  });
});

