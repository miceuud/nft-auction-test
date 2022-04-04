// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./DaiToken.sol";

/// @title NFT Token
/// @author Mike Udoh
/// @dev mint token by calling the creat token function

contract NFTAuction is ReentrancyGuard, Ownable {
 
  address public nftAddress;
  address public winner;
  uint public  nftTokenId;
  uint minimumBidAmount; 
  uint public highestBiddingAmount;
  uint public endAuctionTime;
  bool startAuction;
  bool endAuction;
  bool winClaimed;
  bool bidRedeemed;

  uint base = 10 ** 18;
  
  event AuctionsStatus(bool indexed started, string indexed _msg);
  event Bid(address indexed _bidder, uint indexed amount);
  event RewardClaimed(address indexed, string msg);
  event BidRedeem(address indexed, uint amount);
  event AuctionClosed(bool ended, string indexed msg);

  //store bids-amouunt by user 
  mapping(address => uint) public bids;
  mapping(address => bool) public hasBidded;

  address[] public bidders;
  IERC20 dai;

  constructor (address _daiTokenAddress) {
     dai = IERC20(_daiTokenAddress);
  }
  
  function createAuction (address _nft,uint _nftTokenId,uint _minimumBid)  external onlyOwner {
    require(!startAuction, "Auction already started");
    nftAddress = _nft;
    nftTokenId = _nftTokenId;
    minimumBidAmount = _minimumBid; 
    IERC721(nftAddress).transferFrom(msg.sender, address(this), nftTokenId);
    emit AuctionsStatus(true, "Auction created");
  } 

  function start () external onlyOwner {
    require(!startAuction, "Auction already started");
    startAuction = true;
    endAuctionTime = block.timestamp + 10 seconds  ; 
    highestBiddingAmount = minimumBidAmount;
    emit AuctionsStatus(true, "Auction started");
  }

  function bid(uint _amount) external nonReentrant() {
    require(msg.sender != owner(), "you are not allow to bid");
    require(block.timestamp < endAuctionTime, "Auction has ended");
    require(_amount > minimumBidAmount , "Bids must be greater than starting Bid"); 
    require(!hasBidded[msg.sender], "You can only bid once");
    bids[msg.sender] += _amount;     
    IERC20(dai).transferFrom(msg.sender,address(this),_amount);
  
    if(_amount > highestBiddingAmount) {
       winner = msg.sender;
       highestBiddingAmount = _amount;
    }
    bidders.push(msg.sender);
    hasBidded[msg.sender] = true;
    emit Bid(msg.sender, _amount);
  }

  function end() external onlyOwner {
    require(block.timestamp > endAuctionTime, "This auction hasn't been completed");
    require(startAuction, "Auction has not started yet");
    require(!endAuction, "Auction has ended");
    endAuction = true;
    emit AuctionClosed(true, "this auction is closed");
  }
  
  function claimWin () external  nonReentrant() {
    require(block.timestamp > endAuctionTime, "This auction hasn't been completed");
    require(endAuction, "Auction has not ended");
    require(msg.sender == winner, "You are not the winner");
    require(!winClaimed, "you have claimed your winning already");
    bids[msg.sender] = 0;
    winClaimed = true;
    IERC721(nftAddress).transferFrom(address(this),msg.sender, nftTokenId);
    emit RewardClaimed(msg.sender, "winner claims reward");
  }

  function redeemBid () external nonReentrant() {
    require(block.timestamp > endAuctionTime, "This auction hasn't been completed");
    require(hasBidded[msg.sender], "You have no bid");
    require(endAuction, "Auction still ongoing");
    require(!bidRedeemed, "you have claimed your winning already");
    
    uint _bid = bids[msg.sender];
    bidRedeemed = true;
    bids[msg.sender] = 0;

    IERC20(dai).transfer(msg.sender, _bid);
    emit BidRedeem(msg.sender, _bid);
  }

}