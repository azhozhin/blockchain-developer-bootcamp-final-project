import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="/" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="Vehicle Lifecycle Token"
        subTitle=""
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
