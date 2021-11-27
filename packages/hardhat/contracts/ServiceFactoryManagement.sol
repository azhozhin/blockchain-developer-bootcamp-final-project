//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./EntityManagement.sol";

/// @title Service Factory Management
/// @author Andrei Zhozhin
/// @notice This contract is used to manage ServiceFactory entities
abstract contract ServiceFactoryManagement is EntityManagement {
    mapping(address => Entity) private _serviceFactories;
    mapping(uint256 => address) private _serviceFactoryIndex2Address;
    uint256 public serviceFactoryCount;

    function _addServiceFactory(
        address addr,
        string memory name,
        string memory metadataUri
    ) internal {
        serviceFactoryCount = _addEntity(
            EntityType.SERVICE_FACTORY,
            _serviceFactories,
            _serviceFactoryIndex2Address,
            serviceFactoryCount,
            addr,
            name,
            metadataUri
        );
    }

    function getServiceFactories() public view returns (Entity[] memory) {
        return
            _getEntities(
                _serviceFactories,
                _serviceFactoryIndex2Address,
                serviceFactoryCount
            );
    }

    function _updateServiceFactory(address addr, string memory metadataUri)
        internal
        exists(_serviceFactories, addr)
    {
        _updateEntity(
            EntityType.SERVICE_FACTORY,
            _serviceFactories,
            addr,
            metadataUri
        );
    }

    function _suspendServiceFactory(address addr)
        internal
        exists(_serviceFactories, addr)
    {
        _suspendEntity(EntityType.SERVICE_FACTORY, _serviceFactories, addr);
    }

    function _resumeServiceFactory(address addr)
        internal
        exists(_serviceFactories, addr)
    {
        _resumeEntity(EntityType.SERVICE_FACTORY, _serviceFactories, addr);
    }
}
