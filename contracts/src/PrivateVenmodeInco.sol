// SPDX-License-Identifier: BSD-3-Clause-Clear

pragma solidity >=0.8.13 <0.9.0;

import "fhevm/lib/TFHE.sol";

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

contract PrivateVenmodeInco is EIP712 {
    // Used for output authorization
    bytes32 private DOMAIN_SEPARATOR;
    mapping(address => euint32) public encryptedCards;
    mapping(address => mapping(address => bool)) public useraddr;


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


    constructor(address _serverAdderss) EIP712("Authorization token", "1") {
        serverAddress = _serverAdderss;
    }

    modifier onlySignedPublicKey(bytes32 publicKey, bytes memory signature) {
        bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(keccak256("Reencrypt(bytes32 publicKey)"), publicKey)));
        address signer = ECDSA.recover(digest, signature);
        require(
            useraddr[signer][msg.sender], // Check if msg.sender is authorized by the signer
            "EIP712 signer has not authorized msg.sender"
        );
        _;
    }


    // Function to add a new user to the user mapping
    function addUserAddr(address user) public {
        useraddr[msg.sender][user] = true;
    }

     function parseStringToUint32(string memory s) external  pure returns (uint32) {
        bytes memory b = bytes(s);
        uint32 result = 0;
        for (uint i = 0; i < b.length; i++) {
            require(b[i] >= 0x30 && b[i] <= 0x39, "Invalid character in string"); // Ensure the character is a digit
            result = result * 10 + (uint32(uint8(b[i])) - 48); // Subtract 48 to get the integer value of the character
        }
        require(result <= type(uint32).max, "Result exceeds uint32 range"); // Ensure the result fits in uint32
        return result;
    }

    function stringToInt(string memory _input) public pure returns (uint32) {
        bytes32 hash = keccak256(abi.encodePacked(_input));
        return uint32(uint256(hash));
    }


    function addressToBytes32(address _addr) external pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }
    
    // EIP 712 signature is required to prove that the user is requesting to view their own card
    // The card is decrypted then re-encrypted using a publicKey provided by the user client to ensure that RPC cannot peek.
    // The user can decrypt their card with the respective privateKey (stored on client)
    function viewSecret(address user, bytes32 publicKey, bytes calldata signature) 
        public view onlySignedPublicKey(publicKey, signature) onlySignedPublicKey(publicKey, signature) returns (bytes memory) {
        return TFHE.reencrypt(encryptedCards[user], publicKey, 0);
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