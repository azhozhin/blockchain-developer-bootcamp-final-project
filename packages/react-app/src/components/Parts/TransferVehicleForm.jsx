import React, { useEffect, useState } from "react";
import { Space, Form, Modal, Image, Button, Input } from "antd";
import { AddressInput } from "..";
import { executeMethod } from "../../helpers/entityHelper";

export default function TransferVehicleForm({ address, visible, setVisible, readContracts, writeContracts, tokenId, tx }) {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOk = async () => {
    setConfirmLoading(true);
    const fields = form.getFieldsValue();

    try {
      const fromAddr = address;
      const toAddr = fields.toAddr;
      const result = await executeMethod(tx, writeContracts.VehicleLifecycleToken.transferFrom(fromAddr, toAddr, tokenId));
      setVisible(false);
      form.resetFields();
    } catch (e) {
      console.log(e);
    }
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  return (
    <>
      <Modal
        title="Transfer Vehicle"
        visible={visible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" loading={confirmLoading} onClick={handleOk}>
            Confirm
          </Button>,
        ]}
        getContainer={false}
      >
        <div>{tokenId.toString()}</div>
        <Image />
        <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} layout="horizontal">
          <Form.Item name="toAddr" label="To Addr" rules={[{ required: true }]}>
            <AddressInput />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
