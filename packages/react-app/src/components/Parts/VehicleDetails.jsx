import React, { useEffect, useState } from "react";
import { Row, Col, Image, Button, Table, Divider } from "antd";
import axios from "axios";
import ServiceRecords from "./ServiceRecords";
import PoliceRecords from "./PoliceRecords";
import AddPoliceRecordForm from "./AddPoliceRecordForm";
import AddServiceRecordForm from "./AddServiceRecordForm";
import TokenEvents from "../TokenEvents";
import { deserializeVehicleMetadata } from "../../helpers/entityHelper";

export default function Vehicle({
  address,
  readContracts,
  writeContracts,
  tokenId,
  roles,
  tx,
  localProvider,
  mainnetProvider,
  pinataApi,
}) {
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

        const res = await axios.get(pinataApi.convertToUrl(metadataUri));
        const metadata = res.data;
        const vehicle = deserializeVehicleMetadata(newData, metadata, pinataApi);

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

        setData(vehicle);
        setLoading(false);
        console.log(vehicle);
      }
    }
    getVehicle();
  }, [tokenId, address]);

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
              <Image src={data.imageUri} />
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
                pinataApi={pinataApi}
              />
              <Button disabled={!roles.isServiceFactory} onClick={showAddServiceRecord}>
                Add Service Record
              </Button>
              <AddServiceRecordForm
                tx={tx}
                visible={addServiceRecordVisible}
                setVisible={setAddServiceRecordVisible}
                vehicleDetails={data}
                writeContracts={writeContracts}
              />
            </Col>
            <Col span={12}>
              <h3>Police Records</h3>
              <PoliceRecords
                readContracts={readContracts}
                tokenId={tokenId}
                refreshTrigger={addPoliceRecordVisible}
                pinataApi={pinataApi}
              />
              <Button disabled={!roles.isPolice} onClick={showAddPoliceRecord}>
                Add Police Record
              </Button>
              <AddPoliceRecordForm
                tx={tx}
                visible={addPoliceRecordVisible}
                setVisible={setAddPoliceRecordVisible}
                vehicleDetails={data}
                writeContracts={writeContracts}
                pinataApi={pinataApi}
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
