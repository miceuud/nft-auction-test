/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */

// --------------------------
import { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import ipfs from '../helper/ipfs'
import uploadToIpfs from '../helper/ipfsUpload'

import MyNFT from '../artifacts/contracts/CreatNFT.sol/MyNFT.json'

export default function CreateNft() {
  const { library } = useWeb3React()

  const nftContract = new ethers.Contract(

    MyNFT.abi,
    library.getSigner(),
  )

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
    } catch (error) {
      console.log(`unable to upload: ${error}`)
    }
  }
  //  get input fields
  const handleChange = (e: any) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    })
  }
  // upload all meta data to ipfs
  const upload = async () => {
    try {
      const data = await uploadToIpfs(state, imageUri)
      const metadata = await ipfs(JSON.stringify(data))

      const tokenUri = `https://ipfs.io/ipfs/${metadata}`
      // create nft token
      const tx = await nftContract.createToken(tokenUri)
      const txReceipt = await tx.wait()
      // eslint-disable-next-line no-console
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
