import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { Address } from "..";
import axios from "axios";

export default function ServiceRecords({ readContracts, tokenId, refreshTrigger, pinataApi }) {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [serviceFactoryMap, setServiceFactoryMap] = useState({});

  useEffect(() => {
    async function getServiceFactories() {
      if (readContracts && readContracts.VehicleLifecycleToken) {
        const serviceFactories = await readContracts.VehicleLifecycleToken.getServiceFactories();
        const sfm = Object.assign({}, ...serviceFactories.map(x => ({ [x.addr]: x.name })));
        setServiceFactoryMap(sfm);
      }
    }
    getServiceFactories();
  }, []);

  useEffect(() => {
    async function getReferenceData() {
      if (tokenId && readContracts && readContracts.VehicleLifecycleToken) {
        setLoading(true);
        const rawServiceLogs = await readContracts.VehicleLifecycleToken.getServiceLogEntries(tokenId);
        const serviceLogs = [];
        for (const log of rawServiceLogs) {
          const timestamp = log.timestamp;
          const principal = log.principal;
          const mileage = log.mileage;
          const recordUri = pinataApi.convertToUrl(log.recordUri);
          const recordResp = await axios.get(recordUri);
          const record = recordResp.data;
          serviceLogs.push({
            timestamp: timestamp,
            principal: principal,
            mileage: mileage,
            record: record,
          });
        }
        setLogs(serviceLogs);

        setLoading(false);
      }
    }
    getReferenceData();
  }, [tokenId, refreshTrigger]);

  const columns = [
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      width: "150px",
      render: (timestamp, record) => <div>{record.record.datetime}</div>,
    },
    {
      title: "Mileage",
      dataIndex: "mileage",
      key: "mileage",
    },
    {
      title: "Principal",
      dataIndex: "principal",
      key: "principal",
      render: principal => <div>{serviceFactoryMap[principal]}</div>,
    },
    {
      title: "Record",
      dataIndex: "record",
      key: "record",
      render: record => <div>{record.summary}</div>,
    },
  ];
  return (
    <div>
      <Table
        rowKey={record => record.timestamp}
        dataSource={logs}
        columns={columns}
        pagination={false}
        loading={loading}
        size="small"
      />
    </div>
  );
}
