/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
// import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import MyNFT from '../artifacts/contracts/CreatNFT.sol/MyNFT.json'
import NFTAuction from '../artifacts/contracts/Auction.sol/NFTAuction.json'

import daiAbi from '../daiAbi/abi.json'

declare let window: any
let signerAddress

export default function Home() {
  const provider = new ethers.providers.Web3Provider(window.ethereum)

  const signer = provider.getSigner()

  const auctionContract = new ethers.Contract(
    process.env.REACT_APP_AUCTION_ADDRESS,
    NFTAuction.abi,
    signer,
  )
  const nftContract = new ethers.Contract(
    process.env.REACT_APP_NFT_ADDRESS,
    MyNFT.abi,
    provider,
  )

  const daiAddress = process.env.REACT_APP_DIA_ADDRESS

  const daiContract = new ethers.Contract(daiAddress, daiAbi, signer)

  const [nft, setNft] = useState(null)
  const [bidAmount, setBidAmount] = useState(0)

  const fetchAuction = async () => {
    try {
      const nftItem = await nftContract.fetchTokenUri()
      const data = await axios.get(nftItem)
      console.log(data)
      setNft(data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const startBid = async () => {
    try {
      const startAuction = await auctionContract.start()
      await startAuction.wait()
    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = (e) => {
    setBidAmount(e.target.value)
  }

  const bid = async () => {
    try {
      signerAddress = await signer.getAddress()

      const bool = await daiContract.approve(
        process.env.REACT_APP_AUCTION_ADDRESS,
        bidAmount,
      )
      await bool.wait()
      console.log(bool)
      if (bool) {
        const daiBalance = await daiContract.allowance(
          signerAddress,
          process.env.REACT_APP_AUCTION_ADDRESS,
        )
        if (daiBalance) {
          const userBid = await auctionContract.bid(bidAmount, {
            gasLimit: 5000000,
          })
          const tx = await userBid.wait()
          console.log(tx)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const end = async () => {
    try {
      const endBid = await auctionContract.end()
      await endBid.wait()
    } catch (error) {
      console.log(error)
    }
  }

  const claim = async () => {
    try {
      const startAuction = await auctionContract.claimWin()
      await startAuction.wait()
    } catch (error) {
      console.log(error)
    }
  }

  const redeem = async () => {
    try {
      const startAuction = await auctionContract.redeemBid()
      await startAuction.wait()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchAuction()
  }, [])

  return (
    <>
      <div>
        <div className="main">
          <header> Welcome to NFT Auction</header>
          <div className="title">
            {' '}
            Place a bid and you might be lucky to win
          </div>
          <h4>Auction Item</h4>
        </div>

        {/* <div className="main">
          {nft && <> There is no item currently been auctioned</>}
        </div> */}
      </div>
      <div className="assets-container main">
        {nft && (
          <>
            <div>
              <img src={nft.image} width={150} height={150} alt="" />
            </div>
            <div>
              {' '}
              <span className="details"> NFT name: </span>
              {nft.name}
            </div>
            <div>
              {' '}
              <span>Starting Bid: </span> {nft.amount}
            </div>

            <button type="button" className="btn" onClick={startBid}>
              {' '}
              Start Bid
            </button>

            <div>
              <span>Bid :</span>{' '}
              <input type="number" value={bidAmount} onChange={handleChange} />
              <button type="button" onClick={bid}>
                place bid
              </button>
              <button type="button" onClick={end}>
                end bid
              </button>
            </div>
          </>
        )}
      </div>
      <div className="main">
        {nft && (
          <>
            <div>Congrats the bid has end</div>
            <div className="claim">
              <span>If you won, claim price </span>{' '}
              <button type="button" onClick={claim}>
                {' '}
                Claim
              </button>
            </div>
            <div className="">
              <span>Else Redeem your token</span>{' '}
              <button type="button" onClick={redeem}>
                {' '}
                Redeem
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
