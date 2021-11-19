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
        string metadataUri; // everything else should be stored off-chain
    }

    mapping(uint256 => Vehicle) private _tokenId2Vehicle;
    mapping(string => uint256) private _vin2TokenId;
    
    event VehicleManufactured(uint256 token, string vin);

    // This function should be called from outside, as it should be connected to minting process
    function _manufactureVehicle(uint256 tokenId, string memory vin, string memory make, string memory model, string memory color, uint32 year, uint32 maxMilleage, uint32 engineSize, string memory metadataUri) 
        internal 
    {
        Vehicle memory vehicle = Vehicle(tokenId, vin, make, model, color, year, maxMilleage, engineSize, metadataUri);
        _tokenId2Vehicle[tokenId] = vehicle;
        _vin2TokenId[vin] = tokenId;
        emit VehicleManufactured(tokenId, vin);
    }

    function getVehicleDetailsByTokenId(uint256 tokenId_)
        public
        view
        returns (uint256 tokenId, string memory vin, string memory make, string memory model, string memory color, uint32 year, uint32 maxMilleage, uint32 engineSize)
    {
      Vehicle memory vehicle = _tokenId2Vehicle[tokenId_];
      require(vehicle.tokenId != 0, "Vehicle does not exist");
      tokenId = vehicle.tokenId;
      vin = vehicle.vin;
      make = vehicle.make;
      model = vehicle.model;
      color = vehicle.color;
      year = vehicle.year;
      maxMilleage = vehicle.maxMilleage;
      engineSize = vehicle.engineSize;
    }

    function getVehicleDetailsByVin(string memory vin_)
        public
        view
        returns (uint256 tokenId, string memory vin, string memory make, string memory model, string memory color, uint32 year, uint32 maxMilleage, uint32 engineSize)
    {
      uint256 tokenId_ = _vin2TokenId[vin_];
      require(tokenId_!=0, "Vehicle does not exist");
      return getVehicleDetailsByTokenId(tokenId_);
    }

    function getTokenIdByVin(string memory vin) public view returns (uint256) {
        return _vin2TokenId[vin];
    }

    function _getMetadataUri(uint256 tokenId_) internal view returns (string memory){
        Vehicle memory vehicle = _tokenId2Vehicle[tokenId_];
        require(vehicle.tokenId != 0, "Vehicle does not exist");
        return vehicle.metadataUri;
    }

}
