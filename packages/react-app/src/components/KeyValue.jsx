import React from "react";
import { Col} from "antd";

export default function KeyValue(props){
    return (
        <>
            <Col span={12}>{props.name}</Col>
            <Col span={12}>{props.value}</Col>
        </>
    )
}