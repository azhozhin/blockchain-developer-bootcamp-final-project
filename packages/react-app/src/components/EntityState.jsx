import React from "react";

// displays a page header

export default function EntityState(props) {
  let text;
  switch(props.state){
    case 0:
      text = "SUSPENDED";
      break;
    case 1: 
      text = "ACTIVE";
      break;
    default:
      throw "Unexpected state: "+props.state;
  }
  return (
    <span>{text}</span>
  );
}
