/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { create } from 'ipfs-http-client'

export default async function ipfsClient(arg: any) {
  try {
    const ipfs = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
    })

    let response = await ipfs.add(arg)
    return response.path
  } catch (e: any) {
    console.log(e.message)
  }
}
