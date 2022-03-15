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
  const [uploads, setUploads] = useState()

  const [state, setState] = useState({
    name: '',
    amount: 0,
  })

  let imageUri
  const onChange = async (e) => {
    try {
      // upload image to ipfs
      imageUri = await ipfs(e.target.files[0])
      imageUri = `https://ipfs.io/ipfs/${imageUri}`
    } catch (error) {
      console.log(`unable to upload: ${error}`)
    }
  }
  //  get input fields
  const handleChange = (e) => {
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

    const nftContract = new ethers.Contract(
      '0xE0b00Ccc2A0437d0B218FcfC65E50Ca29dEf2426',
      MyNFT.abi,
      signer,
    )

    const auction = new ethers.Contract(
      '0xE0b00Ccc2A0437d0B218FcfC65E50Ca29dEf2426',
      NFTAuction.abi,
      signer,
    )
    try {
      const data = await uploadToIpfs(state, imageUri)
      const metadata = await ipfs(JSON.stringify(data))
      // let history = useNavigate()

      const tokenUri = `https://ipfs.io/ipfs/${metadata}`
      // create nft token
      const tx = await nftContract.createToken(tokenUri)
      const txReceipt = await tx.wait()

      const auctionTx = await auction.createAuction(
        '0xE0b00Ccc2A0437d0B218FcfC65E50Ca29dEf2426',
        1,
        50,
      )
      const auctionReceipt = auctionTx.wait()
      // eslint-disable-next-line no-console
      // history.push('/')
      console.log(txReceipt.events)
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
