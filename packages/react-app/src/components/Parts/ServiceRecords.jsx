import { Table } from "antd";
import React from "react";

export default function ServiceRecords({logs}){
    // timestamp: timestamp,
    //                 principal: "TBD",
    //                 mileage: mileage,
    //                 record: record,

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
            title: 'Mileage',
            dataIndex: 'mileage',
            key: 'mileage',
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