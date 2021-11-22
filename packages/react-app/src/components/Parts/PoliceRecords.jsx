import { Table } from "antd";
import React from "react";

export default function PoliceRecords({logs}){

    const columns = [
        {
            title: 'Timestamp',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (timestamp, record)=>
                <div>
                    {record.record.datetime}
                </div>
        },
        {
            title: 'Principal',
            dataIndex: 'principal',
            key: 'principal',
        },
        {
            title: 'Record',
            dataIndex: 'record',
            key: 'record',
            render: (record)=>
                <div>
                    {record.summary}
                </div>
        },
    ];
    return (
        <div>
            <Table rowKey={record => record.timestamp} dataSource={logs} columns={columns} pagination={false} />
        </div>
    );
    
}