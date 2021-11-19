//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

abstract contract LifecycleAccessControl is AccessControl {

    struct Permissions {
        bool isGovernment;
        bool isManufacturer;
        bool isServiceFactory;
        bool isPolice;
    }

    bytes32 public constant GOVERNMENT = DEFAULT_ADMIN_ROLE;
    bytes32 public constant MANUFACTURER = keccak256("MANUFACTURER");
    bytes32 public constant SERVICE_FACTORY = keccak256("SERVICE_FACTORY");
    bytes32 public constant POLICE = keccak256("POLICE");

    modifier only(bytes32 role) {
        require(hasRole(role, msg.sender), "Caller is not authorized for this operation");
        _;
    }

    function getRoles(address addr)
        public
        view
        returns (Permissions memory)
    {
        Permissions memory result = Permissions(
            hasRole(GOVERNMENT, addr),
            hasRole(MANUFACTURER, addr),
            hasRole(SERVICE_FACTORY, addr),
            hasRole(POLICE, addr)
        );
        return result;
    }
}
