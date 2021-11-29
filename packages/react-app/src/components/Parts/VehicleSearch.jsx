import React, { useEffect, useState } from "react";
import { Table, Image, Input, Space, Select, Button, Divider } from "antd";
import { notification } from "antd";

const { Search } = Input;
const { Option } = Select;

export default function VehicleSearch({ readContracts, handleChange }) {
  const [searchMode, setSearchMode] = useState("tokenId");
  const [search, setSearch] = useState("");
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  const onSearch = async value => {
    if (value != "") {
      setLoading(true);
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
          }

          break;
        default:
          throw "Unexpected searchMode:" + searchMode;
      }
      if (result) {
        setData([result]);
      } else {
        setData([]);
      }
      setLoading(false);
    } else {
      setData([]);
    }
  };

  const onChange = value => {
    setSearchMode(value);
  };

  const onTokenIdClick = (event, tokenId) => {
    event.stopPropagation();
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
    <Select defaultValue="tokenId" className="select-before" onChange={onChange} style={{ width: "100px" }}>
      <Option value="vin">vin</Option>
      <Option value="tokenId">tokenId</Option>
    </Select>
  );

  const onFill = async () => {
    console.log("hi");
    const totalSupply = await readContracts.VehicleLifecycleToken.totalSupply;
    console.log(totalSupply);
  };

  return (
    <>
      <Search
        addonBefore={selectBefore}
        placeholder="search text"
        allowClear
        enterButton="Search"
        size="large"
        onSearch={onSearch}
      />
      <Button key="fillForm" type="link" htmlType="button" onClick={onFill}>
        Show All
      </Button>
      <Divider />
      <Table rowKey={record => record.tokenId} columns={columns} dataSource={data} loading={loading} />
    </>
  );
}
