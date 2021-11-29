import React, { useEffect, useState } from "react";
import { Address } from "..";
import { Table, Image, Button } from "antd";
import EntityState from "../EntityState";
import {
  deserializePoliceDepartmentMetadata,
  entityType,
  executeMethod,
  loadEntities,
} from "../../helpers/entityHelper";
import AddPoliceDepartmentForm from "./AddPoliceDepartmentForm";

export default function PoliceDepartments({ address, readContracts, writeContracts, tx, roles, pinataApi }) {
  const [loading, setLoading] = useState(false);
  const [policeDepartments, setPoliceDepartments] = useState();
  const [loadingArray, setLoadingArray] = useState({});
  const [addr2indexMapping, setAddr2indexMapping] = useState({});

  const [addPoliceDepartmentFormVisible, setAddPoliceDepartmentFormVisible] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState("");

  useEffect(() => {
    async function getPoliceDepartments() {
      if (readContracts && readContracts.VehicleLifecycleToken) {
        setLoading(true);
        const newPoliceDepartments = await readContracts.VehicleLifecycleToken.getPoliceDepartments();
        const [newList, addr2index] = await loadEntities(
          newPoliceDepartments,
          deserializePoliceDepartmentMetadata,
          pinataApi,
        );

        setPoliceDepartments(newList);
        setAddr2indexMapping(addr2index);
        setLoading(false);
        console.log(newList);
      }
    }
    getPoliceDepartments();
  }, [address, refreshTrigger]);

  const onPoliceDepartmentChangeState = async record => {
    setLoadingArray(prevState => ({
      ...prevState,
      [record.addr]: true,
    }));
    await executeMethod(
      tx,
      record.state == 1
        ? writeContracts.VehicleLifecycleToken.disable(entityType.POLICE, record.addr)
        : writeContracts.VehicleLifecycleToken.enable(entityType.POLICE, record.addr),
      () => {
        const idx = addr2indexMapping[record.addr];
        const newPoliceDepartments = [...policeDepartments];
        newPoliceDepartments[idx] = { ...newPoliceDepartments[idx], state: record.state == 1 ? 0 : 1 };
        setPoliceDepartments(newPoliceDepartments);
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
          allowed={roles && roles.isGovernment}
          loading={loadingArray[record.addr]}
          onChange={async () => {
            await onPoliceDepartmentChangeState(record);
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

  const showAddPoliceDepartmentForm = () => {
    setAddPoliceDepartmentFormVisible(true);
  };

  return (
    <>
      <Table
        rowKey={record => record.addr}
        dataSource={policeDepartments}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 4 }}
      />
      {roles && (
        <Button type="primary" disabled={!roles.isGovernment} onClick={showAddPoliceDepartmentForm} loading={loading}>
          Add Police Department
        </Button>
      )}

      <AddPoliceDepartmentForm
        tx={tx}
        visible={addPoliceDepartmentFormVisible}
        setVisible={setAddPoliceDepartmentFormVisible}
        pinataApi={pinataApi}
        writeContracts={writeContracts}
        setRefreshTrigger={setRefreshTrigger}
      />
    </>
  );
}
