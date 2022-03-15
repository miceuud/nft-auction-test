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

import logo from '../images/logo192.png'
import NftAsset from './nftItem'

declare let window: any
// const user = {
//   name: 'Hedy Lamarr',
//   imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
//   imageSize: 90,
// }

export default function Home() {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()

  const auctionContract = new ethers.Contract(
    '0xcBc4507698e61339CeF0F0C442DE74260ACFFff1',
    NFTAuction.abi,
    signer,
  )
  const nftContract = new ethers.Contract(
    '0xfd11dC967b57C184F2864d40049109561221Ba9E',
    MyNFT.abi,
    provider,
  )
  const [nft, setNft] = useState(null)
  const [disable, setDisable] = useState(false)
  const [state, setState] = useState(0)

  const fetchAuction = async () => {
    const nftItem = await nftContract.fetchTokenUri()

    const data = await axios.get(nftItem)

    // const image = await axios.get(data.data.image)
    // console.log(image)
    // console.log(data.data)
    setNft(data.data)
  }

  const startBid = async () => {
    const startAuction = await auctionContract.start()
    startAuction.wait()
    console.log(startAuction)
  }

  const handleChange = (e) => {
    setState(state)
  }

  const bid = async () => {
    const bidTx = await auctionContract.bid(1)
    bidTx.wait()

    console.log(bidTx)
  }

  useEffect(() => {
    fetchAuction()
  }, [])

  return (
    <>
      <div>
        <header> Welcome to NFT Auction</header>
        <div> Place a bid and you might be lucky to win</div>
        <h4>Auction Item</h4>

        {/*
        <div>{nft.name}</div>
        <div>{nft.amount}</div> */}
        {/* <img src="{nft.image}" alt="" /> */}
      </div>
      <div>
        {nft && (
          <>
            <div>
              <img src={nft.image} width={150} height={150} alt="" />
            </div>
            <div> {nft.name}</div>
            <div> {nft.amount}</div>

            <button
              type="button"
              disabled={disable}
              onClick={() => {
                startBid
                setDisable(true)
              }}
            >
              {' '}
              Start Bid
            </button>

            <div>
              <span>Bid :</span>{' '}
              <input type="number" value={state} onChange={handleChange} />
              <button type="button">place bid</button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
