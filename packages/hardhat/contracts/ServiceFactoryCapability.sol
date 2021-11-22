//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LifecycleAccessControl.sol";

abstract contract ServiceFactoryCapability is LifecycleAccessControl {

    struct ServiceFactoryLogEntry {
        uint256 timestamp;
        address principal;
        uint32 mileage;    // we would store mileage every time vehicle is services
        string recordUri; // to store everything else off-chain
    }

    mapping(uint256 => ServiceFactoryLogEntry[]) private _tokenId2Logs;
    mapping(uint256 => uint32) private _tokenId2Count;

    function addServiceLogEntry(uint256 tokenId, uint32 mileage, string memory recordUri) 
        public 
        only(SERVICE_FACTORY)
    {
        ServiceFactoryLogEntry memory logEntry = ServiceFactoryLogEntry(block.timestamp, msg.sender, mileage, recordUri);
        _tokenId2Logs[tokenId].push(logEntry);
        _tokenId2Count[tokenId]++;
    }

    function getServiceLogEntries(uint256 tokenId) public view returns(ServiceFactoryLogEntry[] memory){
        return _tokenId2Logs[tokenId];
    }
}