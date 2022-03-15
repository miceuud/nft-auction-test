// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is IERC721Metadata, ERC721URIStorage {
 
  using Counters for Counters.Counter;
  
  Counters.Counter private _tokenIds;
  address public auctionmarketplaceContractAddress;
  
  constructor(address marketplace) ERC721("MyNFT-Tokens", "UMT") {
    auctionmarketplaceContractAddress = marketplace;
  }

  function createToken (string memory _tokenURI) public  returns (uint _tokenId) {
    _tokenIds.increment();
    _tokenId = _tokenIds.current();

    _mint(msg.sender, _tokenId);
    _setTokenURI(_tokenId, _tokenURI);
    setApprovalForAll(auctionmarketplaceContractAddress, true);
 
   _tokenId;
  }
  function fetchTokenUri () external view returns(string memory _tokenUri) {
    uint tokenId = _tokenIds.current();
    _tokenUri = tokenURI(tokenId);
  }

}