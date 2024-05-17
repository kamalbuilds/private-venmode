// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@hyperlane-xyz/core/contracts/interfaces/IMailbox.sol";
import "@hyperlane-xyz/core/contracts/interfaces/IInterchainSecurityModule.sol";

interface ERC20Interface {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
}

contract PrivateVenmode {

    // private sending part >>>

    IMailbox outbox;
    event SentMessage(uint32 destinationDomain, bytes32 recipient, string message);

    uint256 public _tokenIdCounter;
    uint256 public random;
    IPostDispatchHook public hook;
    

    IInterchainSecurityModule public interchainSecurityModule;

    function setInterchainSecurityModule(address _module) public {
        interchainSecurityModule = IInterchainSecurityModule(_module);
    }

    constructor(address _outbox) {
        outbox = IMailbox(_outbox);
        owner = msg.sender;
    }

    function addressToBytes32(address _addr) external pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }

    function getquote(
        uint32 _destinationDomain,
        bytes32 _recipient,
        bytes32 uniquebytes,
        string calldata _message
    ) external payable returns 
    (uint256) {
        uint256 quote = outbox.quoteDispatch(_destinationDomain, _recipient, abi.encode(uniquebytes, msg.sender));
        return quote;
    }

    function sendtoInco(
        uint32 _destinationDomain,
        bytes32 _recipient,
        bytes32 uniquebytes,
        string calldata _message
    ) external payable  {
        uint256 quote = outbox.quoteDispatch(_destinationDomain, _recipient, abi.encode(uniquebytes, msg.sender));
        outbox.dispatch{value: quote}(_destinationDomain, _recipient, abi.encode(uniquebytes, msg.sender));
        emit SentMessage(_destinationDomain, _recipient, _message);
    }


    address public owner;
    mapping(address => bool) private verifiedTokens;
    address[] public verifiedTokenList;
    mapping(bytes32 => Transaction) private claimableGifts;
    mapping(uint256 => Transaction) private timelockedGifts;
    mapping(address => bool) public verifiedCharities;
    mapping(bytes32 => Transaction) private codeBasedTransactions;

    uint256 private nonce = 0;

    struct Transaction {
        address sender;
        address receiver;
        uint256 amount;
        string message;
        uint256 unlockTime;
    }

    event TransactionCompleted(address indexed sender, address indexed receiver, uint256 amount, string message);
    event TimelockGiftCreated(uint256 indexed giftId, address indexed sender, uint256 unlockTime);
    event GiftClaimed(address indexed claimant, uint256 amount);
    event CharityDonationMade(address indexed donor, address indexed charityAddress, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can perform this action");
        _;
    }

    modifier onlyVerifiedToken(address _token) {
        require(verifiedTokens[_token], "Token is not verified");
        _;
    }

    function addVerifiedToken(address _token) external onlyOwner {
        verifiedTokens[_token] = true;
        verifiedTokenList.push(_token);
    }

    function removeVerifiedToken(address _token) external onlyOwner {
        require(verifiedTokens[_token], "Token is not verified");
        verifiedTokens[_token] = false;
    }

    function addVerifiedCharity(address _charity) external onlyOwner {
        verifiedCharities[_charity] = true;
    }

    function removeVerifiedCharity(address _charity) external onlyOwner {
        require(verifiedCharities[_charity], "Charity is not verified");
        verifiedCharities[_charity] = false;
    }

    function createTimelockedGift(ERC20Interface token, address to, uint256 amount, uint256 unlockTime, string calldata message) external onlyVerifiedToken(address(token)) {
        require(unlockTime > block.timestamp, "Unlock time must be in the future");
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        timelockedGifts[nonce] = Transaction({
            sender: msg.sender,
            receiver: to,
            amount: amount,
            message: message,
            unlockTime: unlockTime
        });

        emit TimelockGiftCreated(nonce, msg.sender, unlockTime);
        nonce++;
    }

    function claimTimelockedGift(uint256 giftId , address _token) external payable {
        require(block.timestamp >= timelockedGifts[giftId].unlockTime, "Gift is still locked");
        require(timelockedGifts[giftId].receiver == msg.sender, "Only the designated receiver can claim this gift");

        ERC20Interface token = ERC20Interface(_token);
        require(token.transferFrom(address(this), msg.sender, timelockedGifts[giftId].amount), "Transfer failed");
        emit GiftClaimed(msg.sender, timelockedGifts[giftId].amount);

        delete timelockedGifts[giftId];
    }

    function donateToCharity(ERC20Interface token, address charityAddress, uint256 amount) external onlyVerifiedToken(address(token)) {
        require(verifiedCharities[charityAddress], "Not a verified charity");
        require(token.transferFrom(msg.sender, charityAddress, amount), "Transfer failed");

        emit CharityDonationMade(msg.sender, charityAddress, amount);
    }


function createGiftWithClaimCode(ERC20Interface token, address to, uint256 amount, string calldata message, string calldata claimCode) external onlyVerifiedToken(address(token)) {
    require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");

    bytes32 codeHash = keccak256(abi.encodePacked(claimCode));
    require(codeBasedTransactions[codeHash].amount == 0, "Code already in use");

    codeBasedTransactions[codeHash] = Transaction({
        sender: msg.sender,
        receiver: to,
        amount: amount,
        message: message,
        unlockTime: 0
    });
}

function claimGiftWithCode(string calldata claimCode , address _token) external payable  {
    bytes32 codeHash = keccak256(abi.encodePacked(claimCode));
    Transaction memory txn = codeBasedTransactions[codeHash];
    require(txn.amount > 0, "Invalid code"); // Ensure the gift exists
    require(txn.receiver == msg.sender, "Unauthorized receiver"); // Ensure the caller is the intended receiver

    ERC20Interface token = ERC20Interface(_token);
    // Corrected to use `transfer` for sending tokens from the contract to the receiver
    require(token.transfer(msg.sender, txn.amount), "Transfer failed");

    emit GiftClaimed(msg.sender, txn.amount);
    delete codeBasedTransactions[codeHash];
}


struct RecurringGift {
    address tokenAddress;
    address from;
    address to;
    uint256 amount;
    uint256 interval;
    uint256 nextDueDate;
}

RecurringGift[] public recurringGifts;

function setupRecurringGift(ERC20Interface token, address to, uint256 amount, uint256 interval) external onlyVerifiedToken(address(token)) {
    recurringGifts.push(RecurringGift({
        tokenAddress: address(token),
        from: msg.sender,
        to: to,
        amount: amount,
        interval: interval,
        nextDueDate: block.timestamp + interval
    }));
}

// This function would need to be called periodically, possibly by an off-chain service, to process due gifts.
function processRecurringGifts() external {
    for(uint i = 0; i < recurringGifts.length; i++) {
        if(block.timestamp >= recurringGifts[i].nextDueDate) {
            ERC20Interface token = ERC20Interface(recurringGifts[i].tokenAddress);
            require(token.transferFrom(recurringGifts[i].from, recurringGifts[i].to, recurringGifts[i].amount), "Transfer failed");

            recurringGifts[i].nextDueDate += recurringGifts[i].interval;
        }
    }
}

    function getAllVerifiedTokens() public view returns (address[] memory) {
        return verifiedTokenList;
    }

    receive() external payable {}

}