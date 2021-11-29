import React, { useEffect, useState } from "react";
import { Table, Button, Space } from "antd";
import AddVehicleForm from "./AddVehicleForm";
import TransferVehicleForm from "./TransferVehicleForm";

export default function Garage({ address, readContracts, writeContracts, handleChange, roles, tx, pinataApi }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState("");
  const [addNewVehicleFormVisible, setAddNewVehicleFormVisible] = useState(false);
  const [transferVehicleFormVisible, setTransferVehicleFormVisible] = useState(false);

  const [refreshTrigger, setRefreshTrigger] = useState("");

  async function LoadMyVehicles() {
    if (readContracts && readContracts.VehicleLifecycleToken) {
      setLoading(true);
      const count = await readContracts.VehicleLifecycleToken.balanceOf(address);
      console.log("count: " + count);
      const localVehicles = [];
      // todo: query it in parallel
      for (let i = 0; i < count; i++) {
        const tokenId = await readContracts.VehicleLifecycleToken.tokenOfOwnerByIndex(address, BigInt(i));
        const vehicle = await readContracts.VehicleLifecycleToken.getVehicleDetailsByTokenId(tokenId);
        localVehicles.push(vehicle);
      }
      setLoading(false);
      setVehicles(localVehicles);
    }
  }

  useEffect(() => {
    LoadMyVehicles();
  }, [readContracts]);

  useEffect(() => {
    LoadMyVehicles();
  }, [address, refreshTrigger]);

  const onTokenIdClick = (event, tokenId) => {
    handleChange(tokenId);
  };

  const showAddVehicleForm = () => {
    setAddNewVehicleFormVisible(true);
  };
  const showTransferDialog = (event, tokenId) => {
    setSelectedTokenId(tokenId);
    setTransferVehicleFormVisible(true);
  };

  const columns = [
    {
      title: "TokenId",
      dataIndex: "tokenId",
      key: "tokenId",
      width: "100px",
      render: tokenId => (
        <div>
          <Button type="link" onClick={event => onTokenIdClick(event, tokenId)}>
            {tokenId.toString()}
          </Button>
        </div>
      ),
    },
    {
      title: "Vin",
      dataIndex: "vin",
      key: "vin",
      render: vin => <div>{vin}</div>,
    },
    {
      title: "Make",
      dataIndex: "make",
      key: "make",
      width: "100px",
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      width: "150px",
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      width: "70px",
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      width: "70px",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "100px",
      render: (_, record) => (
        <>
          <Button onClick={event => showTransferDialog(event, record.tokenId)}>Transfer</Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Table rowKey={record => record.tokenId} dataSource={vehicles} columns={columns} loading={loading} />

      {roles && (
        <Button type="primary" onClick={showAddVehicleForm} disabled={!roles.isManufacturer}>
          New Car
        </Button>
      )}
      <AddVehicleForm
        address={address}
        pinataApi={pinataApi}
        visible={addNewVehicleFormVisible}
        setVisible={setAddNewVehicleFormVisible}
        readContracts={readContracts}
        writeContracts={writeContracts}
        tx={tx}
        setRefreshTrigger={setRefreshTrigger}
      />
      <TransferVehicleForm
        address={address}
        visible={transferVehicleFormVisible}
        setVisible={setTransferVehicleFormVisible}
        readContracts={readContracts}
        writeContracts={writeContracts}
        tokenId={selectedTokenId}
        tx={tx}
        setRefreshTrigger={setRefreshTrigger}
      />
    </>
  );
}
