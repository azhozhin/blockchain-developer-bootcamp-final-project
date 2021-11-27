const { ethers, artifacts } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const faker = require("faker");

use(solidity);

describe("VehicleLifecycleToken contract", () => {
  let VehicleLifecycleToken;
  let instance;
  let owner;
  let govAccount;
  
  beforeEach(async () => {
    VehicleLifecycleToken = await ethers.getContractFactory(
      "VehicleLifecycleToken"
    );
    let other;
    [
      owner,
      govAccount,
      ...other
    ] = await ethers.getSigners();
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
      const rolesBefore = await instance.getRoles(govAccount.address);
      expect(rolesBefore.isGovernment).to.be.equal(false);
      expect(rolesBefore.isManufacturer).to.be.equal(false);
      expect(rolesBefore.isServiceFactory).to.be.equal(false);
      expect(rolesBefore.isPolice).to.be.equal(false);

      // Act
      await instance.setAdminRole(govAccount.address);
      const rolesAfter = await instance.getRoles(govAccount.address);
      expect(rolesAfter.isGovernment).to.be.equal(true);
      expect(rolesAfter.isManufacturer).to.be.equal(false);
      expect(rolesAfter.isServiceFactory).to.be.equal(false);
      expect(rolesAfter.isPolice).to.be.equal(false);
    });
  });
});
