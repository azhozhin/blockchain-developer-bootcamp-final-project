import React, { useEffect, useState } from "react";
import { Address } from "..";
import { Table, Switch, Image } from "antd";
import axios from "axios";
import EntityState from "../EntityState";

export default function Manufacturers({
    readContracts,
    writeContracts,
    roles,
    tx,
  }) {
    const [data, setData] = useState();
  
    useEffect(() => {
      async function getManufacturers() {
        if (roles && readContracts && readContracts.VehicleLifecycleToken){
          const newData = await readContracts.VehicleLifecycleToken.getManufacturers();
          const list = [];
          const results = [];
  
          newData.forEach(function(obj, i) {
            list.push(
              axios.get(obj.metadataUri).then(function(res){
                results[i] = res.data; 
              })
            );
          });
            
          Promise
            .all(list) // (4)
            .then(function() {
              const dt = [];
              newData.forEach((el, i)=>{
                const attrs = Object.assign({}, ...results[i].attributes.map((x) => ({[x.attr_type]: x.value})));
                dt.push({
                  addr: el.addr,
                  name: el.name,
                  state: el.state,
                  metadataUri: el.metadataUri,
                  imageUri: results[i].image,
                  description: results[i].description,
                  externalUri: results[i].external_uri,
                });
              })
              setData(dt);
            });
          
        }
      }
      getManufacturers();
    }, [tx, roles, readContracts, writeContracts]);
    //const data = ;
    //console.log(data);
    const columns = [
      {
        title: 'Logo',
        dataIndex: 'imageUri',
        key: 'imageUri',
        width: '150px',
        render: uri =>
          <Image width={90} src={uri}/>
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (name, record)=>
          <div>
            <div>
              <a target="_blank" rel="noopener noreferrer" href={record.externalUri}>
                {name}
              </a>
            </div>
  
            <div>
              {record.description}
            </div>
          </div>
      },
      {
        title: 'State',
        dataIndex: 'state',
        key: 'state',
        width: '100px',
        render: (state, record) => 
          <EntityState state={state} allowed={roles.isGovernment} onChange={async () => {
            /* look how you call setPurpose on your contract: */
            /* notice how you pass a call back for tx updates too */
            const fun = (record.state == 1) 
                ? writeContracts.VehicleLifecycleToken.disable(1, record.addr)
                : writeContracts.VehicleLifecycleToken.enable(1, record.addr);
            const result = tx(fun, update => {
              console.log("📡 Transaction Update:", update);
              if (update && (update.status === "confirmed" || update.status === 1)) {
                console.log("Transaction " + update.hash + " finished!");
              }
            });
            console.log("awaiting metamask/web3 confirm result...", result);
            console.log(await result);
          }}/>
      },
      {
        title: 'Addr',
        dataIndex: 'addr',
        key: 'addr',
        width: '150px',
        render: addr =>
          <Address address={addr} fontSize={16}/>
      },
      {
        title: 'Metadata',
        dataIndex: 'metadataUri',
        key: 'metadataUri',
        width: '100px',
        render: uri =>
          <a target="_blank" rel="noopener noreferrer" href={uri}>
              ipfs
          </a>
      }
    ];
    return (
      <div style={{ border: "1px solid #cccccc", padding: 16, width: '100%', margin: "auto", marginTop: 64 }}>
            {data && 
                <div>
                    <Table rowKey={record => record.addr} dataSource={data} columns={columns} />
                </div>
            }
      </div>
    );
  }

