// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Adding only the ERC-20 function we need
interface IERCDaiToken {
    function transfer(address _address, uint _amount) external returns (bool);
    function transferFrom(address _src, address _destination, uint _amount) external;
    function balanceOf(address _address) external view returns (uint);
}