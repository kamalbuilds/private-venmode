
import React, { useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import styles from "../styles/cyphertext.module.css";
import { useToast } from '@chakra-ui/react';

const SendMessage = () => {
    const [ciphertext, setCiphertext] = useState('');
    const [status, setStatus] = useState('');
    const toast = useToast();
    const sendMessage = async () => {
        if (!window.ethereum) {
            alert('MetaMask is not installed');
            return;
        }

        try {
            // Request account access if needed
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            const signer = provider.getSigner();

            const abi =[
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_outbox",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "donor",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "charityAddress",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "CharityDonationMade",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "claimant",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "GiftClaimed",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "uint32",
                            "name": "destinationDomain",
                            "type": "uint32"
                        },
                        {
                            "indexed": false,
                            "internalType": "bytes32",
                            "name": "recipient",
                            "type": "bytes32"
                        },
                        {
                            "indexed": false,
                            "internalType": "string",
                            "name": "message",
                            "type": "string"
                        }
                    ],
                    "name": "SentMessage",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "uint256",
                            "name": "giftId",
                            "type": "uint256"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "sender",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "unlockTime",
                            "type": "uint256"
                        }
                    ],
                    "name": "TimelockGiftCreated",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "sender",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "receiver",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "string",
                            "name": "message",
                            "type": "string"
                        }
                    ],
                    "name": "TransactionCompleted",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "bytes32",
                            "name": "_uniqueIdentifier",
                            "type": "bytes32"
                        },
                        {
                            "indexed": false,
                            "internalType": "address",
                            "name": "_sender",
                            "type": "address"
                        }
                    ],
                    "name": "sendCipherText",
                    "type": "event"
                },
                {
                    "inputs": [],
                    "name": "_tokenIdCounter",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_charity",
                            "type": "address"
                        }
                    ],
                    "name": "addVerifiedCharity",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_token",
                            "type": "address"
                        }
                    ],
                    "name": "addVerifiedToken",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "claimCode",
                            "type": "string"
                        },
                        {
                            "internalType": "address",
                            "name": "_token",
                            "type": "address"
                        }
                    ],
                    "name": "claimGiftWithCode",
                    "outputs": [],
                    "stateMutability": "payable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "giftId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "_token",
                            "type": "address"
                        }
                    ],
                    "name": "claimTimelockedGift",
                    "outputs": [],
                    "stateMutability": "payable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "contract ERC20Interface",
                            "name": "token",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "message",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "claimCode",
                            "type": "string"
                        }
                    ],
                    "name": "createGiftWithClaimCode",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "contract ERC20Interface",
                            "name": "token",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "unlockTime",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "message",
                            "type": "string"
                        }
                    ],
                    "name": "createTimelockedGift",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "contract ERC20Interface",
                            "name": "token",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "charityAddress",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "donateToCharity",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes",
                            "name": "data",
                            "type": "bytes"
                        }
                    ],
                    "name": "generateHash",
                    "outputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "stateMutability": "pure",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "getAllVerifiedTokens",
                    "outputs": [
                        {
                            "internalType": "address[]",
                            "name": "",
                            "type": "address[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "hook",
                    "outputs": [
                        {
                            "internalType": "contract IPostDispatchHook",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "interchainSecurityModule",
                    "outputs": [
                        {
                            "internalType": "contract IInterchainSecurityModule",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "owner",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "processRecurringGifts",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "random",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "recurringGifts",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "tokenAddress",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "from",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "interval",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "nextDueDate",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_charity",
                            "type": "address"
                        }
                    ],
                    "name": "removeVerifiedCharity",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_token",
                            "type": "address"
                        }
                    ],
                    "name": "removeVerifiedToken",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "uniqueEncryptedIdentifier",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "address",
                            "name": "destinationContract",
                            "type": "address"
                        }
                    ],
                    "name": "sendHashtoInco",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_module",
                            "type": "address"
                        }
                    ],
                    "name": "setInterchainSecurityModule",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "contract ERC20Interface",
                            "name": "token",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "interval",
                            "type": "uint256"
                        }
                    ],
                    "name": "setupRecurringGift",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "name": "verifiedCharities",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "verifiedTokenList",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "stateMutability": "payable",
                    "type": "receive"
                }
            ];

            const contractAddress = "0x746b46116c1907D269bbf331fb5113da4F7E2aac";
            const dstncontractAddr = "0x30cf421A3e8Af92dE191778b9d0Ce04abfb426f1";
            // Create a contract instance
            const contract = new ethers.Contract(contractAddress, abi, signer);

            // Convert the ciphertext to a keccak256 hash
            const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(ciphertext));
            toast({
                title: 'Transfer Successful',
                description: "hash successfully generated, bridging!",
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
            console.log(hash,"hash");
            // 0x4c07532f8ff56641292a1dea2a280453f9e3e214dd65ee2577d75d90b25c73e5 

            // Call the contract function
            const tx = await contract.sendHashtoInco(hash,dstncontractAddr);
            setStatus(`Transaction submitted: ${tx.hash}`);
            await tx.wait();
            setStatus(`Transaction mined: ${tx.hash}`);

            // Make a server call with the hash, ciphertext, and user address
            const userAddress = await signer.getAddress(); // Get the user address
            const requestBody = {
                hash: hash,
                ciphertext: ciphertext,
                userAddress: userAddress
            };

            const response = await axios.post('http://localhost:8080/api/sendMessage', requestBody);
            console.log('Server response:', response.data);
        } catch (error) {
            console.error('Error sending message:', error);
            setStatus('Error sending message');
        }
    }

    return (
        <div className={styles.container}>
            <h1>Send Ciphertext to Contract</h1>
            <input 
                type="text" 
                value={ciphertext} 
                onChange={(e) => setCiphertext(e.target.value)} 
                placeholder="Enter your ciphertext" 
                className={styles.inputc}
            />
            <button onClick={sendMessage} className={styles.buttonc}>Send Ciphertext</button>
            <p className={styles.pc}>{status}</p>
        </div>
    );
}

export default SendMessage;
