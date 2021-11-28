const { ethers, artifacts } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const faker = require("faker");

use(solidity);

describe("Service Factory Capability", () => {
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
    [
      owner,
      govAccount,
      manufacturerAccount,
      serviceFactoryAccount,
      ...other
    ] = await ethers.getSigners();

    instance = await VehicleLifecycleToken.deploy();
    await instance.setAdminRole(govAccount.address);

    // TODO: magic constant!
    await instance
      .connect(govAccount)
      .add(1, manufacturerAccount.address, faker.lorem.word(), faker.internet.url());

    // TODO: magic constant!
    await instance
      .connect(govAccount)
      .add(
        2,
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
      const mileage = faker.datatype.number({ min: 2000, max: 20000, precision: 1 });
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

    it("Should not allow to add new entry for disabled service factory",async ()=>{

    });

    it("Should be allowed to add new entry for disabled and enabled service factory",async ()=>{

    })
  });
});

// TODO: duplicate
const manufactureVehicle = async (instance, account, vehicle) => {
    return instance
      .connect(account)
      .manufactureVehicle(
        vehicle.vin,
        vehicle.make,
        vehicle.model,
        vehicle.color,
        vehicle.year,
        vehicle.maxMileage,
        vehicle.engineSize,
        vehicle.tokenUri
      );
  };
  
  const createVehicle = (vin = undefined) => {
    return {
      vin: vin ? vin : faker.vehicle.vin(),
      make: faker.vehicle.manufacturer(),
      model: faker.vehicle.model(),
      color: faker.vehicle.color(),
      year: faker.datatype.number({
        min: 2000,
        max: 2021,
        precision: 1,
      }),
      maxMileage: faker.datatype.number({
        min: 50000,
        max: 300000,
        precision: 1000,
      }),
      engineSize: faker.datatype.number({
        min: 1500,
        max: 4000,
        precision: 100,
      }),
      tokenUri: faker.internet.url(),
    };
  };
  