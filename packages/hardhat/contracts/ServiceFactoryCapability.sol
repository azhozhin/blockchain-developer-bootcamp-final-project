//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LifecycleAccessControl.sol";

/// @title Service Factory Capability
/// @author Andrei Zhozhin
/// @notice This contract allows to add service factory log entries and get list of log entries for vehicle
abstract contract ServiceFactoryCapability is LifecycleAccessControl {
    struct ServiceFactoryLogEntry {
        uint256 timestamp;
        address principal;
        uint32 mileage; // we would store mileage every time vehicle is services
        string recordUri; // to store everything else off-chain
    }

    mapping(uint256 => ServiceFactoryLogEntry[]) private _tokenId2Logs;
    mapping(uint256 => uint32) private _tokenId2Count;

    function addServiceLogEntry(
        uint256 tokenId,
        uint32 mileage,
        string memory recordUri
    ) public only(SERVICE_FACTORY) {
        ServiceFactoryLogEntry memory logEntry = ServiceFactoryLogEntry(
            block.timestamp,
            msg.sender,
            mileage,
            recordUri
        );
        _tokenId2Logs[tokenId].push(logEntry);
        _tokenId2Count[tokenId]++;
        // TODO: should we emit event here?
    }

    function getServiceLogEntries(uint256 tokenId)
        public
        view
        returns (ServiceFactoryLogEntry[] memory)
    {
        return _tokenId2Logs[tokenId];
    }
}
