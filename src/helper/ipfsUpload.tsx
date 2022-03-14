/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function uploadToIpfs(
  arg: any,
  imageuri: string | undefined,
) {
  const data = {
    name: arg.name,
    amount: arg.amount,
    image: imageuri,
  }
  return data
}
