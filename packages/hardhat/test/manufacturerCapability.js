const { ethers, artifacts } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const faker = require("faker");
const {
  createVehicle,
  manufactureVehicle,
  entityType,
} = require("./testHelpers");

use(solidity);

describe("Manufacturer Capability", async () => {
  let VehicleLifecycleToken;
  let instance;
  let owner;
  let govAccount;
  let manufacturerAccount;

  beforeEach(async () => {
    VehicleLifecycleToken = await ethers.getContractFactory(
      "VehicleLifecycleToken"
    );
    let other;
    [
      owner,
      govAccount,
      manufacturerAccount,
      serviceFactoryAccount,
      policeDepartmentAccount,
      ...other
    ] = await ethers.getSigners();

    instance = await VehicleLifecycleToken.deploy();
    await instance.setAdminRole(govAccount.address);

    const manufacturerName = faker.lorem.word();
    const manufacturerUri = faker.internet.url();

    await instance
      .connect(govAccount)
      .add(
        entityType.MANUFACTURER,
        manufacturerAccount.address,
        manufacturerName,
        manufacturerUri
      );
  });

  describe("ManufactureVehicle", () => {
    it("Should add new vehicle owned by manufacturer and emit event", async () => {
      const vehicle = createVehicle();
      const now = new Date();

      // Act
      await expect(manufactureVehicle(instance, manufacturerAccount, vehicle))
        .to.emit(instance, "VehicleManufactured")
        .withArgs(1, vehicle.vin);

      const actualVehicle = await instance.getVehicleDetailsByTokenId(1);
      expectToMatch(actualVehicle, vehicle);
      const date = new Date(actualVehicle.timestamp * 1000);
      expect(date).to.be.greaterThan(now);

      const actualTokenUri = await instance.tokenURI(1);
      expect(actualTokenUri).to.be.equal(vehicle.tokenUri);
    });

    it("Should not allow new vehicle with same vin", async () => {
      const vin = faker.vehicle.vin();
      const vehicle1 = createVehicle(vin);
      const vehicle2 = createVehicle(vin);
      // Act
      // first vehicle
      await manufactureVehicle(instance, manufacturerAccount, vehicle1);
      // second vehicle with same vin should throw
      await expect(
        manufactureVehicle(instance, manufacturerAccount, vehicle2)
      ).to.be.revertedWith("VIN is not unique");
    });
  });

  describe("GetVehicleDetails", () => {
    it("Should return details for existing vehicle by VIN", async () => {
      const vehicle = createVehicle();
      await manufactureVehicle(instance, manufacturerAccount, vehicle);

      // Act
      const actualVehicle = await instance.getVehicleDetailsByVin(vehicle.vin);

      expectToMatch(actualVehicle, vehicle);
    });
    it("Should throw on non-existing VIN", async () => {
      const vehicle = createVehicle();
      const randomVin = faker.vehicle.vin();
      await manufactureVehicle(instance, manufacturerAccount, vehicle);
      await expect(
        instance.getVehicleDetailsByVin(randomVin)
      ).to.be.revertedWith("NF");
    });
    it("Should return details for existing vehicle by TokenId", async () => {
      const vehicle = createVehicle();
      await manufactureVehicle(instance, manufacturerAccount, vehicle);

      // Act
      const actualVehicle = await instance.getVehicleDetailsByTokenId(1);
      expectToMatch(actualVehicle, vehicle);
    });
    it("Should throw on non-existing TokenId", async () => {
      const tokenId = 0; // TokensId is starting with 1

      // Act
      await expect(
        instance.getVehicleDetailsByTokenId(tokenId)
      ).to.be.revertedWith("NF");
    });
  });
});

const expectToMatch = (actual, expected) => {
  expect(actual.vin).to.be.equal(expected.vin);
  expect(actual.make).to.be.equal(expected.make);
  expect(actual.model).to.be.equal(expected.model);
  expect(actual.color).to.be.equal(expected.color);
  expect(actual.year).to.be.equal(expected.year);
  expect(actual.maxMileage).to.be.equal(expected.maxMileage);
  expect(actual.engineSize).to.be.equal(expected.engineSize);
};
