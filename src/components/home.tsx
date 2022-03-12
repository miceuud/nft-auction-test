import StartAuction from './startAuction'
import ClaimWin from './claim'

export default function Home() {
  // const [bid, setBid] = useState(false)
  const active = true
  const endBid = false
  return (
    <>
      <div className="container">
        <header> Place a bid on the NFT and stand a chance of winning</header>

        <div>
          <div className="nft-container">
            <h2>Auctioned Item</h2>
            <div>
              {!active ? <p> Admin has posted a bid yet </p> : <StartAuction />}
            </div>
          </div>
          <div className="price-container container">
            {endBid ? ' ' : <ClaimWin />}
          </div>
        </div>
      </div>
    </>
  )
}
