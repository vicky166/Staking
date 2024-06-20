// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Staking is ERC20 {
    address payable private owner;

    uint256 public constant TOTAL_SUPPLY = 100_000_000 * 10 ** 18;

    constructor() ERC20("Turbo", "Tro") {
        owner = payable(msg.sender);
        _mint(owner, TOTAL_SUPPLY);
    }

    function mint() external {
        require(msg.sender == owner, "Only the owner can mint tokens");
        _mint(msg.sender, 1_000_000_000 * 10 ** 18);
    }
}
