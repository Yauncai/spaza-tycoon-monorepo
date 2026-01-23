import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying SpazaRanks with account:", deployer.address);

  const SpazaRanks = await ethers.getContractFactory("SpazaRanks");

  console.log("Deploying Proxy...");
  const spazaRanks = await upgrades.deployProxy(SpazaRanks, [deployer.address], {
    initializer: "initialize",
    kind: "uups",
  });

  // 1. CRITICAL: Wait for the network to confirm the deployment
  await spazaRanks.waitForDeployment();

  const proxyAddress = await spazaRanks.getAddress();
  
  // 2. Wrap this in a try-catch because Base Sepolia can be slow to index implementation slots
  let implementationAddress;
  try {
      implementationAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
  } catch (e) {
      implementationAddress = "Still indexing... check Basescan in a minute.";
  }

  console.log("--------------------------------------------");
  console.log("✅ SpazaRanks Proxy Address (Save this!):", proxyAddress);
  console.log("✅ Implementation Address:", implementationAddress);
  console.log("--------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});