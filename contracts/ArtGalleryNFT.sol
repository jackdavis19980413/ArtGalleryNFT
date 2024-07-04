// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ArtGalleryNFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;
    mapping(uint256 => address) public creators;
    mapping(uint256 => uint256) public prices;
    mapping(uint256 => bool) public listedForSale;

    event Minted(uint256 tokenId, address creator, string tokenURI);
    event ListedForSale(uint256 tokenId, uint256 price);
    event Sold(uint256 tokenId, address buyer, uint256 price);

    constructor() ERC721("ArtGalleryNFT", "AGNFT") Ownable(msg.sender) {
        tokenCounter = 0;
    }

    function mintNFT(string memory tokenURI) public returns (uint256) {
        uint256 newItemId = tokenCounter;
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        creators[newItemId] = msg.sender;
        tokenCounter++;
        emit Minted(newItemId, msg.sender, tokenURI);
        return newItemId;
    }

    function listNFT(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Only owner can list");
        require(price > 0, "Price should be greater than zero");
        prices[tokenId] = price;
        listedForSale[tokenId] = true;
        emit ListedForSale(tokenId, price);
    }

    function buyNFT(uint256 tokenId) public payable {
        require(listedForSale[tokenId], "NFT is not for sale");
        require(msg.value == prices[tokenId], "Incorrect value sent");

        address seller = ownerOf(tokenId);
        _transfer(seller, msg.sender, tokenId);
        payable(seller).transfer(msg.value);

        listedForSale[tokenId] = false;
        prices[tokenId] = 0;

        emit Sold(tokenId, msg.sender, msg.value);
    }

    function getCreator(uint256 tokenId) public view returns (address) {
        return creators[tokenId];
    }

}