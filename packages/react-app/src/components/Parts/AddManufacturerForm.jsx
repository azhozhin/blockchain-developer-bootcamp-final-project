import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, Upload } from "antd";

export default function AddManufacturerForm({ visible, setVisible, writeContracts, pinataApi, tx, setRefreshTrigger }) {
  const handleOk = async () => {
    setVisible(false);
    setRefreshTrigger(Math.random().toString());
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <Modal
      title="Add Manufacturer"
      visible={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Confirm
        </Button>,
      ]}
      getContainer={false}
    >
      <h1>Under development</h1>
    </Modal>
  );
}
