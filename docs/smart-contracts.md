# Smart contracts

## Smart contract structure

All contract files could be found in `packages/hardhat/contracts` folder.
Contract is divided in several parts, each part is responsible for its own area.
Common logic for 3 entities (Manufacturers, ServiceFactories, PoliceDepartments) is extracted to `EntityManagement.sol` class to keep contract size under control. Also there are `*Capability.sol` and `*Management.sol` parts that are responsible for main role features and role management respectively.

Please note that there is no `GovernmentCapability.sol` - Government is only register participants and enable/disable their access, but it does not touch vehicles itself.

| Filename                         | Description                            |
| :------------------------------- | :------------------------------------- |
| `VehicleLifecycleToken.sol`      | Main contract / entry point            |
| `EntityManagement.sol`           | Common entity management logic         |
| `GovernmentManagement.sol`       | Add, Enable/Disable participants       |
| `LifecycleAccessControl.sol`     | Roles definition + service functions   |
| `ManufacturerCapability.sol`     | ManufactureVehicle + service functions |
| `PoliceDepartmentCapability.sol` | AddPoliceLogEntry + service functions  |
| `ServiceFactoryCapability.sol`   | AddServiceLogEntry + service functions |
| `ManufacturerManagement.sol`     | entity management                      |
| `PoliceDepartmentManagement.sol` | entity management                      |
| `ServiceFactoryManagement.sol`   | entity management                      |

To optimize contract size in future all `*Capabilities` could be converted to separate contracts, so main contract would delegate calls to capability contracts.

## Smart contract class diagram

![Class diagram](images/class-diagram.png)

## Design patterns

There are several design patterns used in this project:

- Inheritance and Interfaces (**openzeppelin** implementations are used widely)
  - `ERC721URIStorage` - base contract implementation for ERC721 (used for NFT metadata storage + media links)
  - `ERC721Enumerable` - base contract implementation for ERC721 (used to simplify UI)
  - `Ownable` - access control for contract ownership
  - `Counters` - tracking of number of issued tokens
  - `AccessControl` - role based access control for participants (Government, Manufacturers, ServiceFactories, PoliceDepartments)
- Access Control Design Patterns
  - `Ownable` - smart contract ownership
  - `AccessControl` - role based access control for participants

For simplicity all capabilities are implemented as abstract contracts (as final smart contract size fits into threshold), but it is possible to convert them into standalone smart contracts and implement inter-contract communication to allow independent development and deployment of different capabilities while preserving main contract immutable and owning the state.

## Security measures

All public methods are protected by security modifiers related to role or ownership.
Ownership is separated from role model.

Owner could be a deployer (or ownership could be transferred to another owner using `transferOwnership` method) and it can assign first `admin` (Government) that can in turn create other participants.

Roles are assigned explicitly for all participants using `setAdmin(addr)` method allowed only for **owner**, or using `add(entityType, addr, name)` allowed for **Government** role.

## Commentaries

All public methods of smart contracts are documented according to [NatSpec](https://docs.soliditylang.org/en/latest/natspec-format.html).

## Tests

All smart contract functionality is covered with tests.

To run the tests execute the following command from the root of repository:

```bash
yarn test
```

## Smart contract Methods

There are 4 different entity types (while only 3 of them are used):

```java
enum EntityType {
  UNDEFINED,
  MANUFACTURER,
  SERVICE_FACTORY,
  POLICE
}
```

### Government methods

Government authority could control access to the system for 3 types of participants: Manufacturers, Service Factories, Police Departments, see `EntityType`. For every method entity type should be supplied.

- `add(entityType, addr, name, metadataUri)` - add new entity to internal storage and grant appropriate role, `metadataUri` should be IPFS link (enforced)
- `disable(entityType, addr)` - disable entity and revoke role (it is not deleting entity)
- `enable(entityType, addr)` - enable entity and grant role

All methods are protected by `role(GOVERNMENT)`.

### Manufacturer methods

- `manufactureVehicle(vin, make, model, color, year, maxMileage, engineSize, tokenUri)` - creates new vehicle using attributes supplied to the function. This method is protected by `role(MANUFACTURER)`
- `getManufacturers()` - returns list of all manufacturers
- `getManufacturer(addr)` - return single manufacturer by address

### Service Factory methods

- `addServiceLogEntry(tokenId, mileage, recordUri)` - add new service log entry, `recordUri` should be IPFS link (enforced), method protected by `role(SERVICE_FACTORY)`
- `getServiceLogEntries(tokenId)` - return list of all service log entries for given tokenId

### Police Department methods

- `addPoliceLogEntry(tokenId, recordUri)` - add new police log record, `recordUri` should be IPFS link (enforced), method protected by `role(POLICE)`
- `getPoliceLogEntries(tokenId)` - return list of all police log entries for given tokenId
