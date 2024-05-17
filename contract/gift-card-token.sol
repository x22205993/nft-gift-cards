// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

contract GiftCards is ERC1155, ERC1155Burnable {

    struct TokenInfo {
        uint256 quantity;
        uint256 value ;
        string ipfsId;
    }
    TokenInfo[] public _tokenInfoList;
    string private BASE_URI;
    uint256 public _currentTokenId;

    constructor(string memory _baseURI) ERC1155(BASE_URI) {
        BASE_URI = _baseURI;
    }

    function setBaseURI(string memory _baseURI) external {
        BASE_URI = _baseURI;
    }

    function getBaseURI() external view returns (string memory) {
        return BASE_URI;
    }

    function uri(uint256 tokenId) override public view returns (string memory) { 
        if (tokenId > 0 && tokenId <= _currentTokenId) {
            return string.concat(BASE_URI, _tokenInfoList[tokenId-1].ipfsId);
        } else {
            return "";
        }
    }

    function mint(uint256 quantity, uint256 tokenAmount, string calldata ipfsId) external payable returns(uint256) {
        require(msg.value >= tokenAmount * quantity, "Insufficient payment");
        _currentTokenId++ ;
        _mint(msg.sender, _currentTokenId, quantity, "");
        _tokenInfoList.push(TokenInfo(quantity, tokenAmount, ipfsId));
        if (msg.value > tokenAmount  * quantity) {
            payable(msg.sender).transfer(msg.value - (tokenAmount * quantity));
        }
        return _currentTokenId;
    }

    function redeem(uint256 id, uint256 quantity) external {
        require(balanceOf(msg.sender, id) >= quantity, "Insufficient Tokens to redeem");
        payable(msg.sender).transfer(quantity * _tokenInfoList[id-1].value);
        burn(msg.sender, id, quantity);
    }
    function getTokenInfoList() public view returns (TokenInfo[] memory) {
        return _tokenInfoList;
    }
}