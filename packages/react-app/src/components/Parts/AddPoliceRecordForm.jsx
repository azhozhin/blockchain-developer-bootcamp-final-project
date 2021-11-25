import moment from "moment";
import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, DatePicker } from "antd";
import { pinJsonToIpfs } from "../../helpers/ipfsHelper";
import { executeMethod } from "../../helpers/entityHelper";

const incidents = [
  "hit road divider",
  "hit road sign",
  "hit another car",
  "fall off bridge",
  "hit animal crossing the road",
];

export default function AddPoliceRecordForm({ visible, setVisible, vehicleDetails, writeContracts, tx }) {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOk = async () => {
    setConfirmLoading(true);
    const fields = form.getFieldsValue();
    const obj = {
      vin: fields.vin,
      vehicle: fields.vehicle,
      color: fields.color,
      year: fields.year,
      datetime: fields.datetime.format("YYYY-MM-DD HH:mm:ss"),
      summary: fields.summary,
      details: fields.details,
    };
    const name = "policeRecord-" + fields.vin;
    const data = await pinJsonToIpfs(
      obj,
      name,
      "d91c1c142f067b652a0c",
      "868e2bdeebb78dd531969872283050ceeda15a72f78cef991150dac03daac740",
    );
    const metadataUri = "https://ipfs.io/ipfs/" + data.IpfsHash;
    try {
      const tokenId = BigInt(vehicleDetails.tokenId);
      const result = await executeMethod(
        tx,
        writeContracts.VehicleLifecycleToken.addPoliceLogEntry(tokenId, metadataUri),
      );
      setVisible(false);
      form.resetFields();
    } catch (e) {
      console.log(e);
    }
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onFill = () => {
    const rndIdx = Math.floor(Math.random() * incidents.length);
    form.setFieldsValue({
      vin: vehicleDetails.vin,
      datetime: moment(new Date()).set({ hours: 0, minutes: 0, seconds: 0 }),
      summary: "The car " + incidents[rndIdx],
      details: "Incident Details would go here",
    });
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        vin: vehicleDetails.vin,
        vehicle: vehicleDetails.make + " " + vehicleDetails.model,
        color: vehicleDetails.color,
        year: vehicleDetails.year,
      });
    }
  }, [visible]);

  return (
    <Modal
      title="Add Police Record"
      visible={visible}
      footer={[
        <Button key="fillForm" type="link" htmlType="button" onClick={onFill}>
          Fill form
        </Button>,
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={confirmLoading} onClick={handleOk}>
          Confirm
        </Button>,
      ]}
      getContainer={false}
    >
      <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} layout="horizontal">
        <Form.Item name="vin" label="Vin" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="vehicle" label="Vehicle" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="color" label="Color" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="year" label="Year" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="datetime" label="Date" rules={[{ required: true }]}>
          <DatePicker format={"YYYY-MM-DD HH:mm:ss"} showTime />
        </Form.Item>
        <Form.Item name="summary" label="Summary" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="details" label="Details" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
