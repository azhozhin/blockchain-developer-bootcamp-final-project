import React, { useEffect, useState } from "react";
import { Address } from "..";
import { Table, Switch, Image, Button } from "antd";
import axios from "axios";
import EntityState from "../EntityState";
import { entityType, executeMethod } from "../../helpers/entityHelper";
import AddPoliceDepartmentForm from "./AddPoliceDepartmentForm";

export default function PoliceDepartments({ readContracts, writeContracts, tx, roles, pinataApi }) {
  const [data, setData] = useState();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingArray, setLoadingArray] = useState({});

  useEffect(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    async function getPoliceDepartments() {
      if (readContracts && readContracts.VehicleLifecycleToken) {
        console.log("refresh police departments");
        setLoading(true);
        const newData = await readContracts.VehicleLifecycleToken.getPoliceDepartments();
        const list = [];
        const results = [];

        newData.forEach(function (obj, i) {
          list.push(
            axios.get(obj.metadataUri).then(function (res) {
              results[i] = res.data;
            }),
          );
          setLoadingArray(prevState => ({
            ...prevState,
            [obj.addr]: false,
          }));
        });

        await Promise.all(list);
        const dt = [];
        newData.forEach((el, i) => {
          const attrs = results[i].attributes
            ? Object.assign({}, ...results[i].attributes.map(x => ({ [x.attr_type]: x.value })))
            : {};
          dt.push({
            addr: el.addr,
            name: el.name,
            state: el.state,
            metadataUri: el.metadataUri,
            imageUri: results[i].image,
            description: results[i].description,
            externalUri: results[i].external_uri,
            address: {
              addressLine: attrs.address_line,
              postalCode: attrs.postal_code,
              country: attrs.country,
            },
          });
        });
        setData(dt);
        setLoading(false);
      }
    }
    getPoliceDepartments();
  }, [readContracts, tx]);

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
            setLoadingArray(prevState => ({
              ...prevState,
              [record.addr]: true,
            }));
            const result = await executeMethod(
              tx,
              state == 1
                ? writeContracts.VehicleLifecycleToken.disable(entityType.POLICE, record.addr)
                : writeContracts.VehicleLifecycleToken.enable(entityType.POLICE, record.addr),
            );
            setLoadingArray(prevState => ({
              ...prevState,
              [record.addr]: false,
            }));
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

  const showAddPoliceDepartmentForm = () => {
    setVisible(true);
  };

  return (
    <>
      <Table rowKey={record => record.addr} dataSource={data} columns={columns} loading={loading} />
      {roles && (
        <Button type="primary" disabled={!roles.isGovernment} onClick={showAddPoliceDepartmentForm}>
          Add Police Department
        </Button>
      )}

      <AddPoliceDepartmentForm
        tx={tx}
        visible={visible}
        setVisible={setVisible}
        pinataApi={pinataApi}
        writeContracts={writeContracts}
      />
    </>
  );
}
