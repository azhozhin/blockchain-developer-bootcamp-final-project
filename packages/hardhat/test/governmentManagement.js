const { ethers, artifacts } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const faker = require("faker");

use(solidity);

describe("Government management", async () => {
  let VehicleLifecycleToken;
  let instance;
  let owner;
  let govAccount;
  let manufacturerAccount;
  let serviceFactoryAccount;
  let policeDepartmentAccount;
  let addrs;

  var testCases = [
    {
      entityType: "Manufacturer",
      entityTypeId: 1,
      targetAccount: manufacturerAccount,
      getEntities: async () => instance.getManufacturers(),
      hasRole: (roles) => roles.isManufacturer,
    },
    {
      entityType: "ServiceFactory",
      entityTypeId: 2,
      targetAccount: serviceFactoryAccount,
      getEntities: async () => instance.getServiceFactories(),
      hasRole: (roles) => roles.isServiceFactory,
    },
    {
      entityType: "PoliceDepartment",
      entityTypeId: 3,
      targetAccount: policeDepartmentAccount,
      getEntities: async () => instance.getPoliceDepartments(),
      hasRole: (roles) => roles.isPolice,
    },
  ];

  function getTargetAccount(entityTypeId) {
    switch (entityTypeId) {
      case 1:
        return manufacturerAccount;
      case 2:
        return serviceFactoryAccount;
      case 3:
        return policeDepartmentAccount;
      default:
        throw `Unexpected entityTypeId: '${entityTypeId}'`;
    }
  }

  beforeEach(async () => {
    [
      owner,
      govAccount,
      manufacturerAccount,
      serviceFactoryAccount,
      policeDepartmentAccount,
      ...addrs
    ] = await ethers.getSigners();
    VehicleLifecycleToken = await ethers.getContractFactory(
      "VehicleLifecycleToken"
    );

    instance = await VehicleLifecycleToken.deploy();
    await instance.setAdminRole(govAccount.address);
  });

  // Run same tests for every entity type
  testCases.forEach((testCase) => {
    const entityTypeId = testCase.entityTypeId;

    describe(`Add Entity '${testCase.entityType}'`, () => {
      it(`Should add entity to internal storage`, async () => {
        const targetAccount = getTargetAccount(entityTypeId);
        let entities = await testCase.getEntities();
        expect(entities.length).to.be.equal(0);

        const name = faker.lorem.word();
        const url = faker.internet.url();

        // Act
        await instance
          .connect(govAccount)
          .add(entityTypeId, targetAccount.address, name, url);

        entities = await testCase.getEntities();
        expect(entities.length).to.be.equal(1);
        const entity = entities[0];
        expect(entity.name).to.be.equal(name);
        expect(entity.addr).to.be.equal(targetAccount.address);
        expect(entity.metadataUri).to.be.equal(url);
        expect(entity.state).to.be.equal(1);
      });

      it(`Should set correct permissions and emit event`, async () => {
        const name = faker.lorem.word();
        const url = faker.internet.url();
        const targetAccount = getTargetAccount(entityTypeId);

        // Act
        await expect(
          instance
            .connect(govAccount)
            .add(entityTypeId, targetAccount.address, name, url)
        )
          .to.emit(instance, "EntityAdded")
          .withArgs(entityTypeId, targetAccount.address, name, url);

        const result = await instance.getRoles(targetAccount.address);
        expect(testCase.hasRole(result)).to.be.true;
      });
    });

    describe(`Disable Entity '${testCase.entityType}'`, () => {
      it(`Should revoke role, change state, and emit event`, async () => {
        const targetAccount = getTargetAccount(entityTypeId);
        const name = faker.lorem.word();
        const url = faker.internet.url();
        await instance
          .connect(govAccount)
          .add(entityTypeId, targetAccount.address, name, url);

        let resultBefore = await instance.getRoles(targetAccount.address);
        expect(testCase.hasRole(resultBefore)).to.be.true;

        // Act
        await expect(
          await instance
            .connect(govAccount)
            .disable(entityTypeId, targetAccount.address)
        )
          .to.emit(instance, "EntitySuspended")
          .withArgs(entityTypeId, targetAccount.address, name);

        let resultAfter = await instance.getRoles(targetAccount.address);
        expect(testCase.hasRole(resultAfter)).to.be.false;
      });
    });

    describe(`Enable Entity '${testCase.entityType}'`, () => {
      it(`Should grant role, change state, and emit event`, async () => {
        const targetAccount = getTargetAccount(entityTypeId);
        const name = faker.lorem.word();
        const url = faker.internet.url();
        await instance
          .connect(govAccount)
          .add(entityTypeId, targetAccount.address, name, url);

        await instance
          .connect(govAccount)
          .disable(entityTypeId, targetAccount.address);
        let resultBefore = await instance.getRoles(targetAccount.address);
        expect(testCase.hasRole(resultBefore)).to.be.false;

        // Act
        await expect(
          await instance
            .connect(govAccount)
            .enable(entityTypeId, targetAccount.address)
        )
          .to.emit(instance, "EntityResumed")
          .withArgs(entityTypeId, targetAccount.address, name);

        let resultAfter = await instance.getRoles(targetAccount.address);
        expect(testCase.hasRole(resultAfter)).to.be.true;
      });
    });
  });
});
