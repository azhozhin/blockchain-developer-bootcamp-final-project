//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LifecycleAccessControl.sol";

abstract contract PoliceDepartmentCapability is LifecycleAccessControl {

    struct PoliceDepartmentLogEntry {
        uint256 timestamp;
        string recordUri; // to store everything else off-chain
    }

    mapping(uint256 => PoliceDepartmentLogEntry[]) private _tokenId2PoliceLogs;
    mapping(uint256 => uint32) private _tokenId2PoliceCount;

    function addPoliceLogEntry(uint256 tokenId, string memory recordUri) 
        public 
        only(POLICE) 
    {
        PoliceDepartmentLogEntry memory logEntry = PoliceDepartmentLogEntry(block.timestamp, recordUri);
        _tokenId2PoliceLogs[tokenId].push(logEntry);
        _tokenId2PoliceCount[tokenId]++;
    }

    function getPoliceLogEntries(uint256 tokenId) public view returns(PoliceDepartmentLogEntry[] memory){
        return _tokenId2PoliceLogs[tokenId];
    }
}