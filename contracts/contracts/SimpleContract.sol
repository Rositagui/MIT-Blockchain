// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

contract SimpleContract {

    uint public count = 0;
    mapping(uint => Contact) public contacts;
  
    struct Contact {
        uint id;
        string name;
        string phone;
    }
    
    constructor() {
        createContact('Rosita Aguirre', '123123123');
    }

    event ContactCreated(uint id, string name, string phone);
    
    function createContact(string memory _name, string memory _phone) public {
        count++;
        contacts[count] = Contact(count, _name, _phone);
        emit ContactCreated(count, _name, _phone);
    }
}
