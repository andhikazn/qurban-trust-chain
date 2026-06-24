const hre = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deployer:', deployer.address);
  console.log('Balance :', (await hre.ethers.provider.getBalance(deployer.address)).toString());

  const Factory = await hre.ethers.getContractFactory('QurbanRegistry');
  const contract = await Factory.deploy();
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log('✅ QurbanRegistry deployed at:', address);

  // Seed beberapa hewan
  const tx1 = await contract.registerAnimal('QC-001', 0, 7, hre.ethers.parseEther('0.05')); await tx1.wait();
  const tx2 = await contract.registerAnimal('QC-003', 1, 1, hre.ethers.parseEther('0.02')); await tx2.wait();
  console.log('Seeded 2 animals');

  // Export ABI + address ke frontend
  const artifact = await hre.artifacts.readArtifact('QurbanRegistry');
  const outDir = path.join(__dirname, '..', '..', 'src', 'lib');
  fs.mkdirSync(outDir, { recursive: true });
  const out = {
    address,
    abi: artifact.abi,
    network: hre.network.name,
    chainId: hre.network.config.chainId,
  };
  fs.writeFileSync(path.join(outDir, 'contract-abi.json'), JSON.stringify(out, null, 2));
  console.log('✅ ABI exported to src/lib/contract-abi.json');
}

main().catch((e) => { console.error(e); process.exit(1); });
