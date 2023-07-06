pragma solidity ^0.8.2;
//SPDX-License-Identifier: UNLICENSED

struct profile{
        string name;
        uint points;
        string[] institutions;
    }

contract Reviews{
    uint public reviews = 0; // variable de estado
    address public adrs;
    mapping(address => uint) public balance;
    mapping(uint => string) public institutions;
    mapping(address => profile) public profiles;

    constructor(){
        adrs = msg.sender;
    }

    function setInst(string memory institute) internal {
        institutions[reviews] = institute;
    }

    function review(string memory institute, uint given_points) public {
        require(given_points < 6, "Points should be less than 6");
        profiles[msg.sender].points += given_points;
        profiles[msg.sender].points /= reviews;
        setInst(institute);
    }
}
