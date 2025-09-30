import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🎭 Deploying Obscura Contracts...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy Obscura main contract
  console.log("📝 Deploying Obscura...");
  const Obscura = await ethers.getContractFactory("Obscura");
  const obscura = await Obscura.deploy();
  await obscura.waitForDeployment();
  const obscuraAddress = await obscura.getAddress();

  console.log("✅ Obscura deployed to:", obscuraAddress);

  // Save deployment info
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    contracts: {
      Obscura: obscuraAddress,
    },
    timestamp: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
  };

  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const networkName = (await ethers.provider.getNetwork()).name;
  const deploymentPath = path.join(deploymentsDir, `${networkName}.json`);
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));

  console.log("\n📄 Deployment info saved to:", deploymentPath);

  // Update .env file
  const envPath = path.join(__dirname, "../../.env");
  let envContent = "";
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf8");
  }

  // Update or add contract address
  const addressLine = `OBSCURA_CONTRACT_ADDRESS=${obscuraAddress}`;
  if (envContent.includes("OBSCURA_CONTRACT_ADDRESS=")) {
    envContent = envContent.replace(/OBSCURA_CONTRACT_ADDRESS=.*/g, addressLine);
  } else {
    envContent += `\n${addressLine}\n`;
  }

  fs.writeFileSync(envPath, envContent);
  console.log("✅ .env file updated with contract address\n");

  // Display summary
  console.log("═══════════════════════════════════════════");
  console.log("🎉 Deployment Complete!");
  console.log("═══════════════════════════════════════════");
  console.log("Obscura Contract:", obscuraAddress);
  console.log("Network:", networkName);
  console.log("Chain ID:", deploymentInfo.chainId);
  console.log("═══════════════════════════════════════════\n");

  // Verification instructions
  if (networkName === "sepolia") {
    console.log("📋 To verify on Etherscan, run:");
    console.log(`npx hardhat verify --network sepolia ${obscuraAddress}\n`);
  }

  console.log("🚀 Next steps:");
  console.log("1. Update frontend/.env with contract address");
  console.log("2. Update worker/.env with contract address");
  console.log("3. Start worker nodes: npm run dev:worker");
  console.log("4. Start frontend: npm run dev:frontend\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

