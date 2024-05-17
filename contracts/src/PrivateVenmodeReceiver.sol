// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.20;

import "fhevm/lib/TFHE.sol";

contract PrivateVenmodeReceiver {

    address public serverAddress;
    bytes32 public encryptedUniqueIdenifier;
    address public last_sender;
    euint8 public _hiddenNumber;
    uint8 public _hiddenDecryptedNumber;
    event receivedCipherText(bytes32 _uniqueIdentifier, address _user);

    error Receiver__noServer();

    modifier _onlyServer(){
        if(msg.sender != serverAddress){
            revert Receiver__noServer();
        }
        _;
    }

    constructor(address _serverAdderss){
        serverAddress = _serverAdderss;
    }

    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _data
    ) external payable {
        last_sender = bytes32ToAddress(_sender);
        (encryptedUniqueIdenifier, last_sender) = abi.decode(_data,(bytes32,address));
        emit receivedCipherText(encryptedUniqueIdenifier, last_sender);
    }

    function oracle(bytes calldata encryptedValue) external {
        _hiddenNumber = TFHE.asEuint8(encryptedValue);
    }

    function decryptAmount() public {
        _hiddenDecryptedNumber = TFHE.decrypt(_hiddenNumber);
    }

    function bytes32ToAddress(bytes32 _buf) internal pure returns (address) {
        return address(uint160(uint256(_buf)));
    }
}