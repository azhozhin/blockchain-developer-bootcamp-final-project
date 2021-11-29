//SPDX-License-Identifier: MIT
pragma solidity =0.8.10;

import "./EntityManagement.sol";

/// @title Police Departments Management
/// @author Andrei Zhozhin
/// @notice This contract is used to manage PoliceDepartment entities
abstract contract PoliceDepartmentManagement is EntityManagement {
    mapping(address => Entity) private _policeDepartments;
    mapping(uint256 => address) private _policeDepartment2Address;
    uint256 public policeDepartmentCount;

    function _addPoliceDepartment(
        address addr,
        string memory name,
        string memory metadataUri
    ) internal {
        policeDepartmentCount = _addEntity(
            EntityType.POLICE,
            _policeDepartments,
            _policeDepartment2Address,
            policeDepartmentCount,
            addr,
            name,
            metadataUri
        );
    }

    function getPoliceDepartments() public view returns (Entity[] memory) {
        return
            _getEntities(
                _policeDepartments,
                _policeDepartment2Address,
                policeDepartmentCount
            );
    }

    function _updatePoliceDepartment(address addr, string memory metadataUri)
        internal
        exists(_policeDepartments, addr)
    {
        _updateEntity(EntityType.POLICE, _policeDepartments, addr, metadataUri);
    }

    function _suspendPoliceDepartment(address addr)
        internal
        exists(_policeDepartments, addr)
    {
        _suspendEntity(EntityType.POLICE, _policeDepartments, addr);
    }

    function _resumePoliceDepartment(address addr)
        internal
        exists(_policeDepartments, addr)
    {
        _resumeEntity(EntityType.POLICE, _policeDepartments, addr);
    }
}
