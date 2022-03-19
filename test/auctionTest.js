const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('Auction', function () {
  let NFTAuction
  let nftAuction

  let NFT
  let myNft
  let DaiToken
  let daiToken
  let accounts
  let signer

  beforeEach(async function () {
    DaiToken = await ethers.getContractFactory('DaiToken')
    daiToken = await DaiToken.deploy()

    await daiToken.deployed()

    NFTAuction = await hre.ethers.getContractFactory('NFTAuction')
    nftAuction = await NFTAuction.deploy(daiToken.address)
    await nftAuction.deployed()

    MyNFT = await hre.ethers.getContractFactory('MyNFT')
    myNft = await MyNFT.deploy(nftAuction.address)

    await myNft.deployed()

    accounts = await ethers.getSigners()
    signer = accounts[0]
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

    let create = await nftAuction.createAuction(myNft.address, tokenId, 100)
    let tx = await create.wait()

    expect(tx.events[2].event).to.equal('AuctionsStatus')
  })
  it('should start the auction', async function () {
    let tokenId = await myNft.createToken('www.mynft.com')
    tokenId = await tokenId.wait()
    tokenId = Number(tokenId.events[0].args[2])

    let create = await nftAuction.createAuction(myNft.address, tokenId, 100)
    let tx = await create.wait()

    const start = await nftAuction.start()
    const result = await start.wait()
    // console.log(result.events[0].args[])
  })

  it('user should be able to bid', async function () {
    let tokenId = await myNft.createToken('www.mynft.com')
    tokenId = await tokenId.wait()
    tokenId = Number(tokenId.events[0].args[2])

    let create = await nftAuction.createAuction(myNft.address, tokenId, 100)
    let tx = await create.wait()

    const start = await nftAuction.start()
    await start.wait()

    const bidder = accounts[1]

    daiToken.transfer(bidder.address, 500)

    await daiToken.connect(bidder).approve(nftAuction.address, 200)

    const bid = await nftAuction.connect(bidder).bid(200)
    const result = await bid.wait()
    expect(result.events[2].args[0]).to.equal(bidder.address)
    expect(Number(result.events[2].args.amount)).to.equal(200)
  })
})
