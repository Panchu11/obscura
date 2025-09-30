# 📖 Obscura User Guide

## Table of Contents

- [Getting Started](#getting-started)
- [For Clients](#for-clients)
- [For Workers](#for-workers)
- [Understanding the UI](#understanding-the-ui)
- [FAQ](#faq)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Getting Started

### What is Obscura?

Obscura is a privacy-preserving compute marketplace where you can:
- **As a Client**: Submit encrypted computation jobs and get results without revealing your data
- **As a Worker**: Execute computations and earn rewards

### Prerequisites

1. **MetaMask** (or compatible wallet)
   - Install from [metamask.io](https://metamask.io)
   - Create or import a wallet

2. **Sepolia ETH**
   - Get free test ETH from [sepoliafaucet.com](https://sepoliafaucet.com)
   - You'll need it for transaction fees

3. **Switch to Sepolia Network**
   - Open MetaMask
   - Click network dropdown
   - Select "Sepolia test network"
   - If not visible, enable "Show test networks" in Settings

---

## For Clients

### Step 1: Connect Your Wallet

1. Go to **https://obscura-frontend.vercel.app/**
2. Click **"Connect Wallet"** in the top right
3. Select your wallet (MetaMask, Rabby, Leap, etc.)
4. Approve the connection
5. Ensure you're on **Sepolia network**

### Step 2: Create a Job

1. Click the **"Create Job"** button
2. Fill in the form:
   - **Computation Type**: Choose Addition, Multiplication, or Comparison
   - **Number 1**: Enter first number (e.g., 10)
   - **Number 2**: Enter second number (e.g., 20)
   - **Reward**: Set reward amount (minimum 0.001 ETH recommended)

3. Click **"Submit Job"**
4. Approve the transaction in your wallet
5. Wait for confirmation (~15 seconds)

**Your data is encrypted automatically before being sent!**

### Step 3: Monitor Your Job

1. Click the **"Client"** tab
2. Find your job in **"Your Jobs"** list
3. Watch the status change:
   - 🟡 **Pending**: Waiting for a worker
   - 🔵 **Assigned**: Worker is computing
   - 🟢 **Completed**: Result ready for verification

### Step 4: Verify Result & Pay Worker

1. When status is **"Completed"**, click **"View Details"**
2. Click **"Verify & Pay"** button
3. Approve the transaction
4. See the decrypted result!
5. Worker receives payment automatically

**Example:**
```
Input: 10 + 20
Result: 30 ✅
```

### Step 5: Understanding Job Details

Click **"View Details"** on any job to see:
- **Job ID**: Unique identifier
- **Computation Type**: Addition, Multiplication, or Comparison
- **Status**: Current job status
- **Client**: Your address
- **Worker**: Worker's address (if assigned)
- **Reward**: Payment amount
- **Created**: When job was created
- **Completed**: When job was finished (if applicable)
- **Encrypted Inputs**: Your encrypted data
- **Encrypted Result**: Worker's encrypted result

### Filtering Jobs

Use filter buttons to view:
- **All**: All your jobs
- **Pending**: Jobs waiting for workers
- **Assigned**: Jobs being worked on
- **Completed**: Finished jobs

### Canceling a Job

You can cancel a job if:
- Status is **Pending** (not yet claimed)
- No worker has been assigned

To cancel:
1. Click **"View Details"**
2. Click **"Cancel Job"**
3. Approve transaction
4. Receive refund (minus gas fees)

---

## For Workers

### Step 1: Register as a Worker

1. Connect your wallet
2. Click the **"Worker"** tab
3. Fill in the registration form:
   - **Worker Name**: Choose a name (e.g., "My Worker")
   - **Stake Amount**: Minimum 0.1 ETH (required for security)

4. Click **"Register as Worker"**
5. Approve the transaction

**Your stake will be returned when you deregister!**

### Step 2: Set Up Worker Node

#### Option A: Manual Claiming (Browser)

1. Go to **"Worker"** tab
2. See **"Available Jobs"** section
3. Click **"Claim Job"** on any job
4. Wait for computation (handled by smart contract)
5. Earn rewards!

#### Option B: Automated Worker Node (Recommended)

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/obscura.git
cd obscura/worker
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment:**
```bash
cp .env.example .env
nano .env
```

Add:
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
WORKER_PRIVATE_KEY=your_private_key
OBSCURA_CONTRACT_ADDRESS=0x37F563b87B48bBcb12497A0a824542CafBC06d1F
WORKER_NAME=Worker-1
LOG_LEVEL=info
```

4. **Start the worker:**
```bash
npm run dev
```

5. **Monitor logs:**
```
✅ Obscura Worker is running and listening for jobs
Worker balance: 2.03 ETH
Worker address: 0x961DBb879Dc387Fc41abb5bfD13fD501Ab89889C
```

### Step 3: Earn Rewards

Your worker node will:
1. **Detect** new jobs automatically
2. **Claim** available jobs
3. **Execute** FHE computations
4. **Submit** encrypted results
5. **Receive** payment when client verifies

### Step 4: Monitor Your Performance

In the **"Worker"** tab, see:
- **Reputation Score**: 0-100 (higher is better)
- **Completed Jobs**: Total jobs finished
- **Total Earned**: Total ETH earned

### Deregistering

To stop being a worker and withdraw your stake:
1. Stop your worker node (if running)
2. Go to **"Worker"** tab
3. Click **"Deregister"**
4. Approve transaction
5. Receive your stake back

---

## Understanding the UI

### Tab Navigation

#### 1. FHE Demo Tab
- **Interactive playground** for FHE encryption
- Try encrypting and computing on encrypted data
- See live visualization of FHE operations
- Great for learning how FHE works!

#### 2. Privacy Tab
- **Privacy metrics** and guarantees
- See how your data is protected
- Understand the encryption process
- View privacy statistics

#### 3. Client Tab
- **Your jobs** management
- Create new jobs
- Monitor job status
- Verify results and pay workers
- Filter and search jobs

#### 4. Worker Tab
- **Worker dashboard**
- Register as a worker
- See available jobs
- Claim jobs manually
- View your worker stats

#### 5. Analytics Tab
- **Charts and statistics**
- Total jobs created
- Active workers
- Total rewards distributed
- Worker leaderboard
- Platform metrics

### Header

- **Logo**: Click to return home
- **Connect Wallet**: Connect/disconnect wallet
- **Network Indicator**: Shows current network
- **Account**: Shows connected address

### Footer

- Links to documentation
- Social media
- Contract address
- Version information

---

## FAQ

### General Questions

**Q: Is my data really private?**
A: Yes! Your data is encrypted client-side before being sent. Workers compute on encrypted data and never see the plaintext.

**Q: How long does a job take?**
A: Typically 30-60 seconds from creation to completion.

**Q: What happens if no worker claims my job?**
A: You can cancel the job and get a refund, or wait for a worker to become available.

**Q: Can I see other people's jobs?**
A: Workers can see available (pending) jobs, but cannot see the encrypted data or results.

### Client Questions

**Q: How much should I set as reward?**
A: Minimum 0.001 ETH is recommended. Higher rewards may attract workers faster.

**Q: Can I cancel a job after it's claimed?**
A: No, you can only cancel pending jobs. Once claimed, you must wait for completion.

**Q: What if the result is wrong?**
A: Currently, you should verify the result before paying. Future versions will include dispute resolution.

**Q: Do I need to pay gas fees?**
A: Yes, you pay gas fees for creating jobs and verifying results.

### Worker Questions

**Q: How much can I earn?**
A: You earn the reward amount set by the client for each job you complete.

**Q: Why do I need to stake ETH?**
A: Staking ensures workers are committed and discourages malicious behavior.

**Q: Can I run multiple workers?**
A: Yes! You can run multiple worker nodes with different wallets.

**Q: What if my worker node crashes?**
A: Restart it. Uncompleted jobs will be available for other workers to claim.

---

## Best Practices

### For Clients

✅ **Set appropriate rewards**: Higher rewards attract workers faster
✅ **Verify results promptly**: Don't leave workers waiting
✅ **Keep your private key safe**: You need it to decrypt results
✅ **Monitor job status**: Check the Client tab regularly
✅ **Cancel unused jobs**: Free up your funds if you no longer need the job

❌ **Don't set rewards too low**: Workers may ignore your jobs
❌ **Don't share your private key**: You'll lose access to results
❌ **Don't create duplicate jobs**: Wastes gas fees

### For Workers

✅ **Keep your node running**: More uptime = more jobs
✅ **Fund your wallet**: Ensure you have ETH for gas fees
✅ **Monitor logs**: Check for errors regularly
✅ **Build reputation**: Complete jobs to increase your score
✅ **Stake more**: Higher stake = higher trust

❌ **Don't stop mid-job**: Damages your reputation
❌ **Don't run out of ETH**: You won't be able to submit results
❌ **Don't share your private key**: Protects your stake and earnings

---

## Troubleshooting

### Connection Issues

**Problem: Can't connect wallet**
- Solution: Refresh page, try different wallet, check browser extensions

**Problem: Wrong network**
- Solution: Switch to Sepolia in MetaMask

**Problem: Transaction fails**
- Solution: Increase gas limit, check you have enough ETH

### Job Issues

**Problem: Job stuck in Pending**
- Solution: Wait for workers, increase reward, or cancel and recreate

**Problem: Can't see my jobs**
- Solution: Refresh page (Ctrl+Shift+R), check you're on correct wallet

**Problem: Can't verify result**
- Solution: Ensure job status is "Completed", check you have ETH for gas

### Worker Issues

**Problem: Worker not claiming jobs**
- Solution: Check worker is registered, has ETH, and node is running

**Problem: Worker node crashes**
- Solution: Check logs, ensure environment variables are correct, restart node

**Problem: Low reputation**
- Solution: Complete more jobs successfully, avoid abandoning jobs

---

## Getting Help

- **Documentation**: [docs/](../docs/)
- **GitHub Issues**: [github.com/yourusername/obscura/issues](https://github.com/yourusername/obscura/issues)
- **Discord**: [Join our community](https://discord.gg/obscura)
- **Email**: support@obscura.fhe

---

**Happy Computing! 🎭**

*Privacy in the Light, Computation in the Shadows*

