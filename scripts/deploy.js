const hre = require('hardhat')

async function main() {

  accounts = await ethers.getSigners()
  signer = accounts[0]

  const NFTAuction = await hre.ethers.getContractFactory('NFTAuction')
  const nftAuction = await NFTAuction.deploy(
    // rinkeby dia contract address
    '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
  )
  await nftAuction.deployed()

  const MyNFT = await hre.ethers.getContractFactory('MyNFT')
  const myNft = await MyNFT.deploy(nftAuction.address)
  await myNft.deployed()

  console.log('nft: ', myNft.address)
  console.log('auction: ', nftAuction.address)
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
