/* eslint-disable no-bitwise */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */

// --------------------------
import { useState } from 'react'
import { ethers } from 'ethers'

import ipfs from '../helper/ipfs'
import uploadToIpfs from '../helper/ipfsUpload'

import MyNFT from '../artifacts/contracts/CreatNFT.sol/MyNFT.json'
import NFTAuction from '../artifacts/contracts/Auction.sol/NFTAuction.json'

declare let window: any

// eslint-disable-next-line react-hooks/rules-of-hooks

export default function CreateNft() {
  const [state, setState] = useState({
    name: '',
    amount: 0,
  })

  let imageUri: string | undefined

  const onChange = async (e: any) => {
    try {
      // upload image to ipfs
      imageUri = await ipfs(e.target.files[0])
      imageUri = `https://ipfs.io/ipfs/${imageUri}`

      console.log('ipfs-here: ', imageUri)
    } catch (error) {
      console.log(`unable to upload: ${error.message}`)
    }
  }
  //  get input fields
  const handleChange = (e: { target: { name: any; value: any } }) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    })
  }
  // // upload all meta data to ipfs
  const upload = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send('eth_requestAccounts', [])
    const signer = provider.getSigner()

    const nft = new ethers.Contract(
      process.env.REACT_APP_NFT_ADDRESS,
      MyNFT.abi,
      signer,
    )

    const auction = new ethers.Contract(
      process.env.REACT_APP_AUCTION_ADDRESS,
      NFTAuction.abi,
      signer,
    )
    try {
      const data = await uploadToIpfs(state, imageUri)
      const metadata = await ipfs(JSON.stringify(data))

      console.log('image-here: ', imageUri)
      const tokenUri = `https://ipfs.io/ipfs/${metadata}`
      console.log('token: ', tokenUri)
      // create nft token
      const tx = await nft.createToken(tokenUri)
      const txReceipt = await tx.wait()

      console.log(txReceipt)
      // eslint-disable-next-line no-underscore-dangle

      const tokenId = Number(txReceipt.events[0].args[2])

      const auctionTx = await auction.createAuction(
        process.env.REACT_APP_AUCTION_ADDRESS,
        tokenId,
        state.amount,
        { gasLimit: 5000000 },
      )
      await auctionTx.wait()
    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <div>
      <div>
        <div>Create Auction</div>
        <div>
          <form>
            <div>
              <span> Asset Name:</span>{' '}
              <input
                type="text"
                name="name"
                value={state.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <span> Minimum Bid:</span>
              <input
                type="number"
                name="amount"
                onChange={handleChange}
                value={state.amount}
                id=""
              />
            </div>
            <div>
              <span> Nft</span>
              <input type="file" name="" id="" multiple onChange={onChange} />
            </div>

            <button type="button" onClick={upload}>
              submit
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
