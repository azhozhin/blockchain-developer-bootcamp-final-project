import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Events, Address } from "../components";
import { Table, Switch, Image, Tabs } from "antd";
import EntityState from "../components/EntityState";
import axios from "axios";
import PoliceDepartments from "../components/Parts/PoliceDepartments";
import Manufacturers from "../components/Parts/Manufacturers";
import ServiceFactories from "../components/Parts/ServiceFactories";
import VehicleDetails from "../components/Parts/VehicleDetails";
import VehicleSearch from "../components/Parts/VehicleSearch";
import Garage from "../components/Parts/Garage";

const { TabPane } = Tabs;

export default function Home({
  address,
  localProvider,
  mainnetProvider,
  tx,
  readContracts,
  writeContracts,
  pinataApi,
}) {
  const [roles, setRoles] = useState();
  const [tokenId, setTokenId] = useState("");
  const [activeTab, setActiveTab] = useState("garage");

  useEffect(() => {
    async function getRoles() {
      if (address && readContracts && readContracts.VehicleLifecycleToken) {
        const newData = await readContracts.VehicleLifecycleToken.getRoles(address);
        setRoles({
          isGovernment: newData.isGovernment,
          isManufacturer: newData.isManufacturer,
          isServiceFactory: newData.isServiceFactory,
          isPolice: newData.isPolice,
        });
      }
    }
    getRoles();
  }, [address, readContracts]);

  const handleChange = newTokenId => {
    if (newTokenId) {
      setTokenId(newTokenId);
      setActiveTab("vehicle");
    } else {
      setTokenId(undefined);
    }
  };

  const onTabChange = newActiveTab => {
    setActiveTab(newActiveTab);
  };

  return (
    <div style={{ border: "1px solid #cccccc", padding: 16, width: 1200, margin: "auto", marginTop: 25 }}>
      <Tabs activeKey={activeTab} type="card" onChange={onTabChange}>
        <TabPane tab="Garage" key="garage">
          <Garage
            roles={roles}
            address={address}
            readContracts={readContracts}
            writeContracts={writeContracts}
            handleChange={handleChange}
            tx={tx}
            pinataApi={pinataApi}
          />
        </TabPane>
        <TabPane tab="Search" key="search">
          <VehicleSearch readContracts={readContracts} handleChange={handleChange} />
        </TabPane>
        <TabPane tab="Vehicle" key="vehicle">
          <VehicleDetails
            address={address}
            tx={tx}
            readContracts={readContracts}
            writeContracts={writeContracts}
            tokenId={tokenId}
            roles={roles}
            localProvider={localProvider}
            mainnetProvider={mainnetProvider}
            pinataApi={pinataApi}
          />
        </TabPane>
        <TabPane tab="Manufacturers" key="manufacturers">
          <Manufacturers
            address={address}
            readContracts={readContracts}
            writeContracts={writeContracts}
            tx={tx}
            roles={roles}
            pinataApi={pinataApi}
          />
        </TabPane>
        <TabPane tab="Service Factories" key="serviceFactories">
          <ServiceFactories
            address={address}
            readContracts={readContracts}
            writeContracts={writeContracts}
            tx={tx}
            roles={roles}
            pinataApi={pinataApi}
          />
        </TabPane>
        <TabPane tab="Police Departments" key="policeDepartments">
          <PoliceDepartments
            address={address}
            readContracts={readContracts}
            writeContracts={writeContracts}
            tx={tx}
            roles={roles}
            pinataApi={pinataApi}
          />
        </TabPane>
      </Tabs>
    </div>
  );
  
}
