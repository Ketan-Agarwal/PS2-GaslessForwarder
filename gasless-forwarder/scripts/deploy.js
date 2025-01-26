const { ethers } = require("hardhat");

async function main() {
  const GaslessForwarder = await ethers.getContractFactory("GaslessTransactionForwarder");
  
  const forwarder = await GaslessForwarder.deploy();
  
  await forwarder.waitForDeployment();

  const address = await forwarder.getAddress();

  console.log("Gasless Forwarder deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });