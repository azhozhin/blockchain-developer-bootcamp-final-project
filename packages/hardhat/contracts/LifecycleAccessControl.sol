//SPDX-License-Identifier: MIT
pragma solidity =0.8.10;

import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title Entity access control
/// @author Andrei Zhozhin
/// @notice This contract holds participant role definitions and service functions
/// @dev as this contract inherits AccessControl it might expose more methods than expected
abstract contract LifecycleAccessControl is AccessControl {

    struct Permissions {
        bool isGovernment;
        bool isManufacturer;
        bool isServiceFactory;
        bool isPolice;
    }

    /// @notice To simplify things GOVERNMENT is DEFAULT_ADMIN
    /// @dev Admin role is required to be able to grant and revoke permissions
    bytes32 public constant GOVERNMENT = DEFAULT_ADMIN_ROLE;
    bytes32 public constant MANUFACTURER = keccak256("MANUFACTURER");
    bytes32 public constant SERVICE_FACTORY = keccak256("SERVICE_FACTORY");
    bytes32 public constant POLICE = keccak256("POLICE");

    modifier only(bytes32 role) {
        require(hasRole(role, msg.sender), "Not Allowed"); //  Caller is not authorized for this operation
        _;
    }

    /// @notice Returns the amount of leaves the tree has
    /// @dev This is a helper method for UI only
    /// @param addr Address of participant to check permissions
    /// @return Pemissions structure with role flags
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
