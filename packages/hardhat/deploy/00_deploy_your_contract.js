// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  await deploy("VehicleLifecycleToken", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    // args: [ "Hello", ethers.utils.parseEther("1.5") ],
    log: true,
  });

  // Getting a previously deployed contract
  const vehicleLifecycleToken = await ethers.getContract("VehicleLifecycleToken", deployer);
  await vehicleLifecycleToken.setAdminRole(deployer);

  // 

  // Manufacturers
  await vehicleLifecycleToken.add(
    1,
    "0xDE740E368128Ece3e604dC9db747679A469f0Dd3", 
    "Porsche",
    "ipfs://QmRPjEtKnH56T3Khdq4YP6sWWEzHAfWXbnpS4Y9Qz6embE");
  await vehicleLifecycleToken.add(
    1,
    "0xb67EDD32D46ceD740b0F45ccD8408fa87FFA9C05", 
    "Kia",
    "ipfs://QmWYVZj53Gyepykg8FQN6i5WHuv1dq8NWKnSefTFkVn77U");

  // Service factories
  await vehicleLifecycleToken.add(
    2,
    "0x3B81e758Bd8163f5db425e7Fba402E18FCc8958D", 
    "Plaza Kia",
    "ipfs://QmUzD5MAFYU2LDKSQN5kiTH5xcM2aGLiK4TdS1rFYPcyKv");
  await vehicleLifecycleToken.add(
    2,
    "0x44d5Fb46BcA0bB486836789c40838bd5404834AB",
    "Manhattan Motorcars",
    "ipfs://QmWrdYxiA4LkiEuMFdhPy3pUBDHaqQJkFKe152XhVNHrsT");

  // Police Departments
  await vehicleLifecycleToken.add(
    3,
    "0x332b3E20452bD9d89Cf89473111BeA0c052E651a", 
    "New York City Police Department", 
    "ipfs://QmUyKBosqz2dzynvCP1qxa4rZrFgf1Z5dCbC7ozJpPrKUE");
  await vehicleLifecycleToken.add(
    3,
    "0x7b25648f9C5aDF7A887Ac451A69F137cde90916E", 
    "Metropolitan Police Department of the District of Columbia", 
    "ipfs://QmYy3UjFmCWbgPHvQT2Sxq8BDRynddGFhPc9wtvsHs7vJk");
    

  await vehicleLifecycleToken.setAdminRole("0x06199F0B1312DDAD50daCD024a52323c3ff91312");
  await vehicleLifecycleToken.transferOwnership("0x06199F0B1312DDAD50daCD024a52323c3ff91312");
  
  /*  await YourContract.setPurpose("Hello");
  
    To take ownership of yourContract using the ownable library uncomment next line and add the 
    address you want to be the owner. 
    // yourContract.transferOwnership(YOUR_ADDRESS_HERE);

    //const yourContract = await ethers.getContractAt('YourContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
  */

  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */

  // Verify your contracts with Etherscan
  // You don't want to verify on localhost
  /*if (chainId !== localChainId) {
    await run("verify:verify", {
      address: YourContract.address,
      contract: "contracts/VehicleLifecycleToken.sol:VehicleLifecycleToken",
      contractArguments: [],
    });
  }*/
};
module.exports.tags = ["VehicleLifecycleToken"];
