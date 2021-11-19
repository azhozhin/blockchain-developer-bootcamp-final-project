//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LifecycleAccessControl.sol";

abstract contract ServiceFactoryManagement {

    struct ServiceFactory {
        address addr;
        string name;
        string addressLine;
        string postalCode;
    }

    mapping(address => ServiceFactory) private _serviceFactories;
    mapping(uint256 => address) private _serviceFactoryIndexe2Address;
    uint256 public serviceFactoryCount;

    event ServiceFactoryAdded(address addr, string name);
    event ServiceFactorySuspended(address addr);
    event ServiceFactoryResumed(address addr);

    function _addServiceFactory(address addr, string memory name, string memory addressLine, string memory postalCode)
        internal
    {
        _serviceFactories[addr] = ServiceFactory(addr, name, addressLine, postalCode);
        _serviceFactoryIndexe2Address[serviceFactoryCount] = addr;
        
        serviceFactoryCount++;
    }

    function getServiceFactory(address addr) public view returns (ServiceFactory memory) {
        ServiceFactory memory serviceFactory = _serviceFactories[addr];
        require(serviceFactory.addr != address(0), "ServiceFactory does not exist");
        return serviceFactory;
    }

    function getServiceFactories() public view returns (ServiceFactory[] memory){
        ServiceFactory[] memory result = new ServiceFactory[](serviceFactoryCount);
        for (uint i=0; i<serviceFactoryCount; i++){
            result[i] = _serviceFactories[_serviceFactoryIndexe2Address[i]];
        }
        return result;
    }

}