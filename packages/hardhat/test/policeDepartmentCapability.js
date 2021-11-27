const { ethers, artifacts } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const faker = require("faker");

use(solidity);

describe("Police Department Capability", () => {
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

    const policeDepartmentName = faker.lorem.word();
    const policeDepartmentUri = faker.internet.url();
    
    const manufacturerName = faker.lorem.word();
    const manufacturerUri = faker.internet.url();
    // TODO: magic constant!
    await instance
      .connect(govAccount)
      .add(1, manufacturerAccount.address, manufacturerName, manufacturerUri);

    // TODO: magic constant!
    await instance
      .connect(govAccount)
      .add(
        3,
        policeDepartmentAccount.address,
        policeDepartmentName,
        policeDepartmentUri
      );

    await instance
      .connect(manufacturerAccount)
      .manufactureVehicle(
        faker.vehicle.vin(),
        faker.vehicle.manufacturer(),
        faker.vehicle.model(),
        faker.vehicle.color(),
        faker.datatype.number({ min: 2000, max: 2021, precision: 1 }),
        faker.datatype.number({ min: 50000, max: 300000, precision: 1000 }),
        faker.datatype.number({ min: 1500, max: 4000, precision: 100 }),
        faker.internet.url()
      );
  });

  describe("Add PoliceLogEntry", () => {
    it("Should add new entry with all parameters to storage", async () => {
      const logEntriesBefore = await instance.getPoliceLogEntries(1);
      expect(logEntriesBefore.length).to.be.equal(0);
      const recordUri = faker.internet.url();
      var now = new Date();

      //Act
      await instance
        .connect(policeDepartmentAccount)
        .addPoliceLogEntry(1, recordUri);

      const logEntriesAfter = await instance.getPoliceLogEntries(1);
      expect(logEntriesAfter.length).to.be.equal(1);
      const logEntry = logEntriesAfter[0];

      var date = new Date(logEntry.timestamp * 1000);
      expect(date).to.be.greaterThan(now);
      expect(logEntry.principal).to.be.equal(policeDepartmentAccount.address);
      expect(logEntry.recordUri).to.be.equal(recordUri);
    });
  });
});
