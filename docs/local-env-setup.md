# Local env setup

## Pre-requisites

- Node 16.x
- Yarn 1.22
- Infura account with API key
- Pinata account with API key

## How to run dev env

All commands should be executed from the root of repository.

> in a first terminal window, start your local blockchain:

```bash
yarn install
yarn chain
```

Please check deployment script and change addresses to yours: `packages/hardhat/deploy/00_deploy_your_contract.js` (all addresses are different in this setup).

```js
{
...
  // Manufacturers
  await vehicleLifecycleToken.add(
    1,
    "0xDE740E368128Ece3e604dC9db747679A469f0Dd3", 
    "Porsche",
    "ipfs://QmRPjEtKnH56T3Khdq4YP6sWWEzHAfWXbnpS4Y9Qz6embE");
  await vehicleLifecycleToken.add(
    1,
    "0xb67EDD32D46ceD740b0F45ccD8408fa87FFA9C05", 
    "Kia",
    "ipfs://QmWYVZj53Gyepykg8FQN6i5WHuv1dq8NWKnSefTFkVn77U");

  // Service factories
  await vehicleLifecycleToken.add(
    2,
    "0x3B81e758Bd8163f5db425e7Fba402E18FCc8958D", 
    "Plaza Kia",
    "ipfs://QmUzD5MAFYU2LDKSQN5kiTH5xcM2aGLiK4TdS1rFYPcyKv");
  await vehicleLifecycleToken.add(
    2,
    "0x44d5Fb46BcA0bB486836789c40838bd5404834AB",
    "Manhattan Motorcars",
    "ipfs://QmWrdYxiA4LkiEuMFdhPy3pUBDHaqQJkFKe152XhVNHrsT");

  // Police Departments
  await vehicleLifecycleToken.add(
    3,
    "0x332b3E20452bD9d89Cf89473111BeA0c052E651a", 
    "New York City Police Department", 
    "ipfs://QmUyKBosqz2dzynvCP1qxa4rZrFgf1Z5dCbC7ozJpPrKUE");
  await vehicleLifecycleToken.add(
    3,
    "0x7b25648f9C5aDF7A887Ac451A69F137cde90916E", 
    "Metropolitan Police Department of the District of Columbia", 
    "ipfs://QmYy3UjFmCWbgPHvQT2Sxq8BDRynddGFhPc9wtvsHs7vJk");
    
  // Admin role and ownership
  await vehicleLifecycleToken.setAdminRole("0x06199F0B1312DDAD50daCD024a52323c3ff91312");
  await vehicleLifecycleToken.transferOwnership("0x06199F0B1312DDAD50daCD024a52323c3ff91312");
...
}
```

> in a second terminal window, deploy your contract:

```bash
yarn deploy
```

You need to configure pinata api keys, otherwise media/metadata upload to IPFS would not work.
Update file `packages/react-app/.env`:

```yaml
REACT_APP_PINATA_API_KEY=<pinata-api-key>
REACT_APP_PINATA_API_SECRET=<pinata-api-secret>
```

> in a third terminal window, start your frontend:

```bash
yarn start
```

Open [http://localhost:3000](http://localhost:3000) to see the app

## Metamask default localhost network would not work

If you select default metamask localhost network you will see the following exception in UI:

![Wrong network local dev](images/wrong-network-local-dev-env.png)

Please make sure you have created new network in metamask as default `localhost 8545` would not work as hardhat network have different chainId and it would not be able to interact with hatdhat local chain.

![New local network in metamask](images/metamask/new-local-network.png)