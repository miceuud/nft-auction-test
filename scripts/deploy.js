const hre = require('hardhat')

async function main() {
  const NFTAuction = await hre.ethers.getContractFactory('NFTAuction')
  const nftAuction = await NFTAuction.deploy()

  await nftAuction.deployed()

  const auctionAddress = nftAuction.address

  const MyNFT = await hre.ethers.getContractFactory('MyNFT')
  const creatNft = await MyNFT.deploy(auctionAddress)

  await creatNft.deployed()

  console.log('this is auction address:', nftAuction.address)
  console.log('this is nft address:', creatNft.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
