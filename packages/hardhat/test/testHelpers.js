const faker = require("faker");

const entityType = {
  UNDEFINED: 0,
  MANUFACTURER: 1,
  SERVICE_FACTORY: 2,
  POLICE: 3,
};

const entityState = {
  SUSPENDED: 0,
  ACTIVE: 1,
};

const errorMessages = {
  NOT_ALLOWED: "NA",
  NOT_FOUND: "NF",
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

module.exports = {
  entityType,
  entityState,
  errorMessages,
  createVehicle,
  manufactureVehicle,
};
