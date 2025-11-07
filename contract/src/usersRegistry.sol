// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/access/Ownable.sol";

contract UserRegistry is Ownable {
    enum Role {
        USER,
        PRODUCTOWNER
    }

    struct User {
        address userAddress;
        string firstName;
        string lastName;
        Role role;
        bool isRegistered;
        bool isVerified;
    }

    uint256 public registeredUsers;
    uint256 public verifiedUsers;
    mapping(address => User) public ardenUsers;
    mapping(address => string) public kycVerification;

    constructor() Ownable(msg.sender) {}

    function registerUser(
        string memory _firstName,
        uint8 _role,
        string memory _lastName
    ) external {
        User memory newUser = User({
            userAddress: msg.sender,
            firstName: _firstName,
            lastName: _lastName,
            role: Role(_role),
            isRegistered: true,
            isVerified: false
        });

        ardenUsers[msg.sender] = newUser;
        registeredUsers += 1;
    }

    function verifyUser(
        address _user,
        string memory kycHash
    ) external onlyOwner {
        kycVerification[_user] = kycHash;

        ardenUsers[_user].isVerified = true;

        verifiedUsers += 1;
    }

    function getUser(address _userAddress) external view returns (User memory) {
        return ardenUsers[_userAddress];
    }
}
