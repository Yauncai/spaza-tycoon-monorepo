import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Starting Grootman deployment with account:", deployer.address);

  // 1. Get the Contract Factory
  const GrootmanNFT = await ethers.getContractFactory("GrootmanNFT");
  
  // 2. Deploy the Proxy
  console.log("📡 Deploying Proxy...");
  const grootman = await upgrades.deployProxy(GrootmanNFT, [deployer.address], {
    initializer: "initialize",
    kind: "uups",
  });

  await grootman.waitForDeployment();
  const proxyAddress = await grootman.getAddress();

  console.log("--------------------------------------------");
  console.log("✅ Grootman Proxy Address:", proxyAddress);
  console.log("--------------------------------------------");

  const metadataURI = "ipfs://bafkreidu7vwogndcpfllabbysjhcbevdxhk4o5qpzczsjtzwhzia3fz4ri"; 
  
  console.log("🎨 Minting the OG Mogul (#1)...");
  try {
    const mintTx = await grootman.mintGrootman(deployer.address, metadataURI);
    await mintTx.wait();
    console.log("✨ Success! OG Mogul minted to:", deployer.address);
  } catch (error) {
    console.error("❌ Minting failed, but contract is deployed:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});