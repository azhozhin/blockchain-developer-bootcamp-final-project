//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LifecycleAccessControl.sol";

abstract contract PoliceDepartmentManagement {

    struct PoliceDepartment {
        address addr;
        string name;
        string metadataUri; // everything else is off-chain
    }

    mapping(address => PoliceDepartment) private _policeDepartments;
    mapping(uint256 => address) private _policeDepartment2Address;
    uint256 public policeDepartmentCount;

    event PoliceDepartmentAdded(address addr, string name);
    event PoliceDepartmentSuspended(address addr);
    event PoliceDepartmentResumed(address addr);

    function _addPoliceDepartment(address addr, string memory name, string memory metadataUri)
        internal
    {
        _policeDepartments[addr] = PoliceDepartment(addr, name, metadataUri);
        policeDepartmentCount++;
    }

    function getPoliceDepartment(address addr) public view returns (PoliceDepartment memory) {
        PoliceDepartment memory policeDepartment = _policeDepartments[addr];
        require(policeDepartment.addr != address(0), "PoliceDepartment does not exist");
        return policeDepartment;
    }

    function getPoliceDepartments() public view returns (PoliceDepartment[] memory){
        PoliceDepartment[] memory result = new PoliceDepartment[](policeDepartmentCount);
        for (uint i=0; i<policeDepartmentCount; i++){
            result[i] = _policeDepartments[_policeDepartment2Address[i]];
        }
        return result;
    }
}