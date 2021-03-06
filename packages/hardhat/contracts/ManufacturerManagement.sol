//SPDX-License-Identifier: MIT
pragma solidity =0.8.10;

import "./EntityManagement.sol";

/// @title Manufacturer Management
/// @author Andrei Zhozhin
/// @notice This contract is used to manage Manufacturer entities
abstract contract ManufacturerManagement is EntityManagement {
    mapping(address => Entity) private _manufacturers;
    mapping(uint256 => address) private _manufacturerIndex2Address;
    uint256 public manufacturerCount;

    function _addManufacturer(
        address addr,
        string memory name,
        string memory metadataUri
    ) internal {
        manufacturerCount = _addEntity(
            EntityType.MANUFACTURER,
            _manufacturers,
            _manufacturerIndex2Address,
            manufacturerCount,
            addr,
            name,
            metadataUri
        );
    }

    function getManufacturers() public view returns (Entity[] memory) {
        return
            _getEntities(
                _manufacturers,
                _manufacturerIndex2Address,
                manufacturerCount
            );
    }

    function getManufacturer(address addr)
        public
        view
        returns (Entity memory)
    {
        return _manufacturers[addr];
    }

    function _updateManufacturer(address addr, string memory metadataUri)
        internal
        exists(_manufacturers, addr)
    {
        _updateEntity(
            EntityType.MANUFACTURER,
            _manufacturers,
            addr,
            metadataUri
        );
    }

    function _suspendManufacturer(address addr)
        internal
        exists(_manufacturers, addr)
    {
        _suspendEntity(EntityType.MANUFACTURER, _manufacturers, addr);
    }

    function _resumeManufacturer(address addr)
        internal
        exists(_manufacturers, addr)
    {
        _resumeEntity(EntityType.MANUFACTURER, _manufacturers, addr);
    }
}
