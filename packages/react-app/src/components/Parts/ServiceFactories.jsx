import React, { useEffect, useState } from "react";
import { Address } from "..";
import { Table, Image, Button } from "antd";
import EntityState from "../EntityState";
import { deserializeServiceFactoryMetadata, entityType, executeMethod, loadEntities } from "../../helpers/entityHelper";

export default function ServiceFactories({ address, readContracts, writeContracts, tx, roles }) {
  const [serviceFactories, setServiceFactories] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingArray, setLoadingArray] = useState({});
  const [addr2indexMapping, setAddr2indexMapping] = useState({});

  useEffect(() => {
    async function getServiceFactories() {
      if (roles && readContracts && readContracts.VehicleLifecycleToken) {
        setLoading(true);
        const newServiceFactories = await readContracts.VehicleLifecycleToken.getServiceFactories();
        const [newList, addr2index] = await loadEntities(newServiceFactories, deserializeServiceFactoryMetadata);

        setServiceFactories(newList);
        setAddr2indexMapping(addr2index);
        setLoading(false);
      }
    }
    getServiceFactories();
  }, [address]);

  const onServiceFactoryChangeState = async record => {
    setLoadingArray(prevState => ({
      ...prevState,
      [record.addr]: true,
    }));
    await executeMethod(
      tx,
      record.state == 1
        ? writeContracts.VehicleLifecycleToken.disable(entityType.SERVICE_FACTORY, record.addr)
        : writeContracts.VehicleLifecycleToken.enable(entityType.SERVICE_FACTORY, record.addr),
      () => {
        const idx = addr2indexMapping[record.addr];
        const newServiceFactories = [...serviceFactories];
        newServiceFactories[idx] = { ...newServiceFactories[idx], state: record.state == 1 ? 0 : 1 };
        setServiceFactories(newServiceFactories);
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
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: "150px",
      render: address => (
        <div>
          {address.addressLine}, {address.postalCode}
          <div>{address.country}</div>
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
            await onServiceFactoryChangeState(record);
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
        <a target="_blank" rel="noopener noreferrer" href={uri}>
          ipfs
        </a>
      ),
    },
  ];
  return (
    <>
      <div>
        <Table rowKey={record => record.addr} dataSource={serviceFactories} columns={columns} loading={loading} />
      </div>
      <Button type="primary" disabled={!roles.isGovernment} loading={loading}>
        Add Service Factory
      </Button>
    </>
  );
}
