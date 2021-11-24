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
  const [activeTab, setActiveTab] = useState("search");

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
  }, [readContracts, address]);

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
        <TabPane tab="Search" key="search">
          <VehicleSearch readContracts={readContracts} handleChange={handleChange} />
        </TabPane>
        <TabPane tab="Vehicle" key="vehicle">
          <VehicleDetails
            readContracts={readContracts}
            writeContracts={writeContracts}
            tokenId={tokenId}
            roles={roles}
          />
        </TabPane>
        <TabPane tab="Manufacturers" key="manufacturers">
          <Manufacturers
            readContracts={readContracts}
            writeContracts={writeContracts}
            tx={tx}
            roles={roles}
            pinataApi={pinataApi}
          />
        </TabPane>
        <TabPane tab="Service Factories" key="serviceFactories">
          <ServiceFactories
            readContracts={readContracts}
            writeContracts={writeContracts}
            tx={tx}
            roles={roles}
            pinataApi={pinataApi}
          />
        </TabPane>
        <TabPane tab="Police Departments" key="policeDepartments">
          <PoliceDepartments
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
