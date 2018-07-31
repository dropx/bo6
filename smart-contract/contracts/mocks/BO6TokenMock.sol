pragma solidity ^0.4.21;

import "../BO6Token.sol";


/**
 * @title BO6TokenMock
 * @dev Mocking contract of BO6Token
 */
contract BO6TokenMock is BO6Token {

    function mockMintToken(address _to, uint256 _balacne) public returns (bool) {
        totalSupply_ = totalSupply_.add(_balacne);
        balances[_to] = balances[_to].add(_balacne);
        return true;
    }

}
