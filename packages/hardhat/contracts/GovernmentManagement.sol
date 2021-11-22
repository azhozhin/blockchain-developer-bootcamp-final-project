//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LifecycleAccessControl.sol";
import "./ManufacturerManagement.sol";
import "./ServiceFactoryManagement.sol";
import "./PoliceDepartmentManagement.sol";

abstract contract GovernmentManagement is
    LifecycleAccessControl,
    ManufacturerManagement,
    ServiceFactoryManagement,
    PoliceDepartmentManagement
{
    
    function add(EntityType type_, address addr, string memory name, string memory metadataUri)
        public
        only(GOVERNMENT)
    {
        if (type_==EntityType.MANUFACTURER){
            _addManufacturer(addr, name, metadataUri);
            grantRole(MANUFACTURER, addr);    
        } else if (type_==EntityType.SERVICE_FACTORY){
            _addServiceFactory(addr, name, metadataUri);
            grantRole(SERVICE_FACTORY, addr);    
        } else if (type_==EntityType.POLICE){
            _addPoliceDepartment(addr, name, metadataUri);
            grantRole(POLICE, addr);
        }
    }

    // function update(EntityType type_, address addr, string memory metadataUri)
    //     public
    //     only(GOVERNMENT)
    // {
    //     if (type_==EntityType.MANUFACTURER){
    //         _updateManufacturer(addr, metadataUri);
    //     } else if (type_==EntityType.SERVICE_FACTORY){
    //         _updateServiceFactory(addr, metadataUri);
    //     } else if (type_==EntityType.POLICE){
    //         _updatePoliceDepartment(addr, metadataUri);
    //     }
    // }

    function disable(EntityType type_, address addr)
        public
        only(GOVERNMENT)
    {
        if (type_==EntityType.MANUFACTURER){
            revokeRole(MANUFACTURER, addr);
            _suspendManufacturer(addr);
        } else if (type_==EntityType.SERVICE_FACTORY){
            revokeRole(SERVICE_FACTORY, addr);
            _suspendServiceFactory(addr);
        } else if (type_==EntityType.POLICE){
            revokeRole(POLICE, addr);
            _suspendPoliceDepartment(addr);
        }
    }

    function enable(EntityType type_, address addr)
        public
        only(GOVERNMENT)
    {
        if (type_==EntityType.MANUFACTURER){
            grantRole(MANUFACTURER, addr);
            _resumeManufacturer(addr);
        } else if (type_==EntityType.SERVICE_FACTORY){
            grantRole(SERVICE_FACTORY, addr);
            _resumeServiceFactory(addr);
        } else if (type_==EntityType.POLICE){
            grantRole(POLICE, addr);
            _resumePoliceDepartment(addr);
        }
    }
}

