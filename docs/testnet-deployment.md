# Prepare for testnet/mainnet

## Configure contract deployment

Generate deployer account.

```bash
yarn generate
```

It will create file in `packages\hardhat` with mnemonic.

Change destination in `packages\hardhat\hardhat.config.js` (example for `ropsten` testnet):

```javascript
const defaultNetwork = "ropsten";
```

Update credentials for deployment in `packages\hardhat\.env` (example for `ropsten` testnet):

```yaml
# Ropsten
ROPSTEN_INFURA_KEY=<infura-secret-key>
ROPSTEN_DEPLOYER_PRIV_KEY=<deployer-private-key>
```

Deploy to target network

```bash
yarn deploy
```

You might need to tweak gas in `packages\hardhat\hardhat.config.js` for your network :

```js
  networks: {
...
    ropsten: {
      url: "https://ropsten.infura.io/v3/<infura-project-id>", 
      gasPrice: 10*1000000000, // default gas price might be too low
      accounts: {
        mnemonic: mnemonic(),
      },
    },
...
  }
```

### Configure front-end app

Example yaml for `ropsten` testnet. You need to create accounts on **infura** and **pinata** and generate api keys.

Update file `packages/react-app/.env`:

```yaml
REACT_APP_PROVIDER=https://ropsten.infura.io/v3/<your-infura-project-id>
REACT_APP_NETWORK=ropsten
REACT_APP_PINATA_API_KEY=<pinata-api-key>
REACT_APP_PINATA_API_SECRET=<pinata-api-secret>
```

## Deploy front-end to IPFS

The main idea is to have fully distributed application setup, thus it worth to deploy front-end to IPFS

Build production version of react-application

```bash
yarn build
```

And deploy it to IPFS

```bash
yarn ipfs
```

In the end you would see destination address in console output, like the following:

```bash
🛰  Sending to IPFS...
📡 App deployed to IPFS with hash: QmcKXUATLnKyozrN61jbcT195ipf9aUQFTcuPmWN8SWhPG

🚀 Deployment to IPFS complete!

Use the link below to access your app:
   IPFS: https://ipfs.io/ipfs/QmcKXUATLnKyozrN61jbcT195ipf9aUQFTcuPmWN8SWhPG

```

It is good idea to pin this url in pinata to make sure it would not disappear randomly.