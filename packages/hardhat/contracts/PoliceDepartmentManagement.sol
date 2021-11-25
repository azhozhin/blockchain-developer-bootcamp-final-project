//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './EntityManagement.sol';

abstract contract PoliceDepartmentManagement is EntityManagement{

    mapping(address => Entity) private _policeDepartments;
    mapping(uint256 => address) private _policeDepartment2Address;
    uint256 public policeDepartmentCount;

    function _addPoliceDepartment(
        address addr,
        string memory name,
        string memory metadataUri
    ) internal {
        policeDepartmentCount = _addEntity(
            EntityType.MANUFACTURER,
            _policeDepartments,
            _policeDepartment2Address,
            policeDepartmentCount,
            addr,
            name,
            metadataUri
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

    // function getPoliceDepartment(address addr)
    //     public
    //     view
    //     returns (Entity memory)
    // {
    //     return _getEntity(_policeDepartments, addr);
    // }

    function getPoliceDepartments()
        public
        view
        returns (Entity[] memory)
    {
        return _getEntities(_policeDepartments, _policeDepartment2Address, policeDepartmentCount);
    }
}
