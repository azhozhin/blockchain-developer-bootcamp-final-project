import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Events, Address } from "../components";
import { Table, Switch, Image } from "antd";
import EntityState from "../components/EntityState";
import axios from "axios";
import PoliceDepartments from "../components/Parts/PoliceDepartments";
import Manufacturers from "../components/Parts/Manufacturers";
import ServiceFactories from "../components/Parts/ServiceFactories";
import Vehicle from "../components/Parts/Vehicle";

function Home({
  address,
  localProvider,
  mainnetProvider,
  tx,
  readContracts,
  writeContracts,
}) {
  const [roles, setRoles] = useState();
  useEffect(() => {
    async function getRoles() {
      if (address && readContracts && readContracts.VehicleLifecycleToken){
        const newData = await readContracts.VehicleLifecycleToken.getRoles(address);
        console.log(newData);
        setRoles({
          isGovernment: newData.isGovernment,
          isManufacturer: newData.isManufacturer,
          isServiceFactory: newData.isServiceFactory,
          isPolice: newData.isPolice,
        });
      }
    }
    getRoles();
  }, [readContracts, address]);
  return (
    <div style={{ border: "1px solid #cccccc", padding: 16, width: 1200, margin: "auto", marginTop: 64 }}>
      <Vehicle readContracts={readContracts} tokenId={1} />

      <Manufacturers readContracts={readContracts} writeContracts={writeContracts} tx={tx} roles={roles}/>
      <PoliceDepartments readContracts={readContracts} roles={roles}/>
      <ServiceFactories readContracts={readContracts} roles={roles}/>
    </div>
  );
}

export default Home;
