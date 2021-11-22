import React, { useEffect, useState } from "react";
import { Address } from "..";
import { Table, Switch, Image } from "antd";
import axios from "axios";

export default function PoliceDepartments({
    readContracts,
  }) {
    const [data, setData] = useState();
  
    useEffect(() => {
      async function getServiceFactories() {
        if (readContracts && readContracts.VehicleLifecycleToken){
          const newData = await readContracts.VehicleLifecycleToken.getServiceFactories();
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
                  address: {
                    addressLine: attrs.address_line,
                    postalCode: attrs.postal_code,
                    country: attrs.country,
                  }
                });
              })
              setData(dt);
              console.log(dt);
            });
          
        }
      }
      getServiceFactories();
    }, [readContracts]);
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
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        width: '150px',
        render: address => 
          <div>
            {address.addressLine}, {address.postalCode} 
            <div>{address.country}</div>
          </div>
      },
      {
        title: 'State',
        dataIndex: 'state',
        key: 'state',
        width: '100px',
        render: state => 
          <Switch checkedChildren="ACTIVE" unCheckedChildren="SUSPENDED" checked={state} />
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
        <div>
         <Table rowKey={record => record.address} dataSource={data} columns={columns} />
        </div>
      </div>
    );
  }

