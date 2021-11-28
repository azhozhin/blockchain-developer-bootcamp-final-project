const { ethers, artifacts } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const faker = require("faker");
const {
  createVehicle,
  manufactureVehicle,
  entityType,
  errorMessages,
} = require("./testHelpers");

use(solidity);

describe("Manufacturer Capability", async () => {
  let VehicleLifecycleToken;
  let instance;
  let owner;
  let govAccount;
  let manufacturerAccount;
  let serviceFactoryAccount;

  beforeEach(async () => {
    VehicleLifecycleToken = await ethers.getContractFactory(
      "VehicleLifecycleToken"
    );
    let other;
    [owner, govAccount, manufacturerAccount, serviceFactoryAccount, ...other] =
      await ethers.getSigners();

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
      expectVehiclesToMatch(actualVehicle, vehicle);
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

    it("Should not allow to manufacture vehicle for disabled manufacturer", async () => {
      await instance
        .connect(govAccount)
        .disable(entityType.MANUFACTURER, manufacturerAccount.address);
      //Act
      const vehicle = createVehicle();
      await expect(
        manufactureVehicle(instance, manufacturerAccount, vehicle)
      ).to.be.revertedWith(errorMessages.NOT_ALLOWED);
    });

    it("Should be allowed to manufacture vehicle for disabled and enabled again manufacturer", async () => {
      await instance
        .connect(govAccount)
        .disable(entityType.MANUFACTURER, manufacturerAccount.address);
      await instance
        .connect(govAccount)
        .enable(entityType.MANUFACTURER, manufacturerAccount.address);
      //Act
      const vehicle = createVehicle();
      await manufactureVehicle(instance, manufacturerAccount, vehicle);

      const actualVehicle = await instance.getVehicleDetailsByTokenId(1);
      expectVehiclesToMatch(actualVehicle, vehicle);
    });

    it("Should be not allowed to manufacture vehicle without permissions", async () => {
      // Act
      const vehicle = createVehicle();
      await expect(
        // service factory is not allowed to manufacture vehicle, only to service
        manufactureVehicle(instance, serviceFactoryAccount, vehicle)
      ).to.be.revertedWith(errorMessages.NOT_ALLOWED);
    });
  });

  describe("GetVehicleDetails", () => {
    it("Should return details for existing vehicle by VIN", async () => {
      const vehicle = createVehicle();
      await manufactureVehicle(instance, manufacturerAccount, vehicle);

      // Act
      const actualVehicle = await instance.getVehicleDetailsByVin(vehicle.vin);

      expectVehiclesToMatch(actualVehicle, vehicle);
    });
    it("Should throw on non-existing VIN", async () => {
      const vehicle = createVehicle();
      const randomVin = faker.vehicle.vin();
      await manufactureVehicle(instance, manufacturerAccount, vehicle);
      await expect(
        instance.getVehicleDetailsByVin(randomVin)
      ).to.be.revertedWith(errorMessages.NOT_FOUND);
    });
    it("Should return details for existing vehicle by TokenId", async () => {
      const vehicle = createVehicle();
      await manufactureVehicle(instance, manufacturerAccount, vehicle);

      // Act
      const actualVehicle = await instance.getVehicleDetailsByTokenId(1);
      expectVehiclesToMatch(actualVehicle, vehicle);
    });
    it("Should throw on non-existing TokenId", async () => {
      const tokenId = 0; // TokensId is starting with 1

      // Act
      await expect(
        instance.getVehicleDetailsByTokenId(tokenId)
      ).to.be.revertedWith(errorMessages.NOT_FOUND);
    });
  });
});

const expectVehiclesToMatch = (actual, expected) => {
  expect(actual.vin).to.be.equal(expected.vin);
  expect(actual.make).to.be.equal(expected.make);
  expect(actual.model).to.be.equal(expected.model);
  expect(actual.color).to.be.equal(expected.color);
  expect(actual.year).to.be.equal(expected.year);
  expect(actual.maxMileage).to.be.equal(expected.maxMileage);
  expect(actual.engineSize).to.be.equal(expected.engineSize);
};
