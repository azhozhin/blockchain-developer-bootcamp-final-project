import moment from "moment";
import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, DatePicker } from "antd";
import { pinJsonToIpfs } from "../../helpers/ipfsHelper";
import { executeMethod } from "../../helpers/entityHelper";

const services = [
  {
    name: "interim service",
    description: "Checked the levels of fluids, including brake fluid, screen wash and antifreeze coolant",
  },
  {
    name: "full service",
    description: "Checked lights, tyres, exhaust and operations of brakes and steering",
  },
];

export default function AddServiceRecordForm({ visible, setVisible, vehicleDetails, writeContracts, tx }) {
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
      mileage: fields.mileage,
      datetime: fields.datetime.format("YYYY-MM-DD HH:mm:ss"),
      summary: fields.summary,
      details: fields.details,
    };
    const name = "serviceRecord-" + fields.vin;
    const data = await pinJsonToIpfs(
      obj,
      name,
      "d91c1c142f067b652a0c",
      "868e2bdeebb78dd531969872283050ceeda15a72f78cef991150dac03daac740",
    );
    // we need to use proper IPFS link as it is enforced by smart contract
    const metadataUri = "ipfs://" + data.IpfsHash;
    try {
      const tokenId = BigInt(vehicleDetails.tokenId);
      const mileage = parseInt(fields.mileage);
      const result = await executeMethod(
        tx,
        writeContracts.VehicleLifecycleToken.addServiceLogEntry(tokenId, mileage, metadataUri),
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
    const rndIdx = Math.floor(Math.random() * services.length);
    form.setFieldsValue({
      vin: vehicleDetails.vin,
      datetime: moment(new Date()).set({ hours: 0, minutes: 0, seconds: 0 }),
      summary: services[rndIdx].name,
      details: services[rndIdx].description,
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
      title="Add Service Record"
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
        <Form.Item name="mileage" label="Mileage" rules={[{ required: true }]}>
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
