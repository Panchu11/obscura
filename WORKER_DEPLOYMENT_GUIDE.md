# 🚀 Worker Node Deployment Guide (FREE)

## ✅ Everything is Ready for Auto-Deploy!

Your worker node is now configured for **automatic deployment** on multiple platforms. Just import from GitHub and it deploys!

---

## 🎯 Option 1: Render.com (RECOMMENDED - FREE)

### Step-by-Step Instructions

#### STEP 1: Go to Render.com

1. Open browser: **https://render.com**
2. Click **"Get Started"** (FREE)
3. Click **"Sign Up with GitHub"**
4. Authorize Render to access your GitHub

#### STEP 2: Create New Web Service

1. Click **"New +"** (top right)
2. Select **"Web Service"**
3. Click **"Connect account"** if needed
4. Find **"obscura"** repository
5. Click **"Connect"**

#### STEP 3: Configure Service (Auto-Filled!)

Render will auto-detect the `render.yaml` file. Verify these settings:

```
Name: obscura-worker
Region: Oregon (US West)
Branch: main
Runtime: Node
Build Command: cd worker && npm install && npm run build
Start Command: cd worker && npm run start
Instance Type: Free
```

**✅ All of this is AUTO-CONFIGURED from render.yaml!**

#### STEP 4: Add ONE Environment Variable

You only need to add **ONE** variable manually (for security):

```
Key: WORKER_PRIVATE_KEY
Value: 0xa399ec5250a027f18d84337ebfeda034f3fba57eaafc38e77a26980edb681a6c
```

**All other variables are already in render.yaml!**

#### STEP 5: Deploy!

1. Click **"Create Web Service"**
2. Wait 3-5 minutes
3. Watch the logs - you should see:
   ```
   ✅ Obscura Worker is running and listening for jobs
   Worker balance: X.XX ETH
   Worker address: 0x961DBb879Dc387Fc41abb5bfD13fD501Ab89889C
   ```

#### STEP 6: Done! ✅

Your worker is now:
- ✅ Running 24/7 for FREE
- ✅ Auto-restarts if it crashes
- ✅ Auto-deploys when you push to GitHub
- ✅ Processing jobs automatically

---

## 🎯 Option 2: Railway.app (ALTERNATIVE - FREE)

### Step-by-Step Instructions

#### STEP 1: Go to Railway

1. Open browser: **https://railway.app**
2. Click **"Login"**
3. Click **"Login with GitHub"**
4. Authorize Railway

#### STEP 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose **"obscura"** repository
4. Click **"Deploy Now"**

#### STEP 3: Configure (Auto-Detected!)

Railway will auto-detect the `railway.json` file:

```
Build Command: cd worker && npm install && npm run build
Start Command: cd worker && npm run start
```

**✅ Auto-configured from railway.json!**

#### STEP 4: Add Environment Variables

Click **"Variables"** tab and add:

```
NODE_ENV=production
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/2bc5186879f14defab6d144783ad9daf
WORKER_PRIVATE_KEY=0xa399ec5250a027f18d84337ebfeda034f3fba57eaafc38e77a26980edb681a6c
OBSCURA_CONTRACT_ADDRESS=0x37F563b87B48bBcb12497A0a824542CafBC06d1F
WORKER_NAME=Obscura-Worker-1
LOG_LEVEL=info
```

#### STEP 5: Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Check logs for success message

#### STEP 6: Done! ✅

Your worker is running!

---

## 🎯 Option 3: Fly.io (ADVANCED - FREE)

### Prerequisites

Install Fly CLI:
```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex
```

### Deploy

```bash
# Login
fly auth login

# Launch (from project root)
cd worker
fly launch --name obscura-worker --region sea

# Set secrets
fly secrets set WORKER_PRIVATE_KEY=0xa399ec5250a027f18d84337ebfeda034f3fba57eaafc38e77a26980edb681a6c

# Deploy
fly deploy
```

---

## 📊 Comparison

| Platform | Free Tier | Auto-Deploy | Ease | Uptime |
|----------|-----------|-------------|------|--------|
| **Render.com** | 750h/month | ✅ Yes | ⭐⭐⭐⭐⭐ Easy | Spins down after 15min |
| **Railway.app** | $5 credit/month | ✅ Yes | ⭐⭐⭐⭐ Easy | Always on |
| **Fly.io** | 3 VMs free | ✅ Yes | ⭐⭐⭐ Medium | Always on |

**Recommendation: Start with Render.com** (easiest setup)

---

## 🔍 What Files Were Created

### 1. `render.yaml` (Root)
- Auto-configures Render.com deployment
- Sets build and start commands
- Defines environment variables
- Specifies free tier

### 2. `railway.json` (Root)
- Auto-configures Railway.app deployment
- Sets build and start commands
- Defines restart policy

