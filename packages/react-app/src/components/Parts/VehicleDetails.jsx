import React, { useEffect, useState } from "react";
import { Row, Col, Image, Button, Table, Divider } from "antd";
import axios from "axios";
import ServiceRecords from "./ServiceRecords";
import PoliceRecords from "./PoliceRecords";
import AddPoliceRecordForm from "./AddPoliceRecordForm";
import AddServiceRecordForm from "./AddServiceRecordForm";
import TokenEvents from "../TokenEvents";


export default function Vehicle({ readContracts, writeContracts, tokenId, roles, tx, localProvider, mainnetProvider }) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [addPoliceRecordVisible, setAddPoliceRecordVisible] = useState(false);
  const [addServiceRecordVisible, setAddServiceRecordVisible] = useState(false);
  const [properties, setProperties] = useState([]);
  const [description, setDescription] = useState("");

  useEffect(() => {
    async function getVehicle() {
      if (readContracts && readContracts.VehicleLifecycleToken && tokenId != "") {
        setLoading(true);
        const newData = await readContracts.VehicleLifecycleToken.getVehicleDetailsByTokenId(tokenId);
        const metadataUri = await readContracts.VehicleLifecycleToken.tokenURI(tokenId);

        const res = await axios.get(metadataUri);
        const metadata = res.data;

        const attrs = Object.assign({}, ...metadata.attributes.map(x => ({ [x.attr_type]: x.value })));
        const o = {
          tokenId: newData.tokenId.toString(),
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
        };
        const properties = [
          { name: "tokenId", value: newData.tokenId.toString() },
          { name: "vin", value: newData.vin },
          { name: "make", value: newData.make },
          { name: "model", value: newData.model },
          { name: "color", value: newData.color },
          { name: "year", value: newData.year },
          { name: "maxMileage", value: newData.maxMileage },
          { name: "engineSize", value: newData.engineSize },
        ];
        setDescription(metadata.description);
        setProperties(properties);

        setData(o);
        setLoading(false);
      }
    }
    getVehicle();
  }, [tokenId, readContracts, addPoliceRecordVisible, addServiceRecordVisible]);

  const showAddPoliceRecord = () => {
    setAddPoliceRecordVisible(true);
  };

  const showAddServiceRecord = () => {
    setAddServiceRecordVisible(true);
  };

  const columns = [
    {
      title: "Property",
      dataIndex: "name",
      key: "name",
      width: "120px",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
  ];

  return (
    <div style={{ border: "1px solid #cccccc", padding: 16, width: "100%", margin: "auto", marginTop: 25 }}>
      {data && (
        <div>
          <Row gutter={16}>
            <Col span={12}>
              <Image src={data.imageUri} loading={loading} />
              <h3>Description</h3>
              {description}
            </Col>
            <Col span={12}>
              <Table
                rowKey={record => record.name}
                dataSource={properties}
                columns={columns}
                size="small"
                pagination={false}
                loading={loading}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Divider />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <h3>Service Records</h3>
              <ServiceRecords
                readContracts={readContracts}
                tokenId={tokenId}
                refreshTrigger={addServiceRecordVisible}
              />
              <Button disabled={!roles.isServiceFactory} onClick={showAddServiceRecord}>
                Add Service Record
              </Button>
              <AddServiceRecordForm
                visible={addServiceRecordVisible}
                setVisible={setAddServiceRecordVisible}
                vehicleDetails={data}
                writeContracts={writeContracts}
              />
            </Col>
            <Col span={12}>
              <h3>Police Records</h3>
              <PoliceRecords readContracts={readContracts} tokenId={tokenId} refreshTrigger={addPoliceRecordVisible} />
              <Button disabled={!roles.isPolice} onClick={showAddPoliceRecord}>
                Add Police Record
              </Button>
              <AddPoliceRecordForm
                tx={tx}
                visible={addPoliceRecordVisible}
                setVisible={setAddPoliceRecordVisible}
                vehicleDetails={data}
                writeContracts={writeContracts}
              />
            </Col>
          </Row>
          <TokenEvents
            tokenId={tokenId}
            contracts={readContracts}
            contractName="VehicleLifecycleToken"
            eventName="Transfer"
            localProvider={localProvider}
            mainnetProvider={mainnetProvider}
            startBlock={1}
          />
        </div>
      )}
    </div>
  );
}
