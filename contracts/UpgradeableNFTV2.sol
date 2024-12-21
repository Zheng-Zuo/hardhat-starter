// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "erc721a-upgradeable/contracts/ERC721AUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract UpgradeableNFTV2 is ERC721AUpgradeable, OwnableUpgradeable {
    error QuantityExceeded();

    function initialize(
        string memory name,
        string memory symbol
    ) public initializerERC721A initializer {
        __ERC721A_init(name, symbol);
        __Ownable_init();
    }

    function mint(uint256 quantity) external payable {
        if (quantity <= 3) {
            _mint(msg.sender, quantity);
        } else {
            revert QuantityExceeded();
        }
    }

    function adminMint(uint256 quantity) external payable onlyOwner {
        _mint(msg.sender, quantity);
    }

    function version() external pure returns (string memory) {
        return "v2.0.0";
    }
}
