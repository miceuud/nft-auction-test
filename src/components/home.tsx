/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
// import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
// import { MetaMask } from 'src/connectors'
import NFTAuction from '../artifacts/contracts/Auction.sol/NFTAuction.json'
import logo from '../images/logo192.png'

declare let window: any

export default function Home() {
  const [loading, setLoading] = useState('....loading')
  const [nft, setNft] = useState(null)

  const obj = {
    name: 'Picaso',
    amount: 10,
    image: logo,
  }
  useEffect(
    () => {
      setNft(true)
    },
    [nft] /* [library, account] */,
  )
  return (
    <>
      <div>
        <header> Welcome to NFT Auction</header>
        <div> Place a bid and you might be lucky to win</div>

        <h4>Auction Item</h4>
      </div>

      <div>
        {!nft ? (
          <div>{loading}</div>
        ) : (
          <>
            <div>
              <img src="{obj.image}" alt="" />
              <div>Name: </div>
              <div>Minimum starting Bid: Dai</div>
              <button type="button"> Start Auction</button>
              <div>
                <input type="number" />
                <button type="button" name="bid" value="amount">
                  Bid
                </button>
              </div>
              <div>
                <button type="button" disabled>
                  End
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
