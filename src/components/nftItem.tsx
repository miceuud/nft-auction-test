export default function NftAsset(nft) {
  return (
    <>
      <div>
        <div>
          <img src="{nft.image}" alt="" />
        </div>
        <div>{nft.name}</div>
        <div>{nft.amount}</div>
      </div>
    </>
  )
}
