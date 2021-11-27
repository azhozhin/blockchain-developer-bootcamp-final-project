const { ethers, artifacts } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const faker = require("faker");

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

    // TODO: magic constant!
    await instance
      .connect(govAccount)
      .add(1, manufacturerAccount.address, manufacturerName, manufacturerUri);
  });

  describe("ManufactureVehicle", () => {
    it("Should add new vehicle owned by manufacturer and emit event", async () => {
      const vin = faker.vehicle.vin();
      const make = faker.vehicle.manufacturer();
      const model = faker.vehicle.model();
      const color = faker.vehicle.color();
      const year = faker.datatype.number({
        min: 2000,
        max: 2021,
        precision: 1,
      });
      const maxMileage = faker.datatype.number({
        min: 50000,
        max: 300000,
        precision: 1000,
      });
      const engineSize = faker.datatype.number({
        min: 1500,
        max: 4000,
        precision: 100,
      });
      const tokenUri = faker.internet.url();
      const now = new Date();

      // Act
      await expect(
        instance
          .connect(manufacturerAccount)
          .manufactureVehicle(
            vin,
            make,
            model,
            color,
            year,
            maxMileage,
            engineSize,
            tokenUri
          )
      )
        .to.emit(instance, "VehicleManufactured")
        .withArgs(1, vin);

      const vehicle = await instance.getVehicleDetailsByTokenId(1);
      expect(vehicle.vin).to.be.equal(vin);
      expect(vehicle.make).to.be.equal(make);
      expect(vehicle.model).to.be.equal(model);
      expect(vehicle.color).to.be.equal(color);
      expect(vehicle.year).to.be.equal(year);
      expect(vehicle.maxMileage).to.be.equal(maxMileage);
      expect(vehicle.engineSize).to.be.equal(engineSize);
      const date = new Date(vehicle.timestamp * 1000);
      expect(date).to.be.greaterThan(now);

      const actualTokenUri = await instance.tokenURI(1);
      expect(actualTokenUri).to.be.equal(tokenUri);
    });

    it("Should not allow new vehicle with same vin", async () => {
      const vin = faker.vehicle.vin();
      // Act
      // first vehicle
      await instance.connect(manufacturerAccount).manufactureVehicle(
        vin,
        faker.vehicle.manufacturer(),
        faker.vehicle.model(),
        faker.vehicle.color(),
        faker.datatype.number({
          min: 2000,
          max: 2021,
          precision: 1,
        }),
        faker.datatype.number({
          min: 50000,
          max: 300000,
          precision: 1000,
        }),
        faker.datatype.number({
          min: 1500,
          max: 4000,
          precision: 100,
        }),
        faker.internet.url()
      );
      // second vehicle with same vin should throw
      await expect(
        instance.connect(manufacturerAccount).manufactureVehicle(
          vin,
          faker.vehicle.manufacturer(),
          faker.vehicle.model(),
          faker.vehicle.color(),
          faker.datatype.number({
            min: 2000,
            max: 2021,
            precision: 1,
          }),
          faker.datatype.number({
            min: 50000,
            max: 300000,
            precision: 1000,
          }),
          faker.datatype.number({
            min: 1500,
            max: 4000,
            precision: 100,
          }),
          faker.internet.url()
        )
      ).to.be.revertedWith("VIN is not unique");
    });
  });
});
