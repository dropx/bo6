pragma solidity ^0.4.23;


contract Sample {
    string public desc;
    event DescChanged(string desc);
    
    function setDesc(string _desc) public returns (string) {
        desc = _desc;
        emit DescChanged(desc);
    } 
    
}
