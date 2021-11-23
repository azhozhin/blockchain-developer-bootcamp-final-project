
export const entityType = {
    UNDEFINED: 0,
    MANUFACTURER: 1,
    SERVICE_FACTORY: 2,
    POLICE: 3
}

export const getToggleEntityMethod = (writeContracts, entityType, state, targetAddr) => {
    const fun = (state == 1)
        ? writeContracts.VehicleLifecycleToken.disable(entityType, targetAddr)
        : writeContracts.VehicleLifecycleToken.enable(entityType, targetAddr);
    return fun;
}

export const executeToggleEntityMethod = async (tx, fun) => {
    const result = tx(fun, update => {
        console.log("📡 Transaction Update:", update);
        if (update && (update.status === "confirmed" || update.status === 1)) {
            console.log("Transaction " + update.hash + " finished!");
        }
    });
    console.log("awaiting metamask/web3 confirm result...", result);
    return result;
}