
pragma solidity ^0.4.23;

import "./token/TransferPausable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "openzeppelin-solidity/contracts/token/ERC20/BurnableToken.sol";
import "openzeppelin-solidity/contracts/ownership/HasNoEther.sol";
import "openzeppelin-solidity/contracts/ownership/HasNoContracts.sol";


contract BO6Token is MintableToken, BurnableToken, TransferPausable, HasNoEther, HasNoContracts {
    string public name = "BO6";
    string public symbol = "BO6";
    uint8 public decimals = 18;
}
