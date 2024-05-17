// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.20;

interface IMailbox {
    function dispatch(
        uint32 destinationDomain,
        bytes32 recipientAddress,
        bytes calldata messageBody
    ) external payable returns (bytes32 messageId);
}

contract PrivateVenmodeSender {

    address public destinationContract;
    event sendCipherText(bytes32 _uniqueIdentifier, address _sender);

    constructor(address _destinationContract){
        destinationContract = _destinationContract;
    }

    function generateHash(bytes memory data) public pure returns (bytes32) {
        return keccak256(data);
    }

    function sendmessage(bytes32 uniqueEncryptedIdentifier) external {
        IMailbox mailbox = IMailbox(0xa77C27675A0d77172FfD51a4Bb0956F8c5c8355c);

        mailbox.dispatch(
            9090,
            addressToBytes32(destinationContract),
            abi.encode(uniqueEncryptedIdentifier,msg.sender)
        );
    }

    function addressToBytes32(address _addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }

}