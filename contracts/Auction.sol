// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./DaiToken.sol";


/// @title NFT Token
/// @author Mike Udoh
/// @dev mint token by calling the creat token function

contract NFTAuction is ERC721URIStorage, ReentrancyGuard, Ownable, DaiToken {
 
  address public  nftAddress;
  address winner;
  uint public  nftTokenId;
  uint minimumBidAmount; 
  uint highestBiddingAmount;
  uint endAuctionTime;
  bool startAuction;
  bool endAuction;

  uint base = 10 ** 18;
  
  event AuctionsStatus(string indexed _msg);
  event Bid(address indexed _bidder, uint indexed amount);
  event RewardClaimed(address indexed, string msg);
  event BidRedeem(address indexed, uint amount);
  event AuctionClosed(string indexed msg);

  //store bids-amouunt by user 
  mapping(address => uint) public bids;
  mapping(address => bool) public hasBidded;


  address[] bidders;
  
  constructor () ERC721("MyNFT-Tokens", "UMT") {}

   function getBalance () public view returns (uint _bal, uint _ether) {
     _bal = daitoken.balanceOf(msg.sender);
     _ether = address(this).balance;
   }

  function createAuction (address _nft,uint _nftTokenId,uint _minimumBid)  external onlyOwner {
    nftAddress = _nft;
    nftTokenId = _nftTokenId;
    minimumBidAmount = _minimumBid * base; 
    require(!startAuction, "Auction already started");

    IERC721(nftAddress).transferFrom(msg.sender, address(this), nftTokenId);
    emit AuctionsStatus("Auction created");
  } 

  function start () external onlyOwner {
    require(!startAuction, "Auction already started");
    startAuction = true;
    endAuctionTime = block.timestamp + 1 days; 
    highestBiddingAmount = minimumBidAmount;
    emit AuctionsStatus("Auction started");
  }

  function bid(uint _amount) external nonReentrant() {
    require(msg.sender != owner(), "you are not allow to bid");
    require(block.timestamp < endAuctionTime, "Auction has ended");
    _amount = _amount * base;
    require(_amount > minimumBidAmount, "Bids must be greater than starting Bid"); 
    require(!hasBidded[msg.sender], "You can only bid once");

    bids[msg.sender] += _amount;
    daitoken.transferFrom(msg.sender, address(this), _amount);

    if(_amount > highestBiddingAmount) {
       winner = msg.sender;
       highestBiddingAmount = _amount;
    }
    bidders.push(msg.sender);
    emit Bid(msg.sender, _amount);
  }

  function end() external onlyOwner {
    require(block.timestamp >= endAuctionTime, "This auction has been completed");
    require(startAuction, "Auction has not started yet");
    require(!endAuction, "Auction has ended");

    endAuction = true;
    emit AuctionClosed("this auction is closed");
  }
  
  function claimWin () external  nonReentrant() {
    require(block.timestamp >= endAuctionTime, "This auction has been completed");
    require(endAuction, "Auction has not ended");
    require(msg.sender == winner, "You are not the winner");

    bids[msg.sender] = 0;
    IERC721(nftAddress).safeTransferFrom(address(this),msg.sender, nftTokenId);
    emit RewardClaimed(msg.sender, "winner claims reward");
  }

  function redeemBid () external nonReentrant() {
    require(block.timestamp >= endAuctionTime, "This auction has been completed");
    require(hasBidded[msg.sender], "You have no bid");
    require(bids[msg.sender] > minimumBidAmount );
    require(endAuction, "Auction still ongoing");

    uint _bid = bids[msg.sender];
    bids[msg.sender] = 0;

    daitoken.transferFrom(address(this), msg.sender, _bid);
    emit BidRedeem(msg.sender, _bid);
  }

}