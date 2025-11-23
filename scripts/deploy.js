const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log('Deploying contracts with account:', deployer.address);
  console.log('Account balance:', (await deployer.getBalance()).toString());
  
  // Get cUSD address based on network
  const network = hre.network.name;
  const cUSDAddress = network === 'celo'
    ? '0x765DE816845861e75A25fCA122bb6898B8B1282a' // Mainnet
    : '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9'; // Alfajores
  
  console.log(`Deploying to ${network} with cUSD at ${cUSDAddress}`);
  
  // Deploy BettingEscrow
  const BettingEscrow = await hre.ethers.getContractFactory('BettingEscrow');
  const escrow = await BettingEscrow.deploy(
    cUSDAddress,
    deployer.address // Treasury address (you can change this)
  );
  
  await escrow.deployed();
  
  console.log('✅ BettingEscrow deployed to:', escrow.address);
  console.log(`\nAdd to your .env.local:`);
  console.log(`NEXT_PUBLIC_ESCROW_CONTRACT_${network.toUpperCase()}=${escrow.address}`);
  
  // Wait for block confirmations before verification
  console.log('\nWaiting for block confirmations...');
  await escrow.deployTransaction.wait(5);
  
  // Verify contract on Celoscan
  try {
    console.log('\nVerifying contract on Celoscan...');
    await hre.run('verify:verify', {
      address: escrow.address,
      constructorArguments: [cUSDAddress, deployer.address],
    });
    console.log('✅ Contract verified!');
  } catch (error) {
    console.log('Verification failed:', error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
