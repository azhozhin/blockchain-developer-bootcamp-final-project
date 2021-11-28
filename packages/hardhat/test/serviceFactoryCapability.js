const { ethers, artifacts } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const faker = require("faker");

const {
  createVehicle,
  manufactureVehicle,
  errorMessages,
  entityType,
} = require("./testHelpers");

use(solidity);

describe("Service Factory Capability", () => {
  let VehicleLifecycleToken;
  let instance;
  let owner;
  let govAccount;
  let manufacturerAccount;
  let serviceFactoryAccount;
  let policeDepartmentAccount;

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

    await instance
      .connect(govAccount)
      .add(
        entityType.MANUFACTURER,
        manufacturerAccount.address,
        faker.lorem.word(),
        faker.internet.url()
      );

    await instance
      .connect(govAccount)
      .add(
        entityType.SERVICE_FACTORY,
        serviceFactoryAccount.address,
        faker.lorem.word(),
        faker.internet.url()
      );

    await manufactureVehicle(instance, manufacturerAccount, createVehicle());
  });

  describe("Add ServiceLogEntry", () => {
    it("Should add new entry with all parameters to storage", async () => {
      const logEntriesBefore = await instance.getServiceLogEntries(1);
      expect(logEntriesBefore.length).to.be.equal(0);
      const recordUri = faker.internet.url();
      const mileage = faker.datatype.number({
        min: 2000,
        max: 20000,
        precision: 1,
      });
      var now = new Date();

      //Act
      await instance
        .connect(serviceFactoryAccount)
        .addServiceLogEntry(1, mileage, recordUri);

      const logEntriesAfter = await instance.getServiceLogEntries(1);
      expect(logEntriesAfter.length).to.be.equal(1);
      const logEntry = logEntriesAfter[0];

      var date = new Date(logEntry.timestamp * 1000);
      expect(date).to.be.greaterThan(now);
      expect(logEntry.principal).to.be.equal(serviceFactoryAccount.address);
      expect(logEntry.mileage).to.be.equal(mileage);
      expect(logEntry.recordUri).to.be.equal(recordUri);
    });

    it("Should not allow to add new entry for disabled service factory", async () => {
      const mileage = faker.datatype.number();
      const recordUri = faker.internet.url();
      await instance
        .connect(govAccount)
        .disable(entityType.SERVICE_FACTORY, serviceFactoryAccount.address);
      //Act
      await expect(
        instance
          .connect(serviceFactoryAccount)
          .addServiceLogEntry(1, mileage, recordUri)
      ).to.be.revertedWith(errorMessages.NOT_ALLOWED);
    });

    it("Should be allowed to add new entry for disabled and enabled again service factory", async () => {
      const mileage = faker.datatype.number();
      const recordUri = faker.internet.url();
      await instance
        .connect(govAccount)
        .disable(entityType.SERVICE_FACTORY, serviceFactoryAccount.address);
      await instance
        .connect(govAccount)
        .enable(entityType.SERVICE_FACTORY, serviceFactoryAccount.address);
      //Act
      await instance
        .connect(serviceFactoryAccount)
        .addServiceLogEntry(1, mileage, recordUri);
      const logEntriesAfter = await instance.getServiceLogEntries(1);
      expect(logEntriesAfter.length).to.be.equal(1);
    });

    it("Should be not allowed to add service log entries without permissions", async () => {
      const recordUri = faker.internet.url();
      const mileage = faker.datatype.number();
      // Act
      await expect(
        // service factory is not allowed to add police department logs, only to service logs
        instance
          .connect(policeDepartmentAccount)
          .addServiceLogEntry(1, mileage, recordUri)
      ).to.be.revertedWith(errorMessages.NOT_ALLOWED);
    });
  });
});
