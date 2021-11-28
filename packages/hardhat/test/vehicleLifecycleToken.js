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
    [owner, govAccount, ...other] = await ethers.getSigners();
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
      expectRolesToMatch(rolesBefore, {
        isGovernment: false,
        isManufacturer: false,
        isServiceFactory: false,
        isPolice: false,
      });

      // Act
      await instance.setAdminRole(govAccount.address);
      const rolesAfter = await instance.getRoles(govAccount.address);
      expectRolesToMatch(rolesAfter, {
        isGovernment: true,
        isManufacturer: false,
        isServiceFactory: false,
        isPolice: false,
      });
    });
  });
});

const expectRolesToMatch = (actual, expected) => {
  expect(actual.isGovernment).to.be.equal(expected.isGovernment);
  expect(actual.isManufacturer).to.be.equal(expected.isManufacturer);
  expect(actual.isServiceFactory).to.be.equal(expected.isServiceFactory);
  expect(actual.isPolice).to.be.equal(expected.isPolice);
};
