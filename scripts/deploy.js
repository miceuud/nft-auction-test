const hre = require('hardhat')

async function main() {
  const NFTAuction = await hre.ethers.getContractFactory('NFTAuction')
  const nftAuction = await NFTAuction.deploy()

  await nftAuction.deployed()

  console.log('auction', nftAuction.address)

  const MyNFT = await hre.ethers.getContractFactory('MyNFT')
  const myNft = await MyNFT.deploy(nftAuction.address)

  await myNft.deployed()

  console.log('nft: ', myNft.address)
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
