// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


// NFT Minting Contract
contract ArtifactNFT is ERC721URIStorage {
    constructor() ERC721("ArtifactNFT", "ANFT") {
    }
    
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Supported Networks
    enum Network {
        Ethereum,
        Polygon,
        Solana,
        Base
    }

    // NFT Minting Event
    event NFTMinted(
        uint256 indexed tokenId, 
        address indexed creator, 
        string tokenURI, 
        Network network
    );

    // Mint NFT Function
    function mintMemeNFT(
        address creator, 
        string memory tokenURI, 
        Network network
    ) external returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        // Mint NFT
        _mint(creator, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        emit NFTMinted(newTokenId, creator, tokenURI, network);
        return newTokenId;
    }
}