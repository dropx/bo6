pragma solidity ^0.4.23;

contract UserBase {
    
    enum Gender { M, F }

    struct User {
        string userName;
        uint birthYear;
        Gender gender;
        uint kycHashuint;
        uint fullNameHash;
    }

    User[] public users;
    mapping(uint => address) public userIdToAddress;
    mapping(address => uint) public addressToUserId;

    function signUp (
        string _userName,
        uint _birthYear,
        Gender _gender
    )
        public
        returns (bool)
    {
        require(userIdToAddress[0] != msg.sender && addressToUserId[msg.sender] == 0, "User already exists");
        User memory newUser;
        newUser.userName = _userName;
        newUser.birthYear = _birthYear;
        newUser.gender = _gender;

        uint userId = users.push(newUser) - 1;
        userIdToAddress[userId] = msg.sender;
        addressToUserId[msg.sender] = userId;
       
        return true;
    }
}
