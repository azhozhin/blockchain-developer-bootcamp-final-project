//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

abstract contract EntityManagement {

    enum EntityType {UNDEFINED, MANUFACTURER, SERVICE_FACTORY, POLICE}
    enum State {SUSPENDED, ACTIVE}

    struct Entity {
        address addr;
        string name;
        State state;
        string metadataUri; // everything else is off-chain
    }

    event EntityAdded(EntityType indexed entityType, address indexed addr, string name, string metadataUri);
    event EntityUpdated(EntityType indexed entityType, address indexed addr, string name, string metadataUri);
    event EntitySuspended(EntityType indexed entityType, address indexed addr, string name);
    event EntityResumed(EntityType indexed entityType, address indexed addr, string name);

    modifier exists(mapping(address => Entity) storage entityMap, address addr) {
        Entity memory entity = entityMap[addr];
        require(entity.addr != address(0), "NF"); // NF = Not found
        _;
    }

    function _getEntity(
        mapping(address => Entity) storage entityMap,
        address addr
    ) internal view exists(entityMap, addr) returns (Entity memory) {
        return entityMap[addr];
    }

    function _getEntities(
        mapping(address => Entity) storage entityMap,
        mapping(uint256 => address) storage entityIndex2Addr,
        uint256 count
    ) internal view returns (Entity[] memory) {
        Entity[] memory result = new Entity[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = entityMap[entityIndex2Addr[i]];
        }
        return result;
    }

    function _addEntity(
        EntityType type_,
        mapping(address => Entity) storage entityMap,
        mapping(uint256 => address) storage entityIndex2Addr,
        uint256 count,
        address addr,
        string memory name,
        string memory metadataUri
    ) internal returns (uint256) {
        Entity memory entity = entityMap[addr];
        require(entity.addr == address(0), "AE"); // AE = Already exists
        entityMap[addr] = Entity(addr, name, State.ACTIVE, metadataUri);
        entityIndex2Addr[count] = addr;
        count++;
        emit EntityAdded(type_, addr, name, metadataUri);
        return count;
    }

    // we can change only metadataUri
    function _updateEntity(
        EntityType type_,
        mapping(address => Entity) storage entityMap,
        address addr,
        string memory metadataUri
    ) 
        internal 
        exists(entityMap, addr)
    {
        Entity storage entity = entityMap[addr];
        entity.metadataUri = metadataUri;
        emit EntityUpdated(type_, addr, entity.name, entity.metadataUri);
    }

    function _suspendEntity(
        EntityType type_,
        mapping(address => Entity) storage entityMap,
        address addr)
        internal
        exists(entityMap, addr)
    {
        Entity storage entity = entityMap[addr];
        entity.state = State.SUSPENDED;
        emit EntitySuspended(type_, addr, entity.name);
    }

    function _resumeEntity(
        EntityType type_,
        mapping(address => Entity) storage entityMap,
        address addr)
        internal
        exists(entityMap, addr)
    {
        Entity storage entity = entityMap[addr];
        entity.state = State.ACTIVE;
        emit EntityResumed(type_, addr, entity.name);
    }
}

