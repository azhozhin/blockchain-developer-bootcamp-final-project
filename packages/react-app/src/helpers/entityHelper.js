import slugify from "slugify";

export const entityType = {
  UNDEFINED: 0,
  MANUFACTURER: 1,
  SERVICE_FACTORY: 2,
  POLICE: 3,
};

export const getToggleEntityMethod = (writeContracts, entityType, state, targetAddr) => {
  const fun =
    state == 1
      ? writeContracts.VehicleLifecycleToken.disable(entityType, targetAddr)
      : writeContracts.VehicleLifecycleToken.enable(entityType, targetAddr);
  return fun;
};

export const executeMethod = async (tx, fun) => {
  const result = tx(fun, update => {
    console.log("📡 Transaction Update:", update);
    if (update && (update.status === "confirmed" || update.status === 1)) {
      console.log("Transaction " + update.hash + " finished!");
    }
  });
  console.log("awaiting metamask/web3 confirm result...", result);
  return result;
};

export const serializePoliceDepartmentMetadata = fields => {
  const obj = {
    name: fields.name,
    image: fields.imageUri,
    description: fields.description,
    external_uri: fields.externalUri,
    attributes: [
      {
        attr_type: "address_line",
        value: fields.addressLine,
      },
      {
        attr_type: "postal_code",
        value: fields.postalCode,
      },
      {
        attr_type: "country",
        value: fields.country,
      },
    ],
  };
  const name = "policeDepartment-" + slugify(fields.name);
  return [obj, name];
};
export const serializeManufacturerMetadata = obj => {};
export const serializeServiceFactoryMetadata = obj => {};

export const serializeVehicleMetadata = fields => {
  const obj = {
    name: fields.make + " " + fields.model,
    image: fields.imageUri,
    description: fields.description,
    external_uri: "",
    attributes: [
      {
        attr_type: "make",
        value: fields.make,
      },
      {
        attr_type: "model",
        value: fields.model,
      },
      {
        attr_type: "color",
        value: fields.color,
      },
      {
        attr_type: "year",
        value: fields.year,
      },
      {
        attr_type: "max_mileage",
        value: fields.maxMileage,
      },
      {
        attr_type: "engine_size",
        value: fields.engineSize,
      },
    ],
  };

  const name = "vehicle-" + slugify(fields.make) + "-" + slugify(fields.model) + "-" + fields.vin;
  return [obj, name];
};

export const deserializePoliceDepartmentMetadata = metadata => {};
export const deserializeManufacturerMetadata = metadata => {};
export const deserializeServiceFactoryMetadata = metadata => {};
