import slugify from "slugify";
import axios from "axios";

export const entityType = {
  UNDEFINED: 0,
  MANUFACTURER: 1,
  SERVICE_FACTORY: 2,
  POLICE: 3,
};

export const executeMethod = async (tx, fun, onSuccess, onError) => {
  const result = tx(fun, update => {
    console.log("📡 Transaction Update:", update);
    if (update && (update.status === "confirmed" || update.status === 1)) {
      onSuccess && onSuccess(update);
    } else {
      onError && onError(update);
    }
  });
  //console.log("awaiting metamask/web3 confirm result...", result);
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

export const deserializePoliceDepartmentMetadata = (el, metadata) => {
  const attrs = metadata.attributes
    ? Object.assign({}, ...metadata.attributes.map(x => ({ [x.attr_type]: x.value })))
    : {};
  const obj = {
    addr: el.addr,
    name: el.name,
    state: el.state,
    metadataUri: el.metadataUri,
    imageUri: metadata.image,
    description: metadata.description,
    externalUri: metadata.external_uri,
    address: {
      addressLine: attrs.address_line,
      postalCode: attrs.postal_code,
      country: attrs.country,
    },
  };
  return obj;
};

export const deserializeManufacturerMetadata = (el, metadata) => {
  const attrs = Object.assign({}, ...metadata.attributes.map(x => ({ [x.attr_type]: x.value })));
  const obj = {
    addr: el.addr,
    name: el.name,
    state: el.state,
    metadataUri: el.metadataUri,
    imageUri: metadata.image,
    description: metadata.description,
    externalUri: metadata.external_uri,
  };
  return obj;
};

export const deserializeServiceFactoryMetadata = (data, metadata) => {
  const attrs = Object.assign({}, ...metadata.attributes.map(x => ({ [x.attr_type]: x.value })));
  const obj = {
    addr: data.addr,
    name: data.name,
    state: data.state,
    metadataUri: data.metadataUri,
    imageUri: metadata.image,
    description: metadata.description,
    externalUri: metadata.external_uri,
    address: {
      addressLine: attrs.address_line,
      postalCode: attrs.postal_code,
      country: attrs.country,
    },
  };
  return obj;
};

export const deserializeVehicleMetadata = (data, metadata) => {
  const attrs = Object.assign({}, ...metadata.attributes.map(x => ({ [x.attr_type]: x.value })));
  const obj = {
    tokenId: data.tokenId.toString(),
    vin: data.vin,
    make: data.make,
    model: data.model,
    color: data.color,
    year: data.year,
    maxMileage: data.maxMileage,
    engineSize: data.engineSize,
    imageUri: metadata.image,
    description: metadata.description,
    externalUri: metadata.externalUri,
  };
  return obj;
};

export const loadEntities = async (entityList, deserialize) => {
  const metadataRequests = [];
  const metadataContents = [];

  entityList.forEach((el, i) => {
    metadataRequests.push(
      axios.get(el.metadataUri).then(function (res) {
        metadataContents[i] = res.data;
      }),
    );
  });

  await Promise.all(metadataRequests);

  const entities = [];
  const addr2index = {};
  entityList.forEach((entity, i) => {
    const deserializedEntity = deserialize(entity, metadataContents[i]);
    entities.push(deserializedEntity);
    addr2index[deserializedEntity.addr] = i;
  });
  return [entities, addr2index];
};
