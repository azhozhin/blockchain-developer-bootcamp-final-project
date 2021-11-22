import React, { useEffect, useState } from "react";
import { Address } from "..";
import { Row, Col, Image } from "antd";
import axios from "axios";
import KeyValue from "../KeyValue";
import ServiceRecords from "./ServiceRecords";
import PoliceRecords from "./PoliceRecords";

export default function Vehicle({
    readContracts,
    tokenId,
  }) {
    const [data, setData] = useState();
  
    useEffect(() => {
      async function getVehicle() {
        if (readContracts && readContracts.VehicleLifecycleToken){
            const newData = await readContracts.VehicleLifecycleToken.getVehicleDetailsByTokenId(tokenId);
            const metadataUri = await readContracts.VehicleLifecycleToken.tokenURI(tokenId);
            const rawPoliceLogs = await readContracts.VehicleLifecycleToken.getPoliceLogEntries(tokenId);
            const rawServiceLogs = await readContracts.VehicleLifecycleToken.getServiceLogEntries(tokenId);

            const policeLogs = [];
            for (const log of rawPoliceLogs){
                const timestamp = log.timestamp;
                const recordUri = log.recordUri;
                const recordResp = await axios.get(recordUri);
                const record = recordResp.data;
                policeLogs.push({
                    timestamp: timestamp,
                    principal: "TBD",
                    record: record,
                });
            };

            const serviceLogs = [];
            for (const log of rawServiceLogs) {
                const timestamp = log.timestamp;
                const mileage = log.mileage;
                const recordUri = log.recordUri;
                const recordResp = await axios.get(recordUri);
                const record = recordResp.data;
                serviceLogs.push({
                    timestamp: timestamp,
                    principal: "TBD",
                    mileage: mileage,
                    record: record,
                });
            }

            const res = await axios.get(metadataUri)
            const metadata = res.data;
            const attributes = {
                dynamic: {}
            };
            metadata.attributes.forEach((el)=>{
                if (el.attr_type=="group"){
                    attributes.dynamic[el.value] = el.attrs;
                } else {
                    attributes[el.attr_type] = el.value;
                }
            })
            const attrs = Object.assign({}, ...metadata.attributes.map((x) => ({[x.attr_type]: x.value})));
            const o = {
                vin: newData.vin,
                make: newData.make,
                model: newData.model,
                color: newData.color,
                year: newData.year,
                maxMileage: newData.maxMileage,
                engineSize: newData.engineSize,
                imageUri: metadata.image,
                description: metadata.description,
                externalUri: metadata.externalUri,
                ipfsWikiUri: attrs.ipfs_wiki,
                dynamicAttributes: attributes.dynamic,
                serviceLogs: serviceLogs,
                policeLogs: policeLogs,
            };
            console.log(o);
            setData(o);
        }
      }
      getVehicle();
    }, [readContracts]);

    return (
      <div style={{ border: "1px solid #cccccc", padding: 16, width: '100%', margin: "auto", marginTop: 64 }}>
          {data &&
            <div> 
            <Row gutter={16}>
                <Col span={12}>
                    <Image src={data.imageUri}/>
                </Col>
                <Col span={6}>
                    <h3>Standard Properties</h3>
                    <Row gutter={[16, 16]}>
                        <KeyValue name={"Vin"} value={data.vin}/>
                        <KeyValue name={"Make"} value={data.make}/>
                        <KeyValue name={"Model"} value={data.model}/>
                        <KeyValue name={"Color"} value={data.color}/>
                        <KeyValue name={"Year"} value={data.year}/>
                        <KeyValue name={"MaxMileage"} value={data.maxMileage}/>
                        <KeyValue name={"engineSize"} value={data.engineSize}/>
                    </Row>
                </Col>
                <Col span={6}>
                    <h3>Technical Specs</h3>
                    TBD
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <h3>Service Records</h3>
                    <ServiceRecords logs={data.serviceLogs}/>
                </Col>
                <Col span={12}>
                    <h3>Police Records</h3>
                    <PoliceRecords logs={data.policeLogs}/>
                </Col>
            </Row>
            </div>
          }
      </div>
    );
  }