### 3. `worker/Dockerfile`
- Docker configuration for containerized deployment
- Works with any Docker-based platform
- Optimized for production

### 4. `worker/.dockerignore`
- Excludes unnecessary files from Docker build
- Reduces image size
- Improves build speed

---

## ✅ Pre-Deployment Checklist

Before deploying, verify:

- [x] Code pushed to GitHub ✅
- [x] `render.yaml` in repository root ✅
- [x] `railway.json` in repository root ✅
- [x] `worker/Dockerfile` exists ✅
- [x] `worker/package.json` has build & start scripts ✅
- [x] Worker wallet has Sepolia ETH ✅
- [x] Worker is registered on contract ✅

**Everything is ready!** ✅

---

## 🎬 Quick Start (Render.com)

**5-Minute Deployment:**

1. Go to **https://render.com**
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect **"obscura"** repository
5. Add **WORKER_PRIVATE_KEY** environment variable
6. Click **"Create Web Service"**
7. Wait 3 minutes
8. **Done!** ✅

---

## 📝 Environment Variables Reference

### Required (Must Set Manually)
- `WORKER_PRIVATE_KEY` - Your worker's private key (KEEP SECRET!)

### Auto-Configured (Already in render.yaml)
- `SEPOLIA_RPC_URL` - Infura RPC endpoint
- `OBSCURA_CONTRACT_ADDRESS` - Smart contract address
- `WORKER_NAME` - Worker display name
- `LOG_LEVEL` - Logging verbosity
- `NODE_ENV` - Production environment

---

## 🐛 Troubleshooting

### Build Fails

**Error: Cannot find module**
```
Solution: Check package.json has all dependencies
```

**Error: TypeScript compilation failed**
```
Solution: Check tsconfig.json is correct
```

### Worker Not Starting

**Error: Missing environment variable**
```
Solution: Add WORKER_PRIVATE_KEY in platform dashboard
```

**Error: Cannot connect to RPC**
```
Solution: Check SEPOLIA_RPC_URL is correct
```

### Worker Not Claiming Jobs

**Error: Insufficient funds**
```
Solution: Fund worker wallet with Sepolia ETH
Get from: https://sepoliafaucet.com
```

**Error: Worker not registered**
```
Solution: Register worker through frontend first
```

---

## 📊 Monitoring Your Worker

### Render.com

1. Go to Render dashboard
2. Click on **"obscura-worker"**
3. Click **"Logs"** tab
4. See real-time logs:
   ```
   ✅ Obscura Worker is running and listening for jobs
   New job detected: #1
   Successfully claimed job #1
   Computing result...
   Result submitted for job #1
   ```

### Railway.app

1. Go to Railway dashboard
2. Click on your project
3. Click **"Deployments"** → **"View Logs"**
4. See real-time logs

---

## 🔄 Auto-Deploy on Git Push

Once deployed, every time you push to GitHub:

```bash
git add .
git commit -m "Update worker"
git push
```

**Your worker automatically redeploys!** 🎉

No manual steps needed!

---

## 💰 Cost Breakdown

| Platform | Monthly Cost | What You Get |
|----------|--------------|--------------|
| **Render.com** | **$0** | 750 hours (enough for 1 worker 24/7) |
| **Railway.app** | **$0** | $5 free credit (runs ~1 month) |
| **Fly.io** | **$0** | 3 VMs, 160GB bandwidth |
| **GitHub** | **$0** | Unlimited repos |
| **Vercel** | **$0** | Frontend hosting |
| **Sepolia** | **$0** | Test network (free ETH) |
| **TOTAL** | **$0/month** | Everything! |

---

## 🎉 Success Criteria

Your deployment is successful when you see:

```
✅ Build completed
✅ Service started
✅ Worker is running and listening for jobs
✅ Worker balance: X.XX ETH
✅ Worker address: 0x961DBb879Dc387Fc41abb5bfD13fD501Ab89889C
✅ Contract address: 0x37F563b87B48bBcb12497A0a824542CafBC06d1F
```

---

## 📞 Need Help?

- **Render Docs**: https://render.com/docs
- **Railway Docs**: https://docs.railway.app
- **GitHub Issues**: https://github.com/Panchu11/obscura/issues

---

## 🚀 Next Steps After Deployment

1. **Test the worker**
   - Create a job in the frontend
   - Watch worker logs
   - Verify job is claimed and completed

2. **Monitor performance**
   - Check logs regularly
   - Monitor worker balance
   - Track completed jobs

3. **Scale up** (optional)
   - Deploy multiple workers
   - Use different wallets
   - Increase stake for higher priority

---

**Your worker is ready to deploy!** 🎭

**Recommended: Start with Render.com** (easiest and most reliable)

Go to: **https://render.com** and follow STEP 1-6 above!

