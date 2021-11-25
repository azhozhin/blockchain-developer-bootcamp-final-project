import { Table } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PoliceRecords({ tokenId, readContracts, refreshTrigger }) {
  const [loading, setLoading] = useState(false);
  const [policeDepartmentMap, setPoliceDepartmentMap] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    async function getReferenceData() {
      if (tokenId && readContracts && readContracts.VehicleLifecycleToken) {
        setLoading(true);
        const policeDepartments = await readContracts.VehicleLifecycleToken.getPoliceDepartments();
        const pdm = Object.assign({}, ...policeDepartments.map(x => ({ [x.addr]: x.name })));
        setPoliceDepartmentMap(pdm);

        const rawPoliceLogs = await readContracts.VehicleLifecycleToken.getPoliceLogEntries(tokenId);
        const policeLogs = [];
        for (const log of rawPoliceLogs) {
          const timestamp = log.timestamp;
          const recordUri = log.recordUri;
          const recordResp = await axios.get(recordUri);
          const record = recordResp.data;
          policeLogs.push({
            timestamp: timestamp,
            principal: log.principal,
            record: record,
          });
        }
        setLogs(policeLogs);

        setLoading(false);
      }
    }
    getReferenceData();
  }, [readContracts, tokenId, refreshTrigger]);

  const columns = [
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      width: '150px',
      render: (timestamp, record) => <div>{record.record.datetime}</div>,
    },
    {
      title: "Principal",
      dataIndex: "principal",
      key: "principal",
      render: principal => <div>{policeDepartmentMap[principal]}</div>,
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
