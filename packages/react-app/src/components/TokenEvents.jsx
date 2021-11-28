import { List, Table } from "antd";
import { useEventListener } from "eth-hooks/events/useEventListener";
import { Address } from "../components";

export default function TokenEvents({
  contracts,
  contractName,
  eventName,
  localProvider,
  mainnetProvider,
  startBlock,
  tokenId,
}) {
  // 📟 Listen for broadcast events
  const events = useEventListener(contracts, contractName, eventName, localProvider, startBlock);

  const columns = [
    {
      title: "Property",
      dataIndex: "tokenId",
      key: "tokenId",
      width: "120px",
      render: (tokenId, record) => <div>{record.args.tokenId.toString()}</div>,
    },
    {
      title: "Property",
      dataIndex: "from",
      key: "from",
      width: "120px",
      render: (from, record) => <div>{record.args.from}</div>,
    },
    {
      title: "Value",
      dataIndex: "to",
      key: "to",
      render: (to, record) => <div>{record.args.to}</div>,
    },
  ];

  return (
    <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
      {/* <Table
        dataSource={events}
        columns={columns}
        renderItem={item => {
            if (item.args.tokenId.toString()==tokenId.toString()){
                return (
                    <List.Item key={item.blockNumber + "_" + item.args.from + "_" + item.args.to}>
                      <Address address={item.args.from} ensProvider={mainnetProvider} fontSize={16} />
                      <Address address={item.args.to} ensProvider={mainnetProvider} fontSize={16} />
                    </List.Item>
                  );
            }
        }}
      /> */}
    </div>
  );
}
