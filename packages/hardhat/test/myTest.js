const { ethers, artifacts } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const faker = require('faker');

use(solidity);

describe("VehicleLifecycleToken contract", () => {

  let VehicleLifecycleToken;
  let instance;
  let owner;
  let govAccount;
  let manufacturerAccount;
  let serviceFactoryAccount;
  let policeAccount;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async () => {
    // Get the ContractFactory and Signers here.
    VehicleLifecycleToken = await ethers.getContractFactory("VehicleLifecycleToken");
    [owner, govAccount, manufacturerAccount, serviceFactoryAccount, policeAccount, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    instance = await VehicleLifecycleToken.deploy();
  });

  describe("Deployment", () => {
    it("Should set the right owner", async () => {
      expect(await instance.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await instance.balanceOf(owner.address);
      expect(await instance.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("SetAdmin", () => {
      it("Should set government role", async () => {
        // check default permissions
        const result0 = await instance.getRoles(govAccount.address);
        expect(result0.isGovernment).to.be.false;

        await instance.setAdminRole(govAccount.address);
        const result1 = await instance.getRoles(govAccount.address);
        expect(result1.isGovernment).to.be.true;
      });
  });

  describe("AdminRole AddManufacturer", ()=>{
    it("Should add manufacturer to internal storage", async() =>{
      await instance.setAdminRole(govAccount.address);

      const name = faker.lorem.word();
      await instance.connect(govAccount).addManufacturer(manufacturerAccount.address, name);

      const manufacturer = await instance.getManufacturer(manufacturerAccount.address);
      expect(manufacturer.name).to.be.equal(name);
    });

    it("Should set permissions", async()=>{
      await instance.setAdminRole(govAccount.address);

      const name = faker.lorem.word();
      await instance.connect(govAccount).addManufacturer(manufacturerAccount.address, name);

      const result = await instance.getRoles(manufacturerAccount.address);
      expect(result.isManufacturer).to.be.true;
    });

    it("Should emit ManufacturerAdded event", async()=>{
      await instance.setAdminRole(govAccount.address);

      const name = faker.lorem.word();
      await expect(instance.connect(govAccount).addManufacturer(manufacturerAccount.address, name))
        .to.emit(instance, "ManufacturerAdded")
        .withArgs(manufacturerAccount.address, name);
    });
  })

  // describe("Transactions", function () {
  //   it("Should transfer tokens between accounts", async () => {
  //     // Transfer 50 tokens from owner to addr1
  //     await instance.transfer(addr1.address, 50);
  //     const addr1Balance = await instance.balanceOf(addr1.address);
  //     expect(addr1Balance).to.equal(50);

  //     // Transfer 50 tokens from addr1 to addr2
  //     // We use .connect(signer) to send a transaction from another account
  //     await instance.connect(addr1).transfer(addr2.address, 50);
  //     const addr2Balance = await instance.balanceOf(addr2.address);
  //     expect(addr2Balance).to.equal(50);
  //   });

  //   it("Should fail if sender doesn’t have enough tokens", async function () {
  //     const initialOwnerBalance = await instance.balanceOf(owner.address);

  //     // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
  //     // `require` will evaluate false and revert the transaction.
  //     await expect(
  //       instance.connect(addr1).transfer(owner.address, 1)
  //     ).to.be.revertedWith("Not enough tokens");

  //     // Owner balance shouldn't have changed.
  //     expect(await instance.balanceOf(owner.address)).to.equal(
  //       initialOwnerBalance
  //     );
  //   });

  //   it("Should update balances after transfers", async function () {
  //     const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

  //     // Transfer 100 tokens from owner to addr1.
  //     await instance.transfer(addr1.address, 100);

  //     // Transfer another 50 tokens from owner to addr2.
  //     await instance.transfer(addr2.address, 50);

  //     // Check balances.
  //     const finalOwnerBalance = await instance.balanceOf(owner.address);
  //     expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150);

  //     const addr1Balance = await instance.balanceOf(addr1.address);
  //     expect(addr1Balance).to.equal(100);

  //     const addr2Balance = await instance.balanceOf(addr2.address);
  //     expect(addr2Balance).to.equal(50);
  //   });
  // });

});