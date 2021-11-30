# Solution Architecture

The application leverages blockchain (all sensible data about vehicles and participants) and IPFS (metadata + images).

Ethereum blockchain allow distributed and controlled environment to store important information without worrying that data could be amended/faked. Critical data about vehicle is stored on-chain:

- vin - vehicle identification number (assigned by manufacturer)
- make - manufacturer name
- model - vehicle model (assigned by manufacturer)
- color - color (assigned by manufacturer)
- year - year of vehicle issue (assigned by manufacturer)
- maxMileage - max mileage (assigned by manufacturer)
- engineSize - engine size in cubic centimeters (assigned by manufacturer)
- tokenUri - IPFS link to metadata json with `ERC721Metadata` schema (assigned by manufacturer)

Due to expense of the blockchain storage it was decided to move everything else off-chain and store in immutable way on IPFS to avoid data loss and eliminate possibility of forgery. So smart contract is enforcing that all references to external storage should be **IPFS links**.

## Implementation details

Current implementation of smart contract have 4 distinct roles:

- Government
- Manufacturer
- Service Factory
- Police Department

If someone does not have explicit role defined it has implicit **readonly role** with ability to **transfer** owned vehicles.

Every role has its own set of methods that are allowed to be executed, please check [Smart Contracts](smart-contracts.md).

## Smart contract class diagram

![Class diagram](images/class-diagram.png)

## Immutable metadata

Every entity in the project have some attributed stored on chain and off-chain metadata stored on IPFS.
All *managed entities* (Manufacturers, Service Factories, and Police Departments) have standard set of attributes from `Entity` struct:

```javascript
struct Entity {
    address addr;       // participant address
    string name;        // participant name
    State state;        // participant state
    string metadataUri; // everything else is off-chain in metadata JSON
}
```

### Manufacturers

Example metadata for manufacturer (stored on IPFS).
Please note that `image` attribute is pointing also to IPFS - this is desirable but not enforced.

```json
{
  "name": "Porsche",
  "image": "https://ipfs.io/ipfs/QmPAYiSEeggcPBAwUqrNWvPHYpJKKwVxFGJhUSGKJVFWTA",
  "description": "Dr.-Ing. h.c. F. Porsche AG, usually shortened to Porsche, is a German automobile manufacturer specializing in high-performance sports cars, SUVs and sedans, headquartered in Stuttgart, Baden-Württemberg, Germany",
  "external_uri": "https://www.kia.com/us/en",
  "attributes": [
  ]
}
```

### Service Factories

Example metadata for service factory (stored on IPFS). An `image` attribute is desirable to point to IPFS resource.

```json
{
  "name": "Manhattan Motorcars",
  "image": "https://ipfs.io/ipfs/Qme7gGfHBy2A1TV7vXiwRJqS9VPxCYxEt2uMctPNctDz4w",
  "description": "Manhattan Motorcars is a certified Porsche dealer serving drivers throughout New York and the surrounding areas",
  "external_uri": "https://www.manhattanmotorcarsporsche.com/",
  "attributes": [
    {
      "attr_type": "address_line",
      "value": "711 Eleventh Ave, New York"
    },
    {
      "attr_type": "postal_code",
      "value": "NY 10019"
    },
    {
      "attr_type": "country",
      "value": "United States"
    }   
  ]
}
```

Please note that it has extra `attributes`.

### Police Departments

Example metadata for police department (stored on IPFS).

```json
{
  "name": "New York City Police Department",
  "image": "https://ipfs.io/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco/I/m/Patch_of_the_New_York_City_Police_Department.svg.png",
  "description": "The New York City Police Department (NYPD or NYCPD), officially the City of New York Police Department, is the largest municipal police force in the United States.",
  "external_uri": "https://www1.nyc.gov/site/nypd/index.page",
  "attributes": [
    {
      "attr_type": "address_line",
      "value": "1 Police Plaza Path, New York"
    },
    {
      "attr_type": "postal_code",
      "value": "NY 10038"
    },
    {
      "attr_type": "country",
      "value": "United States"
    }   
  ]
}
```

### Vehicle
