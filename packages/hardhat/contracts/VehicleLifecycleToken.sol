//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "./GovernmentManagement.sol";
import "./ManufacturerCapability.sol";
import "./ServiceFactoryCapability.sol";
import "./PoliceDepartmentCapability.sol";

contract VehicleLifecycleToken is
    ERC721URIStorage,
    ERC721Enumerable,
    GovernmentManagement,
    ManufacturerCapability,
    ServiceFactoryCapability,
    PoliceDepartmentCapability,
    Ownable
{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    constructor() ERC721("Vehicle Lifecycle Token", "VLT") Ownable(){
        _setupRole(GOVERNMENT, msg.sender);
        //_setRoleAdmin();
    }

    function setAdminRole(address addr) 
        public
        onlyOwner()
    {
        _setupRole(GOVERNMENT, addr);
    }

    function destroy() public onlyOwner() payable {
        address payable _owner = payable(owner());
        selfdestruct(_owner);
    }

    function manufactureVehicle(string memory vin, string memory make, string memory model, string memory color, uint32 year, uint32 maxMileage, uint32 engineSize, string memory tokenUri) 
      public
      only(MANUFACTURER)
    {
      _tokenIds.increment();

      uint256 tokenId = _tokenIds.current();
      _safeMint(msg.sender, tokenId);
      _manufactureVehicle(tokenId, vin, make, model, color, year, maxMileage, engineSize);
      _setTokenURI(tokenId, tokenUri);
    }

    // Overrides
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, AccessControl, ERC721Enumerable) 
        returns (bool)
    {
        return 
            AccessControl.supportsInterface(interfaceId) ||
            super.supportsInterface(interfaceId);
    }
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override (ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function tokenURI(uint256 tokenId) public view virtual override (ERC721, ERC721URIStorage) returns (string memory) {
        return ERC721URIStorage.tokenURI(tokenId);
    }

    function _burn(uint256 tokenId) internal virtual override (ERC721, ERC721URIStorage) {
        ERC721URIStorage._burn(tokenId);
    }
}
