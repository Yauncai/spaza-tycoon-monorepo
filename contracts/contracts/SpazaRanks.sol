// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC1155Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * @title SpazaRanks
 * @dev UUPS Upgradeable ERC1155 for Latjie and Lepara ranks.
 */
contract SpazaRanks is Initializable, ERC1155Upgradeable, OwnableUpgradeable, UUPSUpgradeable {
    
    // Rank Identifiers
    uint256 public constant LATJIE = 0;
    uint256 public constant LEPARA = 1;

    // Custom Errors (Gas Efficient)
    error InvalidRankTransition();
    error AlreadyHasRank();

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Replaces the constructor. Sets the initial owner and metadata URI.
     */
    function initialize(address initialOwner) initializer public {
        __ERC1155_init("ipfs://bafybeibagbsymi6mrihpvucgsoyuhbmb7jx5fuqgfbly75th2tfimpyrfq/{id}.json");
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
    }

    /**
     * @dev Minting logic for new players joining as 'Latjie'.
     */
    function joinAsLatjie(address player) external {
        if (balanceOf(player, LATJIE) > 0 || balanceOf(player, LEPARA) > 0) revert AlreadyHasRank();
        _mint(player, LATJIE, 1, "");
    }

    /**
     * @dev Upgrading a player from Latjie to Lepara.
     * Note: This burns the old rank to ensure a player only holds one rank at a time.
     */
    function promoteToLepara(address player) external onlyOwner {
        if (balanceOf(player, LATJIE) == 0) revert InvalidRankTransition();
        
        _burn(player, LATJIE, 1);
        _mint(player, LEPARA, 1, "");
    }

    /**
     * @dev Required by UUPS pattern to restrict upgrade rights to the owner.
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    /**
     * @dev Allows the owner to update the metadata URI (useful for future loxion art updates).
     */
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }
}