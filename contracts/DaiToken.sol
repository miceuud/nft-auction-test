// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DaiToken is ERC20 {

    constructor () ERC20("Dai Stable", "DAI") {
        _mint(msg.sender, 5000000000000 * (10 ** 18));
    }
}