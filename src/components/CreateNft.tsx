/* eslint-disable no-bitwise */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */

// --------------------------
import { useState } from 'react'
import { BigNumber, ethers } from 'ethers'

import ipfs from '../helper/ipfs'
import uploadToIpfs from '../helper/ipfsUpload'

import MyNFT from '../artifacts/contracts/CreatNFT.sol/MyNFT.json'
import NFTAuction from '../artifacts/contracts/Auction.sol/NFTAuction.json'

declare let window: any

// eslint-disable-next-line react-hooks/rules-of-hooks

export default function CreateNft() {
  // const [uploads, setUploads] = useState()

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
      console.log(`unable to upload: ${error}`)

      console.log('image: ', imageUri)
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
      '0xd9A0dA0d9B8432718f963C2858C4F1ED3eC9B33D',
      MyNFT.abi,
      signer,
    )

    const auction = new ethers.Contract(
      '0xcBc4507698e61339CeF0F0C442DE74260ACFFff1',
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
        '0xd9A0dA0d9B8432718f963C2858C4F1ED3eC9B33D',
        tokenId,
        state.amount,
      )
      const auctionReceipt = await auctionTx.wait()
      // eslint-disable-next-line no-console
      console.log(txReceipt.auctionReceipt)
    } catch (error) {
      console.log(error)
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
