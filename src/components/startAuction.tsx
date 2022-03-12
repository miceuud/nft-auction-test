interface Asset {
  name: string
  price: number
  imageUrl: string
}

const nft: Asset = {
  name: 'Creai Desperado',
  price: 200,
  imageUrl: 'icon[0].src/logo192.png',
}

export default function StartAuction() {
  return (
    <div>
      <div>
        <img src="{nft.imageUrl}" alt="" />
        <div>Name: {nft.name} </div>
        <div>Minimum starting Bid:{nft.price} Dai</div>
        <input type="number" />
        <button type="button">Bid</button>
        <div>
          <button type="button" disabled>
            End
          </button>
        </div>
      </div>
    </div>
  )
}
