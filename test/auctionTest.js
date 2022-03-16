const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('Auction', function () {
  let NFTAuction
  let nftAuction

  let NFT
  let myNft

  beforeEach(async function () {
    NFTAuction = await hre.ethers.getContractFactory('NFTAuction')
    nftAuction = await NFTAuction.deploy()
    nftAuction.deployed()

    MyNFT = await hre.ethers.getContractFactory('MyNFT')
    myNft = await MyNFT.deploy(nftAuction.address)

    await myNft.deployed()
  })
  // NFT Token test
  it('should create an NFT token and return a token ID', async function () {
    let tokenId = await myNft.createToken('www.mynft.com')
    tokenId = await tokenId.wait()
    tokenId = Number(tokenId.events[0].args[2])

    expect(tokenId).to.be.a('number')
    expect(Number(tokenId)).to.equal(1)
  })
  it('should return token uri', async function () {
    const tokenUri = 'www.mynft.com'
    let uri = await myNft.createToken(tokenUri)
    await uri.wait()

    let _uri = await myNft.fetchTokenUri()

    expect(_uri).to.be.a('string')
    expect(_uri).to.equal(tokenUri)
  })

  // Auction Test

  it('should create an auction', async function () {
    let tokenId = await myNft.createToken('www.mynft.com')
    tokenId = await tokenId.wait()
    tokenId = Number(tokenId.events[0].args[2])

    const nftAddress = myNft.address
    const auction = await nftAuction.createAuction(myNft.address, tokenId, 100)
    const tx = await auction.wait()
  })
})
