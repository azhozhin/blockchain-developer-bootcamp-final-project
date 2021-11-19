//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "./GovernmentManagement.sol";
import "./ManufacturerCapability.sol";
import "./ServiceFactoryCapability.sol";
import "./PoliceDepartmentCapability.sol";

contract VehicleLifecycleToken is
    ERC721Enumerable,
    GovernmentManagement,
    ManufacturerCapability,
    ServiceFactoryCapability,
    PoliceDepartmentCapability,
    Ownable
{
    
    constructor() ERC721("Vehicle Lifecycle Token", "VLT") Ownable(){
    }

    function setAdminRole(address addr) 
        public
        onlyOwner()
    {
        _setupRole(GOVERNMENT, addr);
    }

    function manufactureVehicle(string memory vin, string memory make, string memory model, string memory color, uint32 year, uint32 maxMilleage, uint32 engineSize, string memory metadataUri) 
      public
      only(MANUFACTURER)
    {
      uint256 tokenId = totalSupply() + 1;
      _safeMint(msg.sender, tokenId);
      _manufactureVehicle(tokenId, vin, make, model, color, year, maxMilleage, engineSize, metadataUri);
    }

    function tokenURI(uint256 tokenId) public view virtual override (ERC721) returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return _getMetadataUri(tokenId);
    }

    // Misc
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return
            AccessControl.supportsInterface(interfaceId) ||
            super.supportsInterface(interfaceId);
    }
}
