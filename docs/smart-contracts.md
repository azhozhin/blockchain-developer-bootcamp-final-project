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

## Commentaries

All public methods of smart contracts are documented according to [NatSpec](https://docs.soliditylang.org/en/latest/natspec-format.html).

## Tests

All smart contract functionality is covered with tests.

To run the tests execute the following command from the root of repository:

```bash
yarn test
```

## Smart contract Methods

### Government methods

- a
- b

### Manufacturer methods

- a
- b

### Service Factory methods

- a
- b

### Police Department methods

- a
- b
