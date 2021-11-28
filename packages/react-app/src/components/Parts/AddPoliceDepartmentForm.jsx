import moment from "moment";
import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, Upload } from "antd";
import ImgCrop from "antd-img-crop";

const { TextArea } = Input;
import { AddressInput } from "..";
import faker from "faker";
import { entityType, executeMethod, serializePoliceDepartmentMetadata } from "../../helpers/entityHelper";

const incidents = [
  "hit road divider",
  "hit road sign",
  "hit another car",
  "fall off bridge",
  "hit animal crossing the road",
];

export default function AddPoliceDepartmentForm({ visible, setVisible, writeContracts, pinataApi, tx }) {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [progress, setProgress] = useState(0);

  const handleOk = async () => {
    setConfirmLoading(true);
    const fields = form.getFieldsValue();
    fields.imageUri = fileList[0].originFileObj.url;
    const [obj, jsonName] = serializePoliceDepartmentMetadata(fields);
    const data = await pinataApi.pinJsonToIpfs(obj, jsonName);
    const metadataUri = "https://ipfs.io/ipfs/" + data.IpfsHash;
    try {
      const result = await executeMethod(
        tx,
        writeContracts.VehicleLifecycleToken.add(entityType.POLICE, fields.addr, fields.name, metadataUri),
        () => {
          setVisible(false);
        },
        () => {},
      );

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

  const onFill = () => {
    const rndIdx = Math.floor(Math.random() * incidents.length);
    const cityName = faker.address.cityName();
    form.setFieldsValue({
      name: cityName + " Police Department",
      description: faker.lorem.paragraph(),
      externalUri: faker.internet.url(),
      addressLine: faker.address.streetAddress() + ", " + cityName,
      postalCode: faker.address.zipCode(),
      country: "United States",
    });
  };

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async file => {
    let src = file.originFileObj.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const uploadImage = async options => {
    const { onSuccess, onError, file, onProgress } = options;
    const name = "policeDepartment-" + 1;
    const data = await pinataApi.pinFileToIpfsWithProgress(file, name, setProgress, onSuccess, onError, onProgress);
    file.url = "https://ipfs.io/ipfs/" + data.IpfsHash;
  };

  useEffect(() => {
    // form.setFieldsValue({
    //   vin: vehicleDetails.vin,
    //   vehicle: vehicleDetails.make + " " + vehicleDetails.model,
    //   color: vehicleDetails.color,
    //   year: vehicleDetails.year,
    // });
  }, [visible]);

  return (
    <Modal
      title="Add Police Department"
      visible={visible}
      onCancel={handleCancel}
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
        <Form.Item name="image" label="Image" rules={[{ required: true }]}>
          <ImgCrop>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={onPreview}
              onChange={onChange}
              customRequest={uploadImage}
            >
              {fileList.length < 1 && "+ Upload"}
            </Upload>
          </ImgCrop>
        </Form.Item>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Desc" rules={[{ required: true }]}>
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item name="externalUri" label="Url" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="addressLine" label="Address" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="postalCode" label="PostCode" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="country" label="Country" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="addr" label="Addr" rules={[{ required: true }]}>
          <AddressInput />
        </Form.Item>
      </Form>
    </Modal>
  );
}
