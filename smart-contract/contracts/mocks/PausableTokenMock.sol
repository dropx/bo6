pragma solidity ^0.4.21;

import "../token/PausableToken.sol";


/**
 * @title PausableTokenMock
 * @dev Mocking contract of BO6Token
 */
contract PausableTokenMock is PausableToken {

    function mockMintToken(address _to, uint256 _balacne) public returns (bool) {
        totalSupply_ = totalSupply_.add(_balacne);
        balances[_to] = balances[_to].add(_balacne);
        return true;
    }

}
