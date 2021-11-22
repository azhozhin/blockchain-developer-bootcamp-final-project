//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

abstract contract ManufacturerCapability {

    struct Vehicle {
        uint256 tokenId;
        string vin;
        string make;
        string model;
        string color;
        uint32 year;
        uint32 maxMilleage;
        uint32 engineSize;  // volume in cubic centimiters
    }

    mapping(uint256 => Vehicle) private _tokenId2Vehicle;
    mapping(string => uint256) private _vin2TokenId;
    
    event VehicleManufactured(uint256 token, string vin);

    // This function should be called from outside, as it should be connected to minting process
    function _manufactureVehicle(uint256 tokenId, string memory vin, string memory make, string memory model, string memory color, uint32 year, uint32 maxMilleage, uint32 engineSize) 
        internal 
    {
        Vehicle memory vehicle = Vehicle(tokenId, vin, make, model, color, year, maxMilleage, engineSize);
        _tokenId2Vehicle[tokenId] = vehicle;
        _vin2TokenId[vin] = tokenId;
        emit VehicleManufactured(tokenId, vin);
    }

    function getVehicleDetailsByTokenId(uint256 tokenId_)
        public
        view
        returns (Vehicle memory)
    {
      Vehicle memory vehicle = _tokenId2Vehicle[tokenId_];
      require(vehicle.tokenId != 0, "NF"); // NF = Vehicle does not exist
      return vehicle;
    }

    function getVehicleDetailsByVin(string memory vin_)
        public
        view
        returns (Vehicle memory)
    {
      uint256 tokenId_ = _vin2TokenId[vin_];
      require(tokenId_!=0, "NF"); // NF = Vehicle does not exist
      return getVehicleDetailsByTokenId(tokenId_);
    }

    function getTokenIdByVin(string memory vin) public view returns (uint256) {
        return _vin2TokenId[vin];
    }

}
