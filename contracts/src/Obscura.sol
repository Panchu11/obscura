// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";
import "fhevm/gateway/GatewayCaller.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Obscura
 * @notice Main marketplace contract for encrypted computation jobs
 * @dev Computing in the Shadows - Where Your Data Remains Hidden
 */
contract Obscura is Ownable, ReentrancyGuard, GatewayCaller {
    // ============ Enums ============
    
    enum JobStatus {
        Pending,      // Job created, waiting for worker
        Assigned,     // Worker assigned, computation in progress
        Completed,    // Result submitted, awaiting verification
        Verified,     // Result verified, payment released
        Disputed,     // Result disputed
        Cancelled     // Job cancelled
    }

    enum ComputationType {
        SUM,              // Encrypted sum
        AVERAGE,          // Encrypted average
        MAX,              // Encrypted maximum
        MIN,              // Encrypted minimum
        LINEAR_REGRESSION, // Linear regression on encrypted data
        DECISION_TREE     // Decision tree inference
    }

    // ============ Structs ============
    
    struct Job {
        uint256 jobId;
        address client;
        address worker;
        ComputationType computationType;
        bytes encryptedInputs;      // Encrypted input data
        bytes encryptedResult;       // Encrypted computation result
        uint256 reward;              // Payment for worker
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
        uint256 reputation;          // 0-100 score
        bool isActive;
        uint256 registeredAt;
    }

    // ============ State Variables ============
    
    uint256 public jobCounter;
    uint256 public constant MIN_WORKER_STAKE = 0.1 ether;
    uint256 public constant PLATFORM_FEE_PERCENT = 2; // 2% platform fee
    uint256 public platformBalance;

    mapping(uint256 => Job) public jobs;
    mapping(address => Worker) public workers;
    mapping(address => uint256[]) public clientJobs;
    mapping(address => uint256[]) public workerJobs;
    
    address[] public registeredWorkers;

    // ============ Events ============
    
    event JobCreated(
        uint256 indexed jobId,
        address indexed client,
        ComputationType computationType,
        uint256 reward
    );

    event JobAssigned(
        uint256 indexed jobId,
        address indexed worker
    );

    event ResultSubmitted(
        uint256 indexed jobId,
        address indexed worker,
        bytes encryptedResult
    );

    event JobCompleted(
        uint256 indexed jobId,
        address indexed worker,
        uint256 payment
    );

    event JobCancelled(
        uint256 indexed jobId,
        address indexed client
    );

    event WorkerRegistered(
        address indexed worker,
        string name,
        uint256 stake
    );

    event WorkerDeregistered(
        address indexed worker
    );

    // ============ Modifiers ============
    
    modifier onlyActiveWorker() {
        require(workers[msg.sender].isActive, "Not an active worker");
        _;
    }

    modifier jobExists(uint256 _jobId) {
        require(_jobId < jobCounter, "Job does not exist");
        _;
    }

    // ============ Constructor ============
    
    constructor() Ownable(msg.sender) {
        jobCounter = 0;
    }

    // ============ Worker Management ============
    
    /**
     * @notice Register as a worker by staking ETH
     * @param _name Worker name/identifier
     */
    function registerWorker(string memory _name) external payable {
        require(!workers[msg.sender].isActive, "Already registered");
        require(msg.value >= MIN_WORKER_STAKE, "Insufficient stake");

        workers[msg.sender] = Worker({
            workerAddress: msg.sender,
            name: _name,
            stake: msg.value,
            completedJobs: 0,
            reputation: 100, // Start with perfect reputation
            isActive: true,
            registeredAt: block.timestamp
        });

        registeredWorkers.push(msg.sender);

        emit WorkerRegistered(msg.sender, _name, msg.value);
    }

    /**
     * @notice Deregister as a worker and withdraw stake
     */
    function deregisterWorker() external onlyActiveWorker nonReentrant {
        Worker storage worker = workers[msg.sender];
        require(worker.stake > 0, "No stake to withdraw");

        uint256 stakeAmount = worker.stake;
        worker.isActive = false;
        worker.stake = 0;

        (bool success, ) = msg.sender.call{value: stakeAmount}("");
        require(success, "Stake withdrawal failed");

        emit WorkerDeregistered(msg.sender);
    }

    // ============ Job Management ============
    
    /**
     * @notice Create a new encrypted computation job
     * @param _computationType Type of computation to perform
     * @param _encryptedInputs Encrypted input data
     */
    function createJob(
        ComputationType _computationType,
        bytes memory _encryptedInputs
    ) external payable returns (uint256) {
        require(msg.value > 0, "Reward must be greater than 0");
        require(_encryptedInputs.length > 0, "Empty inputs");

        uint256 jobId = jobCounter++;
        uint256 platformFee = (msg.value * PLATFORM_FEE_PERCENT) / 100;
        uint256 workerReward = msg.value - platformFee;

        jobs[jobId] = Job({
            jobId: jobId,
            client: msg.sender,
            worker: address(0),
            computationType: _computationType,
            encryptedInputs: _encryptedInputs,
            encryptedResult: "",
            reward: workerReward,
            createdAt: block.timestamp,
            completedAt: 0,
            status: JobStatus.Pending,
            resultDecrypted: false
        });

        platformBalance += platformFee;
        clientJobs[msg.sender].push(jobId);

        emit JobCreated(jobId, msg.sender, _computationType, workerReward);

        return jobId;
    }

    /**
     * @notice Worker claims a pending job
     * @param _jobId ID of the job to claim
     */
    function claimJob(uint256 _jobId) 
        external 
        onlyActiveWorker 
        jobExists(_jobId) 
    {
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.Pending, "Job not available");
        require(job.worker == address(0), "Job already claimed");

        job.worker = msg.sender;
        job.status = JobStatus.Assigned;
        workerJobs[msg.sender].push(_jobId);

        emit JobAssigned(_jobId, msg.sender);
    }

    /**
     * @notice Submit encrypted computation result
     * @param _jobId ID of the job
     * @param _encryptedResult Encrypted computation result
     */
    function submitResult(
        uint256 _jobId,
        bytes memory _encryptedResult
    ) external onlyActiveWorker jobExists(_jobId) {
        Job storage job = jobs[_jobId];
        require(job.worker == msg.sender, "Not assigned to you");
        require(job.status == JobStatus.Assigned, "Invalid job status");
        require(_encryptedResult.length > 0, "Empty result");

        job.encryptedResult = _encryptedResult;
        job.status = JobStatus.Completed;
        job.completedAt = block.timestamp;

        emit ResultSubmitted(_jobId, msg.sender, _encryptedResult);
    }

    /**
     * @notice Client verifies and accepts the result, releasing payment
     * @param _jobId ID of the job
     */
    function verifyAndPay(uint256 _jobId) 
        external 
        jobExists(_jobId) 
        nonReentrant 
    {
        Job storage job = jobs[_jobId];
        require(job.client == msg.sender, "Not your job");
        require(job.status == JobStatus.Completed, "Job not completed");

        job.status = JobStatus.Verified;

        // Update worker stats
        Worker storage worker = workers[job.worker];
        worker.completedJobs++;
        
        // Pay worker
        (bool success, ) = job.worker.call{value: job.reward}("");
        require(success, "Payment failed");

        emit JobCompleted(_jobId, job.worker, job.reward);
    }

    /**
     * @notice Cancel a pending job and refund client
     * @param _jobId ID of the job to cancel
     */
    function cancelJob(uint256 _jobId) 
        external 
        jobExists(_jobId) 
        nonReentrant 
    {
        Job storage job = jobs[_jobId];
        require(job.client == msg.sender, "Not your job");
        require(job.status == JobStatus.Pending, "Cannot cancel");

        job.status = JobStatus.Cancelled;

        // Refund client (minus platform fee already taken)
        uint256 refundAmount = job.reward;
        (bool success, ) = msg.sender.call{value: refundAmount}("");
        require(success, "Refund failed");

        emit JobCancelled(_jobId, msg.sender);
    }

    // ============ View Functions ============
    
    /**
     * @notice Get job details
     */
    function getJob(uint256 _jobId) 
        external 
        view 
        jobExists(_jobId) 
        returns (Job memory) 
    {
        return jobs[_jobId];
    }

    /**
     * @notice Get all jobs for a client
     */
    function getClientJobs(address _client) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return clientJobs[_client];
    }

    /**
     * @notice Get all jobs for a worker
     */
    function getWorkerJobs(address _worker) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return workerJobs[_worker];
    }

    /**
     * @notice Get all registered workers
     */
    function getAllWorkers() external view returns (address[] memory) {
        return registeredWorkers;
    }

    /**
     * @notice Get worker details
     */
    function getWorker(address _worker) 
        external 
        view 
        returns (Worker memory) 
    {
        return workers[_worker];
    }

    // ============ Admin Functions ============
    
    /**
     * @notice Withdraw platform fees
     */
    function withdrawPlatformFees() external onlyOwner nonReentrant {
        uint256 amount = platformBalance;
        platformBalance = 0;

        (bool success, ) = owner().call{value: amount}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @notice Emergency pause (if needed in future upgrades)
     */
    receive() external payable {
        revert("Direct transfers not allowed");
    }
}

