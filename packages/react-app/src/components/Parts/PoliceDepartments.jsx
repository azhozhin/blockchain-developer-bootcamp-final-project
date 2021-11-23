import React, { useEffect, useState } from "react";
import { Address } from "..";
import { Table, Switch, Image, Button } from "antd";
import axios from "axios";
import EntityState from "../EntityState";
import { entityType, getToggleEntityMethod, executeToggleEntityMethod } from "../../helpers/entityHelper";
import AddPoliceDepartmentForm from "./AddPoliceDepartmentForm";

export default function PoliceDepartments({ readContracts, writeContracts, tx, roles }) {
  const [data, setData] = useState();
  const [visible, setVisible] = useState(false);  

  useEffect(() => {
    async function getPoliceDepartments() {
      if ((roles, readContracts && readContracts.VehicleLifecycleToken)) {
        const newData = await readContracts.VehicleLifecycleToken.getPoliceDepartments();
        const list = [];
        const results = [];

        newData.forEach(function (obj, i) {
          list.push(
            axios.get(obj.metadataUri).then(function (res) {
              results[i] = res.data;
            }),
          );
        });

        Promise.all(list) // (4)
          .then(function () {
            const dt = [];
            newData.forEach((el, i) => {
              const attrs = Object.assign({}, ...results[i].attributes.map(x => ({ [x.attr_type]: x.value })));
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
          });
      }
    }
    getPoliceDepartments();
  }, [tx, roles, readContracts, writeContracts]);
  
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
      render: state => (
        <EntityState
          state={state}
          allowed={roles && roles.isGovernment}
          onChange={async () => {
            const fun = getToggleEntityMethod(writeContracts, entityType.POLICE, record.state, record.addr);
            const result = await executeToggleEntityMethod(tx, fun);
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

  const showAddPoliceDepartmentForm = ()=>{
      setVisible(true);
  }

  return (
    <div style={{ border: "1px solid #cccccc", padding: 16, width: "100%", margin: "auto", marginTop: 64 }}>
      {data && (
        <div>
          <Table rowKey={record => record.addr} dataSource={data} columns={columns} />
        </div>
      )}
      <Button type="primary" disabled={!roles.isGovernment} onClick={showAddPoliceDepartmentForm}>
        Add Police Department
      </Button>
      <AddPoliceDepartmentForm 
        visible={visible} />
    </div>
  );
}
