import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Events, Address } from "../components";
import { Table, Switch, Image } from "antd";
import EntityState from "../components/EntityState";
import axios from "axios";
import PoliceDepartments from "../components/Parts/PoliceDepartments";
import Manufacturers from "../components/Parts/Manufacturers";
import ServiceFactories from "../components/Parts/ServiceFactories";

function Home({
  address,
  localProvider,
  mainnetProvider,
  tx,
  readContracts,
  writeContracts,
}) {
 
  return (
    <div style={{ border: "1px solid #cccccc", padding: 16, width: 1200, margin: "auto", marginTop: 64 }}>
      <Manufacturers readContracts={readContracts}/>
      <PoliceDepartments readContracts={readContracts}/>
      <ServiceFactories readContracts={readContracts}/>
    </div>
  );
}

export default Home;
