# 🚀 Render.com Manual Setup (GUARANTEED TO WORK)

If the automatic `render.yaml` deployment isn't working, follow these **manual steps** instead. This is **guaranteed to work**!

---

## 📋 Step-by-Step Manual Setup

### STEP 1: Go to Render.com

1. Open: **https://render.com**
2. Click **"Get Started"** (FREE)
3. Click **"Sign Up with GitHub"**
4. Authorize Render

---

### STEP 2: Create New Web Service

1. Click **"New +"** (top right)
2. Select **"Web Service"**
3. Click **"Connect account"** (if needed)
4. Find **"obscura"** repository
5. Click **"Connect"**

---

### STEP 3: Configure Service (IMPORTANT!)

**DO NOT use the Blueprint!** Click **"Configure manually"** instead.

Fill in these settings **EXACTLY**:

#### Basic Settings:
```
Name: obscura-worker
Region: Oregon (US West)
Branch: main
```

#### Build Settings:
```
Runtime: Node
Root Directory: worker          ← VERY IMPORTANT!
Build Command: npm install && npm run build
Start Command: npm run start
```

#### Instance Settings:
```
Instance Type: Free
```

---

### STEP 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these **6 variables**:

**Variable 1:**
```
Key: NODE_ENV
Value: production
```

**Variable 2:**
```
Key: SEPOLIA_RPC_URL
Value: https://sepolia.infura.io/v3/2bc5186879f14defab6d144783ad9daf
```

**Variable 3:**
```
Key: WORKER_PRIVATE_KEY
Value: 0xa399ec5250a027f18d84337ebfeda034f3fba57eaafc38e77a26980edb681a6c
```

**Variable 4:**
```
Key: OBSCURA_CONTRACT_ADDRESS
Value: 0x37F563b87B48bBcb12497A0a824542CafBC06d1F
```

**Variable 5:**
```
Key: WORKER_NAME
Value: Obscura-Worker-1
```

**Variable 6:**
```
Key: LOG_LEVEL
Value: info
```

---

### STEP 5: Deploy!

1. Scroll down
2. Click **"Create Web Service"** (big blue button)
3. Wait 3-5 minutes
4. Watch the build logs

---

## ✅ Expected Output

### During Build:
```
=== Building ===
Detected Node.js application
Node version: 18.x
Running: npm install && npm run build

> npm install
added 150 packages in 15s

> npm run build
Compiling TypeScript...
Successfully compiled 5 files

Build completed successfully!
```

### After Deploy:
```
=== Starting Service ===
Running: npm run start

> @obscura/worker@1.0.0 start
> node dist/index.js

✅ Obscura Worker is running and listening for jobs
Worker balance: 2.029997942948802832 ETH
Worker address: 0x961DBb879Dc387Fc41abb5bfD13fD501Ab89889C
Contract address: 0x37F563b87B48bBcb12497A0a824542CafBC06d1F
Listening for JobCreated events...
```

---

## 🎯 Key Points

### ⚠️ MOST IMPORTANT:
- **Root Directory MUST be: `worker`**
- **Runtime MUST be: `Node`**
- **DO NOT use Docker/Blueprint**

### Why This Works:
- Tells Render to look in the `worker` folder
- Uses Node.js buildpack (not Docker)
- Runs commands from the worker directory
- Ignores the Dockerfile

---

## 🐛 Troubleshooting

### Error: "Cannot find package.json"
**Solution:** Make sure **Root Directory** is set to `worker`

### Error: "npm: command not found"
**Solution:** Make sure **Runtime** is set to `Node`

### Error: "Build failed"
**Solution:** Check the build logs for specific errors

### Error: "Service won't start"
**Solution:** 
1. Check all 6 environment variables are set
2. Verify WORKER_PRIVATE_KEY is correct
3. Check logs for error messages

---

## 📸 Screenshot Guide

### Configuration Screen Should Look Like:

```
┌─────────────────────────────────────────────────┐
│ Create a new Web Service                       │
├─────────────────────────────────────────────────┤
│                                                 │
│ Name: obscura-worker                           │
│ Region: Oregon (US West)                       │
│ Branch: main                                   │
│                                                 │
│ Runtime: Node                    ← IMPORTANT!  │
│ Root Directory: worker           ← IMPORTANT!  │
│                                                 │
│ Build Command:                                 │
│ npm install && npm run build                   │
│                                                 │
│ Start Command:                                 │
│ npm run start                                  │
│                                                 │
│ Instance Type: Free                            │
│                                                 │
│ ▼ Advanced                                     │
│   Environment Variables:                       │
│   [+] Add Environment Variable                 │
│                                                 │
│   NODE_ENV = production                        │
│   SEPOLIA_RPC_URL = https://sepolia...         │
│   WORKER_PRIVATE_KEY = 0xa399ec...             │
│   OBSCURA_CONTRACT_ADDRESS = 0x37F5...         │
│   WORKER_NAME = Obscura-Worker-1               │
│   LOG_LEVEL = info                             │
│                                                 │
│                                                 │
│         [Create Web Service]                   │
└─────────────────────────────────────────────────┘
```

---

## ✅ Verification Checklist

Before clicking "Create Web Service", verify:

- [ ] Name: **obscura-worker** ✓
- [ ] Region: **Oregon (US West)** ✓
- [ ] Branch: **main** ✓
- [ ] Runtime: **Node** ✓
- [ ] Root Directory: **worker** ✓ (MOST IMPORTANT!)
- [ ] Build Command: **npm install && npm run build** ✓
- [ ] Start Command: **npm run start** ✓
- [ ] Instance Type: **Free** ✓
- [ ] Environment Variables: **All 6 added** ✓

---

## 🎉 After Deployment

### Monitor Logs:
1. Go to your service dashboard
2. Click **"Logs"** tab
3. You should see the worker running

### Test the Worker:
1. Go to your frontend: **https://obscura-frontend.vercel.app/**
2. Create a test job
3. Watch the Render logs
4. You should see:
   ```
   🔔 New job detected: #1
   ⚡ Successfully claimed job #1
   🔧 Computing result...
   ✅ Result submitted for job #1
   ```

---

## 💡 Pro Tips

1. **Keep Logs Open**: Monitor in real-time
2. **Check Balance**: Worker needs ETH for gas
3. **Auto-Deploy**: Pushes to GitHub auto-deploy
4. **Free Tier**: 750 hours/month (enough for 24/7)

---

## 🔄 If You Need to Redeploy

1. Go to service dashboard
2. Click **"Manual Deploy"**
3. Select **"Deploy latest commit"**
4. Wait 3 minutes

---

## 📞 Still Having Issues?

### Common Mistakes:
- ❌ Forgot to set Root Directory to `worker`
- ❌ Selected Docker instead of Node runtime
- ❌ Missing environment variables
- ❌ Wrong branch selected

### Double-Check:
1. Root Directory = `worker`
2. Runtime = `Node`
3. All 6 environment variables added
4. Latest code from GitHub

---

## 🎯 Summary

**The Magic Settings:**
- **Root Directory: `worker`** ← This is the key!
- **Runtime: `Node`** ← Not Docker!
- **Build: `npm install && npm run build`**
- **Start: `npm run start`**

**Follow these exactly and it WILL work!** ✅

---

**Ready? Go to https://render.com and follow STEP 1-5!** 🚀

