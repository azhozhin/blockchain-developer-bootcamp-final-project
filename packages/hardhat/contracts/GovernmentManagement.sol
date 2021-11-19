//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LifecycleAccessControl.sol";
import "./ServiceFactoryManagement.sol";
import "./ManufacturerManagement.sol";
import "./PoliceDepartmentManagement.sol";

abstract contract GovernmentManagement is
    LifecycleAccessControl,
    ServiceFactoryManagement,
    ManufacturerManagement,
    PoliceDepartmentManagement
{
    function addServiceFactory(
        address addr,
        string memory name,
        string memory addressLine,
        string memory postalCode
    ) public only(GOVERNMENT) {
        _addServiceFactory(addr, name, addressLine, postalCode);
        grantRole(SERVICE_FACTORY, addr);
        emit ServiceFactoryAdded(addr, name);
    }

    function addManufacturer(address addr, string memory name)
        public
        only(GOVERNMENT)
    {
        _addManufacturer(addr, name);
        grantRole(MANUFACTURER, addr);
        emit ManufacturerAdded(addr, name);
    }

    function addPoliceDepartment(
        address addr,
        string memory name,
        string memory metadataUri
    ) public only(GOVERNMENT) {
        _addPoliceDepartment(addr, name, metadataUri);
        grantRole(POLICE, addr);
        emit PoliceDepartmentAdded(addr, name);
    }

    // Government can revoke license for existing service factory
    function disableServiceFactory(address addr) public only(GOVERNMENT) {
        getServiceFactory(addr); // implicitly check for serviceFactory existance
        revokeRole(SERVICE_FACTORY, addr);
        emit ServiceFactorySuspended(addr);
    }

    // Government can issue new license for existing service factory
    function enableServiceFactory(address addr) public only(GOVERNMENT) {
        getServiceFactory(addr); // implicitly check for serviceFactory existance
        grantRole(SERVICE_FACTORY, addr);
        emit ServiceFactoryResumed(addr);
    }

    // Government can revoke license for existing manufacturer
    function disableManufacturer(address addr) public only(GOVERNMENT) {
        getManufacturer(addr); // implicitly check for manufacturer existance
        revokeRole(MANUFACTURER, addr);
        emit ManufacturerSuspended(addr);
    }

    // Government can issue new license for existing manufacturer
    function enableManufacturer(address addr) public only(GOVERNMENT) {
        getManufacturer(addr); // implicitly check for manufacturer existance
        grantRole(MANUFACTURER, addr);
        emit ManufacturerResumed(addr);
    }
}
