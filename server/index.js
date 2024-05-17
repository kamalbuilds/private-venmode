const express = require('express');
const { ethers } = require('ethers');
const cors = require('cors');
const dotenv = require('dotenv');
const { contract_Address, contract_Abi } = require('./contract_instance.js');

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const signer = wallet.connect(provider);
const contract = new ethers.Contract(contract_Address, contract_Abi, signer);

// Define a route to handle requests for sending a message
app.post('/api/sendMessage', async (req, res) => {
    try {
        const { hash, ciphertext, userAddress } = req.body;

        global.userAddress = userAddress;
        global.ciphertext = ciphertext;
        global.isCorrect = false;

        // Send a success response
        res.json({ message: 'Listening for receivedCipherText event' });

        // Listen for the receivedCipherText event
        const listener = async (_uniqueIdentifier, _user) => {
            console.log('receivedCipherText event emitted:');
            console.log('encryptedUniqueIdenifier:', _uniqueIdentifier);
            console.log('last_sender:', _user);

            if (_user === global.userAddress) {
                console.log('Last sender matches user address. Calling oracle function.');
                global.isCorrect = true;

                try {
                    const tx = await contract.oracle(global.ciphertext);
                    console.log('Transaction submitted:', tx.hash);
                    await tx.wait();
                    console.log('Transaction mined:', tx.hash);
                } catch (error) {
                    console.error('Error calling oracle function:', error);
                } finally {
                    contract.off('receivedCipherText', listener); // Remove the event listener after it's triggered
                }
            }
        };

        contract.on('receivedCipherText', listener);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const server = app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});

server.on('error', (error) => {
    console.error('Server error:', error);
});