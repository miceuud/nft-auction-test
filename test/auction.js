const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('Auction', function () {
  it('should return dai balance ', async function () {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send('eth_requestAccounts', [])

    const NFTAuction = await hre.ethers.getContractFactory('NFTAuction')
    const nftAuction = await NFTAuction.deploy()

    await nftAuction.deployed()

    let balance = await nftAuction.getBalance()

    // // create nft
    // let tokenId = await myNft.createToken("www.mynft.com");
    // tokenId = await tokenId.wait();
    // tokenId = await tokenId.events[0].args[2].toString();

    expect(balance).to.be.a('number')
    // expect(Number(tokenId)).to.equal(1);
  })
})
