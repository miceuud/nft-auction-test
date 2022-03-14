/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { useEffect } from 'react'
import { MetaMask } from 'src/connectors'
import NFTAuction from '../artifacts/contracts/Auction.sol/NFTAuction.json'

import logo from '../images/logo192.png'

const nft = {
  name: 'Creai Desperado',
  price: 200,
  imageUrl: logo,
}

export default function Home() {
  const { active, activate, library, account } = useWeb3React()

  useEffect(() => {
    if (!active) {
      activate(MetaMask)
    }

    if (active) {
      const auctionContract = new ethers.Contract(
        '0xA4B1322Ed01e70CCEC6Eba3E552253cd1a70EC12',
        NFTAuction.abi,
        library.getSigner(account),
      )

      const creaeteAuction = async (
        address: string,
        tokenId: number,
        minimumBid: number,
      ) => {
        try {
          const tx = await auctionContract.createAuction(
            address,
            tokenId,
            minimumBid,
          )
          const txReceipt = await tx.wait()
          // eslint-disable-next-line no-console
          console.log(txReceipt)
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error)
        }
      }

      const bid = async (bidAmount: any) => {
        try {
          const tx = await auctionContract.bid(bidAmount)
          const txReceipt = await tx.wait()
          // eslint-disable-next-line no-console
          console.log(txReceipt)
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error)
        }
      }

      const startAuction = async () => {
        try {
          const tx = await auctionContract.startAuction()
          const txReceipt = await tx.wait()
          // eslint-disable-next-line no-console
          console.log(txReceipt)
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error)
        }
      }

      const end = async () => {
        try {
          const tx = await auctionContract.end()
          const txReceipt = await tx.wait()
          // eslint-disable-next-line no-console
          console.log(txReceipt)
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error)
        }
      }

      const claimWin = async () => {
        try {
          const tx = await auctionContract.claimWin()
          const txReceipt = await tx.wait()
          // eslint-disable-next-line no-console
          console.log(txReceipt)
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error)
        }
      }
    }
  }, [active, library, account, activate])

  return (
    <>
      <div className="container">
        <header> Place a bid on the NFT and stand a chance of winning</header>

        <div>
          <div className="nft-container">
            <h2>Auctioned Item</h2>

            <div>
              <img src={nft.imageUrl} alt="" />
              <div>Name: {nft.name} </div>
              <div>Minimum starting Bid:{nft.price} Dai</div>
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
          </div>
          <div className="price-container container">
            <div>
              <div>
                <h2>A winner has emerged. </h2>
                <p> if you are the winner claim your price.</p>
                <p> If you didnt win, better luck next time, redeem your bid</p>
                <button type="button"> claim price</button>
                <button type="button"> redeem your bid</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
