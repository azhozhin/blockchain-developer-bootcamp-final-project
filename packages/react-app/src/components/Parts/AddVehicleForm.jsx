import React, { useEffect, useState } from "react";
import { Form, Modal, Upload, Button, Input } from "antd";
import ImgCrop from "antd-img-crop";
import faker from "faker";
import axios from "axios";
import { executeMethod, serializeVehicleMetadata } from "../../helpers/entityHelper";

const { TextArea } = Input;

// this have only Porsche & Kia
const fakeVehicleDatabaseUri = "https://ipfs.io/api/v0/ls/Qmbet8GLLkEAtcwr8A7pFDT9ZQqsXiEgEkZb6nL4PXpNm8";

export default function AddVehicleForm({
  setRefreshTrigger,
  readContracts,
  writeContracts,
  tx,
  pinataApi,
  visible,
  setVisible,
  address,
}) {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [progress, setProgress] = useState(0);
  const [fakeDatabase, setFakeDatabase] = useState({});
  const [make, setMake] = useState("");

  useEffect(() => {
    async function getFakeVehicleDatabase() {
      const req = await axios.get(fakeVehicleDatabaseUri);
      const folder = req.data.Objects[0].Links;

      const db = {};
      let make, model, year, msrp, frontWheelSize, horsepower, displacement, rest;
      folder.forEach(el => {
        [make, model, year, msrp, frontWheelSize, horsepower, displacement, ...rest] = el.Name.split("_");

        if (!db[make]) {
          db[make] = [];
        }
        db[make].push({
          make: make,
          model: model,
          year: year,
          engineSize: displacement * 100,
          url: "https://ipfs.io/ipfs/" + el.Hash,
        });
      });
      setFakeDatabase(db);
    }

    getFakeVehicleDatabase();
  }, []);

  useEffect(() => {
    async function getManufacturers() {
      if (address && readContracts && readContracts.VehicleLifecycleToken) {
        const manufacturers = await readContracts.VehicleLifecycleToken.getManufacturers();
        manufacturers.forEach(el => {
          if (address == el.addr) {
            setMake(el.name);
            return;
          }
        });
      }
    }
    getManufacturers();
  }, [address, readContracts]);

  const handleOk = async () => {
    setConfirmLoading(true);
    const fields = form.getFieldsValue();
    fields.imageUri = fileList[0].originFileObj ? fileList[0].originFileObj.url : fileList[0].url;
    let [obj, jsonName] = serializeVehicleMetadata(fields);
    const data = await pinataApi.pinJsonToIpfs(obj, jsonName);
    // we need to use proper IPFS link as it is enforced by smart contract
    const metadataUri = "ipfs://" + data.IpfsHash;
    try {
      const result = await executeMethod(
        tx,
        writeContracts.VehicleLifecycleToken.manufactureVehicle(
          fields.vin,
          fields.make,
          fields.model,
          fields.color,
          fields.year,
          fields.maxMileage,
          fields.engineSize,
          metadataUri,
        ),
        () => {
          setRefreshTrigger(Math.random().toString());
        },
      );
      setVisible(false);
      form.resetFields();
      setFileList([]);
    } catch (e) {
      console.log(e);
    }
    setConfirmLoading(false);
  };

  const onPreview = async file => {
    let src = file.originFileObj ? file.originFileObj.url : file.url; //file.originFileObj.url;
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

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const uploadImage = async options => {
    const { onSuccess, onError, file, onProgress } = options;
    const name = "policeDepartment-" + 1;
    const data = await pinataApi.pinFileToIpfsWithProgress(file, name, setProgress, onSuccess, onError, onProgress);
    file.url = "https://ipfs.io/ipfs/" + data.IpfsHash;
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setVisible(false);
  };

  const onFill = () => {
    let vehicle;
    if (make && fakeDatabase[make]) {
      const len = fakeDatabase[make].length;
      const idx = Math.floor(len * Math.random());
      const v = fakeDatabase[make][idx];
      vehicle = {
        make: v.make,
        model: v.model,
        year: v.year,
        engineSize: v.engineSize,
      };
      setFileList([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: v.url,
        },
      ]);
    } else {
      vehicle = {
        make: faker.vehicle.manufacturer(),
        model: faker.vehicle.model(),
        year: faker.datatype.number({ min: 2000, max: 2021, precision: 1 }),
        engineSize: faker.datatype.number({ min: 1500, max: 4000, precision: 100 }),
      };
    }
    vehicle.vin = faker.vehicle.vin();
    vehicle.color = faker.vehicle.color();
    vehicle.maxMileage = faker.datatype.number({ min: 50000, max: 300000, precision: 1000 });
    vehicle.description = faker.lorem.paragraph();
    form.setFieldsValue({
      vin: vehicle.vin,
      make: vehicle.make,
      model: vehicle.model,
      color: vehicle.color,
      year: vehicle.year,
      maxMileage: vehicle.maxMileage,
      engineSize: vehicle.engineSize,
      description: vehicle.description,
    });
  };

  return (
    <>
      <Modal
        title="Add Vehicle"
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
          <Form.Item name="vin" label="VIN" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="make" label="Make" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="model" label="Model" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="color" label="Color" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="year" label="Year" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="maxMileage" label="Mileage" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="engineSize" label="EngineSize" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Desc" rules={[{ required: true }]}>
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
