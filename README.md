# PROTOFIRE NFT Auction DApp

## Requirements

You must have the following installed on your Machine to run this code:

- Solidity compiler
- Metamask chrome or Firefox plugin
- Hardhat
- Private API key - Rinkeby 

## To run this project  

- First clone this repository `https://github.com/miceuud/protofire-nft-auction-test`

- cd into the cloned project folder on your terminal from your machine

- Run `yarn install` to install dependencies

- Get an Alchemy API key if don't have one from https://alchemy.com/

- Request Ethers from the rinkeby faucet https://faucet.rinkeby.io/ to your metamask wallet

- Visit https://app.compound.finance/ to borrow Dai to your metamask wallet

- Add Dai token to your metamask wallet using this contract address `0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea`

- In the `hardhat.config.js` file, update the private key and accounts with your details in the network section 

- In a seperate terminal run `npx hardhat run scripts/deploy.js --network rinkeby`

- Create a `.env` file in the root of the project, copy and replace the details with the auction, nft contract address from the console.log statement outputted from the deployed script

- Start the app by running `yarn start`


## Testing (Hardhat)

- Run test locally with hardhat account and Mock Dai tokens 

- To speed up test, change the auction end-time in the auction contract to 30 seconds

- Run `npx hardhat test`



