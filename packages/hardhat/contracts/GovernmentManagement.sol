//SPDX-License-Identifier: MIT
pragma solidity =0.8.10;

import "./LifecycleAccessControl.sol";
import "./ManufacturerManagement.sol";
import "./ServiceFactoryManagement.sol";
import "./PoliceDepartmentManagement.sol";

/// @title Government Management
/// @author Andrei Zhozhin
/// @notice This contract control access to other capabilities for participants
abstract contract GovernmentManagement is
    LifecycleAccessControl,
    ManufacturerManagement,
    ServiceFactoryManagement,
    PoliceDepartmentManagement
{
    /// @notice Add new entity type and grant permissions
    /// @dev Function call specific method of particular entity abstract contract
    /// @param type_ type of the entity
    /// @param addr Address of new entity
    /// @param name Name of new entity
    /// @param metadataUri Metadata Uri that have all other information about entity
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

    // / @notice Updates entity type metadataUri
    // / @dev Function call specific method of particular entity abstract contract
    // / @param type_ type of the entity
    // / @param addr Address of new entity
    // / @param metadataUri Metadata Uri that have all other information about entity
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

    /// @notice Disables entity and revoke permissions
    /// @dev Method revoke permissions to execute capability methods and changes state of entity
    /// @dev Entity should be registered (checked in particular entity contract)
    /// @param type_ type of the entity
    /// @param addr Address of new entity
    function disable(EntityType type_, address addr)
        public
        only(GOVERNMENT)
    {
        if (type_==EntityType.MANUFACTURER){
            _suspendManufacturer(addr);
            revokeRole(MANUFACTURER, addr);
        } else if (type_==EntityType.SERVICE_FACTORY){
            _suspendServiceFactory(addr);
            revokeRole(SERVICE_FACTORY, addr);
        } else if (type_==EntityType.POLICE){
            _suspendPoliceDepartment(addr);
            revokeRole(POLICE, addr);
        }
    }

    /// @notice Enables entity and grant permissions
    /// @dev Method grant permissions to execute capability methods and changes state of entity
    /// @dev Entity should be registered (checked in particular entity contract)
    /// @param type_ type of the entity
    /// @param addr Address of new entity
    function enable(EntityType type_, address addr)
        public
        only(GOVERNMENT)
    {
        if (type_==EntityType.MANUFACTURER){
            _resumeManufacturer(addr);
            grantRole(MANUFACTURER, addr);
        } else if (type_==EntityType.SERVICE_FACTORY){
            _resumeServiceFactory(addr);
            grantRole(SERVICE_FACTORY, addr);
        } else if (type_==EntityType.POLICE){
            _resumePoliceDepartment(addr);
            grantRole(POLICE, addr);
        }
    }
}

