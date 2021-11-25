//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './EntityManagement.sol';

abstract contract ServiceFactoryManagement is EntityManagement{

    mapping(address => Entity) private _serviceFactories;
    mapping(uint256 => address) private _serviceFactoryIndex2Address;
    uint256 public serviceFactoryCount;

    function _addServiceFactory(
        address addr,
        string memory name,
        string memory metadataUri 
    ) internal {
        serviceFactoryCount = _addEntity(
            EntityType.MANUFACTURER,
            _serviceFactories,
            _serviceFactoryIndex2Address,
            serviceFactoryCount,
            addr,
            name,
            metadataUri
        );
    }

    function _updateServiceFactory(address addr, string memory metadataUri)
        internal
        exists(_serviceFactories, addr)
    {
        _updateEntity(EntityType.SERVICE_FACTORY, _serviceFactories, addr, metadataUri);
    }

    function _suspendServiceFactory(address addr)
        internal
        exists(_serviceFactories,addr)
    {
        _suspendEntity(EntityType.SERVICE_FACTORY, _serviceFactories, addr);
    }

    function _resumeServiceFactory(address addr)
        internal
        exists(_serviceFactories,addr)
    {
        _resumeEntity(EntityType.SERVICE_FACTORY, _serviceFactories, addr);
    }

    // function getServiceFactory(address addr)
    //     public
    //     view
    //     returns (Entity memory)
    // {
    //     return _getEntity(_serviceFactories, addr);
    // }

    function getServiceFactories()
        public
        view
        returns (Entity[] memory)
    {
        return _getEntities(_serviceFactories, _serviceFactoryIndex2Address, serviceFactoryCount);
    }
}
