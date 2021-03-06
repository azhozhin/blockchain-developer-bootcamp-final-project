import React, { useEffect, useState } from "react";
import { Address } from "..";
import { Table, Image, Button } from "antd";
import EntityState from "../EntityState";
import { deserializeManufacturerMetadata, entityType, executeMethod, loadEntities } from "../../helpers/entityHelper";
import AddManufacturerForm from "./AddManufacturerForm";

export default function Manufacturers({ address, readContracts, writeContracts, roles, tx, pinataApi }) {
  const [loading, setLoading] = useState(false);
  const [manufacturers, setManufacturers] = useState();
  const [loadingArray, setLoadingArray] = useState({});
  const [addr2indexMapping, setAddr2indexMapping] = useState({});

  const [addManufacturerFormVisible, setAddManufacturerFormVisible] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState("");

  useEffect(() => {
    async function getManufacturers() {
      if (readContracts && readContracts.VehicleLifecycleToken) {
        setLoading(true);
        const newManufacturers = await readContracts.VehicleLifecycleToken.getManufacturers();
        const [newList, addr2index] = await loadEntities(newManufacturers, deserializeManufacturerMetadata, pinataApi);

        setManufacturers(newList);
        setAddr2indexMapping(addr2index);
        setLoading(false);
      }
    }
    getManufacturers();
  }, [address, refreshTrigger]);

  const onManufacturerChangeState = async record => {
    console.log("START");
    setLoadingArray(prevState => ({
      ...prevState,
      [record.addr]: true,
    }));
    await executeMethod(
      tx,
      record.state == 1
        ? writeContracts.VehicleLifecycleToken.disable(entityType.MANUFACTURER, record.addr)
        : writeContracts.VehicleLifecycleToken.enable(entityType.MANUFACTURER, record.addr),
      () => {
        console.log("AAAA");
        const idx = addr2indexMapping[record.addr];
        const newManufacturers = [...manufacturers];
        newManufacturers[idx] = { ...newManufacturers[idx], state: record.state == 1 ? 0 : 1 };
        setManufacturers(newManufacturers);
        console.log("BBBB");
        setLoadingArray(prevState => ({
          ...prevState,
          [record.addr]: false,
        }));
      },
      () => {
        setLoadingArray(prevState => ({
          ...prevState,
          [record.addr]: false,
        }));
      },
    );

    console.log("CCCC");
  };

  const columns = [
    {
      title: "Logo",
      dataIndex: "imageUri",
      key: "imageUri",
      width: "150px",
      render: uri => <Image width={90} src={uri} />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <div>
          <div>
            <a target="_blank" rel="noopener noreferrer" href={record.externalUri}>
              {name}
            </a>
          </div>

          <div>{record.description}</div>
        </div>
      ),
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      width: "100px",
      render: (state, record) => (
        <EntityState
          state={state}
          allowed={roles.isGovernment}
          loading={loadingArray[record.addr]}
          onChange={async () => {
            await onManufacturerChangeState(record);
          }}
        />
      ),
    },
    {
      title: "Addr",
      dataIndex: "addr",
      key: "addr",
      width: "150px",
      render: addr => <Address address={addr} fontSize={16} />,
    },
    {
      title: "Metadata",
      dataIndex: "metadataUri",
      key: "metadataUri",
      width: "100px",
      render: uri => (
        <a target="_blank" rel="noopener noreferrer" href={pinataApi.convertToUrl(uri)}>
          ipfs
        </a>
      ),
    },
  ];

  const showAddManufacturerForm = () => {
    setAddManufacturerFormVisible(true);
  };

  return (
    <>
      {manufacturers && (
        <div>
          <Table rowKey={record => record.addr} dataSource={manufacturers} columns={columns} loading={loading} />
        </div>
      )}
      <Button type="primary" disabled={!roles.isGovernment} loading={loading} onClick={showAddManufacturerForm}>
        Add Manufacturer
      </Button>
      <AddManufacturerForm
        tx={tx}
        visible={addManufacturerFormVisible}
        setVisible={setAddManufacturerFormVisible}
        pinataApi={pinataApi}
        writeContracts={writeContracts}
        setRefreshTrigger={setRefreshTrigger}
      />
    </>
  );
}
