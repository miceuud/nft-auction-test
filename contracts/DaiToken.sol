// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IDaiToken.sol";

contract DaiToken  {
  IERCDaiToken daitoken;

   constructor () {
     daitoken = IERCDaiToken(0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa);
   }
  
}