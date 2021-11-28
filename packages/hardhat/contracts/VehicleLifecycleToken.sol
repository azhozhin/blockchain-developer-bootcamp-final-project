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

/// @title A vechicle lifecycle token (Main contract)
/// @author Andrei Zhozhin
/// @notice This contract does not cover all possible parties involved into vehicle lifecycle
/// @dev This contract implement ERC721 token with metadata, ERC721Enumerable added to simplify UI logic
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

    /// @notice Creates new instance of the contract
    constructor() ERC721("Vehicle Lifecycle Token", "VLT") Ownable() {
        //_setupRole(GOVERNMENT, msg.sender);
        //_setRoleAdmin();
    }

    /// @notice Setup main admin role (GOVERNMENT) for participant
    /// @dev Owner and participant roles are segregated by design
    /// @param addr Participant address
    function setAdminRole(address addr) public onlyOwner {
        _setupRole(GOVERNMENT, addr);
    }

    /// @notice Self-destroy function to get rid contract from public network (testnet)
    /// @notice It should be removed from final version of contract
    /// @dev Used to quickly get rid of deployed contract instance to allow testing on testnets
    function destroy() public payable onlyOwner {
        address payable _owner = payable(owner());
        selfdestruct(_owner);
    }

    /// @notice Manufacture new vehicle
    /// @dev This method increment tokenId and set tokenUri, everything else is delegated to Manufacturer capability
    /// @dev TokenId starts from 1
    /// @param vin Vehicle Identification Number (should be unique)
    /// @param make Make of the vehicle
    /// @param model Model of the vehicle
    /// @param color Color of the vehicle
    /// @param year Year of the vehicle being produced
    /// @param maxMileage Maximum mileage advised by manufacturer which is covered by manufacturer warranty
    /// @param engineSize size in cubic centimeters
    /// @param tokenUri location of metadata json file describing token
    /// @return tokenId for newly created vehicle
    function manufactureVehicle(
        string memory vin,
        string memory make,
        string memory model,
        string memory color,
        uint32 year,
        uint32 maxMileage,
        uint32 engineSize,
        string memory tokenUri
    ) public only(MANUFACTURER) returns (uint256) {
        
        // TODO: check that tokenUri starts with ipfs:// to enforce metadata location

        _tokenIds.increment();

        uint256 tokenId = _tokenIds.current();
        _safeMint(msg.sender, tokenId);
        _manufactureVehicle(
            tokenId,
            vin,
            make,
            model,
            color,
            year,
            maxMileage,
            engineSize
        );
        _setTokenURI(tokenId, tokenUri);
        return tokenId;
    }

    /// @notice Returns tokenURI with metadata according to ERC721 Metadata standard
    /// @param tokenId token identifier
    /// @dev Returns tokenURI by design it should be IPFS link
    /// @return tokenURI
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return ERC721URIStorage.tokenURI(tokenId);
    }

    /// @notice Check if thus contract supports particular interface
    /// @param interfaceId interface hash to check
    /// @return result of the check (true/false)
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
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        virtual
        override(ERC721, ERC721URIStorage)
    {
        ERC721URIStorage._burn(tokenId);
    }
}
