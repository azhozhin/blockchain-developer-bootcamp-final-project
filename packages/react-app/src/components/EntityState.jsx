import React from "react";
import { Switch } from "antd";

// displays a page header

export default function EntityState(props) {
  return (
    <Switch 
      checkedChildren="ON" 
      unCheckedChildren="OFF" 
      checked={props.state} 
      disabled={!props.allowed} 
      onChange={props.onChange}
      style={{width: '60px' }}/>
  );
}
