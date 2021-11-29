//SPDX-License-Identifier: MIT
pragma solidity =0.8.10;

/// @title Manufacturer Capabilty
/// @author Andrei Zhozhin
/// @notice This contract holds main functions related to vehicle creation process
abstract contract ManufacturerCapability {
    struct Vehicle {
        uint256 tokenId;
        string vin;
        string make;
        string model;
        string color;
        uint32 year;
        uint32 maxMileage;
        uint32 engineSize; // volume in cubic centimiters
        uint256 timestamp;
    }

    mapping(uint256 => Vehicle) private _tokenId2Vehicle;
    mapping(string => uint256) private _vin2TokenId;

    event VehicleManufactured(uint256 token, string vin);

    /// @dev This function should be called from outside, as it should be connected to minting process
    function _manufactureVehicle(
        uint256 tokenId,
        string memory vin,
        string memory make,
        string memory model,
        string memory color,
        uint32 year,
        uint32 maxMileage,
        uint32 engineSize
    ) internal {
        uint256 id = _vin2TokenId[vin];
        require(id == 0, "VIN is not unique");

        Vehicle memory vehicle = Vehicle(
            tokenId,
            vin,
            make,
            model,
            color,
            year,
            maxMileage,
            engineSize,
            block.timestamp
        );
        _tokenId2Vehicle[tokenId] = vehicle;
        _vin2TokenId[vin] = tokenId;
        emit VehicleManufactured(tokenId, vin);
    }

    /// @notice Return information about vehicle by TokenId
    /// @param tokenId Id to lookup
    /// @return Vehicle structure with vehicle details
    function getVehicleDetailsByTokenId(uint256 tokenId)
        public
        view
        returns (Vehicle memory)
    {
        Vehicle memory vehicle = _tokenId2Vehicle[tokenId];
        require(vehicle.tokenId != 0, "Not Found"); // NF = Vehicle does not exist
        return vehicle;
    }

    /// @notice Return information about vehicle by VIN
    /// @param vin VIN to lookup
    /// @return Vehicle structure with vehicle details
    function getVehicleDetailsByVin(string memory vin)
        public
        view
        returns (Vehicle memory)
    {
        uint256 tokenId = _vin2TokenId[vin];
        require(tokenId != 0, "Not Found"); // NF = Vehicle does not exist
        return getVehicleDetailsByTokenId(tokenId);
    }
}
