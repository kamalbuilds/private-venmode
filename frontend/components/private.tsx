"use client";
import { Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { init, getInstance, getTokenSignature , instance } from "../utils/fhevm";
import { Contract } from "ethers";
import { toHexString } from "../utils/utils";
import { ethers } from "ethers";

export default function Private() {
  const [isInitialized, setIsInitialized] = useState(false);
  console.log(isInitialized,"isiniti");
  let instance;

  useEffect(() => {
    async function fetchInstance() {
      instance = await getInstance();
    }
    fetchInstance();
    setIsInitialized(true)
  }, []);

  if (!isInitialized) return null;

  return (
    <div className="App">
      <div className="menu">
        <Example />
      </div>
    </div>
  );
}

function Example() {
  const [amountUint8, setAmountUint8] = useState(0);
  const [eamountUint8, setEamountUint8] = useState(0);
  const [amountUint16, setAmountUint16] = useState(0);
  const [eamountUint16, setEamountUint16] = useState(0);
  const [amountUint32, setAmountUint32] = useState(0);
  const [eamountUint32, setEamountUint32] = useState(0);

  const handleAmountChangeUint8 = (event: any) => {
    let _instance = getInstance();
    _instance.then((instance) => {
      setEamountUint8(toHexString(instance.encrypt8(+event.target.value)));
    });
    setAmountUint8(event.target.value);
  };

  const handleCopyClickUint8 = () => {
    if (eamountUint8) {
      navigator.clipboard.writeText("0x" + eamountUint8);
    }
  };

  const handleAmountChangeUint16 = (event : any) => {
    let _instance = getInstance();
    _instance.then((instance) => {
      setEamountUint16(toHexString(instance.encrypt16(+event.target.value)));
    });
    setAmountUint16(event.target.value);
  };

  const handleCopyClickUint16 = () => {
    if (eamountUint16) {
      navigator.clipboard.writeText("0x" + eamountUint16);
    }
  };

  const handleAmountChangeUint32 = (event: any) => {
    let _instance = getInstance();
    _instance.then((instance) => {
      setEamountUint32(toHexString(instance.encrypt32(+event.target.value)));
    });
    setAmountUint32(event.target.value);
  };

  const handleCopyClickUint32 = () => {
    if (eamountUint32) {
      navigator.clipboard.writeText("0x" + eamountUint32);
    }
  };

  let CONTRACT_ADDRESS = "0x9df6785ec662ff2426F1f064D4c72B82aFEd0A60";

  const rabi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "addUserAddr",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "ECDSAInvalidSignature",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "length",
          "type": "uint256"
        }
      ],
      "name": "ECDSAInvalidSignatureLength",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "s",
          "type": "bytes32"
        }
      ],
      "name": "ECDSAInvalidSignatureS",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "getCard",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "InvalidShortString",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "str",
          "type": "string"
        }
      ],
      "name": "StringTooLong",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [],
      "name": "EIP712DomainChanged",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_addr",
          "type": "address"
        }
      ],
      "name": "addressToBytes32",
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
      "name": "eip712Domain",
      "outputs": [
        {
          "internalType": "bytes1",
          "name": "fields",
          "type": "bytes1"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "version",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "chainId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "verifyingContract",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "salt",
          "type": "bytes32"
        },
        {
          "internalType": "uint256[]",
          "name": "extensions",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
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
      "name": "encryptedCards",
      "outputs": [
        {
          "internalType": "euint8",
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
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "useraddr",
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
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "publicKey",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "signature",
          "type": "bytes"
        }
      ],
      "name": "viewCard",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const reencrypt = async () => {
    try {
      const user = "0xba1A058B7f452e626e768724189e20E03b3831fF";
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      // Prompt user for account connections
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const addr =  await signer.getAddress();
      console.log("Account:", await signer.getAddress());
      // const signer = await provider.getSigner();
      console.log(signer,"signer")
      const contract = new Contract(CONTRACT_ADDRESS, rabi, signer);
      const { publicKey, signature } = await getTokenSignature(
        CONTRACT_ADDRESS,
        addr,
        signer
      );
      const ciphertext = await contract.viewSecret(user,publicKey, signature);
      const userBalance = instance.decrypt(CONTRACT_ADDRESS, ciphertext);
      console.log(ciphertext, userBalance);
    } catch (e) {
      console.log(e);
    }
  };

  return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold mb-4">Send Encrypted Data to Your Friend</h1>
      <Button onClick={reencrypt} className="mb-4">Decrypt and Reencrypt</Button>
      <span className="footer">
        Switch to Inco Gentry Testnet on Metamask to encrypt:{" "}
      </span>
      <Form className="Form-container">
        <Form.Group className="form-group">
          <Form.Label className="label">uint8: </Form.Label>
          <Form.Control
            style={{ color: "black" }}
            type="text"
            value={amountUint8}
            placeholder="10"
            onChange={handleAmountChangeUint8}
            className="Input"
          />
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label className="label">ciphertext </Form.Label>
          <Form.Control
            style={{ color: "#72FF80" }}
            type="text"
            value={"0x" + eamountUint8}
            disabled
            onChange={handleAmountChangeUint8}
            className="Input"
          />
          {eamountUint8 !== 0 && (
            <Button variant="default" onClick={handleCopyClickUint8}>
              Copy
            </Button>
          )}
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label className="label">uint16: </Form.Label>
          <Form.Control
            style={{ color: "black" }}
            type="text"
            value={amountUint16}
            placeholder="10"
            onChange={handleAmountChangeUint16}
            className="Input"
          />
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label className="label">ciphertext </Form.Label>
          <Form.Control
            style={{ color: "#72FF80" }}
            type="text"
            value={"0x" + eamountUint16}
            disabled
            onChange={handleAmountChangeUint16}
            className="Input"
          />
          {eamountUint16 !== 0 && (
            <Button variant="default" onClick={handleCopyClickUint16}>
              Copy
            </Button>
          )}
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label className="label">uint32: </Form.Label>
          <Form.Control
            style={{ color: "black" }}
            type="text"
            value={amountUint32}
            placeholder="10"
            onChange={handleAmountChangeUint32}
            className="Input"
          />
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label className="label">ciphertext </Form.Label>
          <Form.Control
            style={{ color: "#72FF80" }}
            type="text"
            value={"0x" + eamountUint32}
            disabled
            onChange={handleAmountChangeUint32}
            className="Input"
          />
          {eamountUint32 !== 0 && (
            <Button variant="default" onClick={handleCopyClickUint32}>
              Copy
            </Button>
          )}
        </Form.Group>
      </Form>
      <br></br>
      <span className="footer">
        Documentation:{" "}
        <a
          href="https://docs.inco.network/introduction/inco-network-introduction"
          target="_blank"
        >
          docs.inco.network
        </a>
      </span>
    </div>
  );
}