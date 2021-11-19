//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

abstract contract ManufacturerManagement {

    struct Manufacturer {
        address addr;
        string name;
    }

    mapping(address => Manufacturer) private _manufacturers;
    mapping(uint256 => address) private _manufacturerIndex2Address;
    uint256 public manufacturerCount;

    event ManufacturerAdded(address addr, string name);
    event ManufacturerSuspended(address addr);
    event ManufacturerResumed(address addr);

    function _addManufacturer(address addr, string memory name)
        internal
    {
        _manufacturers[addr] = Manufacturer(addr, name);
        manufacturerCount++;
    }

    function getManufacturer(address addr) public view returns (Manufacturer memory) {
        Manufacturer memory manufacturer = _manufacturers[addr];
        require(manufacturer.addr != address(0), "Manufacturer does not exist");
        return manufacturer;
    }

    function getManufacturers() public view returns (Manufacturer[] memory){
        Manufacturer[] memory result = new Manufacturer[](manufacturerCount);
        for (uint i=0; i<manufacturerCount; i++){
            result[i] = _manufacturers[_manufacturerIndex2Address[i]];
        }
        return result;
    }
}