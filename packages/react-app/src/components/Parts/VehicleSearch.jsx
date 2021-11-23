import React, { useEffect, useState } from "react";
import { Table, Image, Input, Space, Select, Button } from "antd";
import { notification } from "antd";

const { Search } = Input;
const { Option } = Select;

export default function VehicleSearch({ readContracts, handleChange }) {
  const [searchMode, setSearchMode] = useState("vin");
  const [search, setSearch] = useState("");
  const [data, setData] = useState();

  const onSearch = async value => {
    console.log("onSearch:" + value);
    if (value != "") {
      console.log("Search:" + value);
      setSearch(value);
      let result;
      switch (searchMode) {
        case "tokenId":
          let tokenId;
          try {
            tokenId = BigInt(value);
          } catch (e) {
            notification.error({
              message: "Transaction Error",
              description: "" + e,
            });
            console.log(e);
            break;
          }
          if (tokenId) {
            try {
              result = await readContracts.VehicleLifecycleToken.getVehicleDetailsByTokenId(tokenId);
            } catch (e) {
              notification.error({
                message: "Transaction Error",
                description: "" + e,
              });
              console.log(e);
            }
          }
          break;
        case "vin":
          try {
            result = await readContracts.VehicleLifecycleToken.getVehicleDetailsByVin(value);
          } catch (e) {
            notification.error({
              message: "Transaction Error",
              description: "" + e,
            });
            console.log(e);
          }

          break;
        default:
          throw "Unexpected searchMode:" + searchMode;
      }
      console.log(result);
      if (result) {
        setData([result]);
      } else {
        setData([]);
      }
    } else {
      setData([]);
    }
  };
  const onChange = value => {
    console.log(value);
    setSearchMode(value);
  };

  const onTokenIdClick = (event, tokenId) => {
    event.stopPropagation();
    console.log("onTokenIdClick called");
    handleChange(tokenId);
  };

  // useEffect(async () => {
  // }, [search, readContracts]);

  const columns = [
    {
      title: "TokenId",
      dataIndex: "tokenId",
      key: "tokenId",
      width: "100px",
      render: tokenId => (
        <div>
          <Button type="link" onClick={event => onTokenIdClick(event, tokenId)}>
            {tokenId.toString()}
          </Button>
        </div>
      ),
    },
    {
      title: "Vin",
      dataIndex: "vin",
      key: "vin",
      render: vin => <div>{vin}</div>,
    },
    {
      title: "Make",
      dataIndex: "make",
      key: "make",
      width: "100px",
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      width: "150px",
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      width: "70px",
    },

    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      width: "70px",
    },
  ];

  const selectBefore = (
    <Select defaultValue="vin" className="select-before" onChange={onChange} style={{ width: "100px" }}>
      <Option value="vin">vin</Option>
      <Option value="tokenId">tokenId</Option>
    </Select>
  );

  return (
    <Space direction="vertical" style={{ width: "800px" }}>
      <Search
        addonBefore={selectBefore}
        placeholder="search text"
        allowClear
        enterButton="Search"
        size="large"
        onSearch={onSearch}
      />

      <Table rowKey={record => record.tokenId} columns={columns} dataSource={data} />
    </Space>
  );
}
