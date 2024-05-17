import { InjectedWallet } from "@thirdweb-dev/react";
import {   ethers} from "ethers";
import { initFhevm, createInstance, FhevmInstance } from "fhevmjs";
export const init = async () => {
  await initFhevm();
};

// TFHE.sol contract address
// From https://github.com/zama-ai/fhevmjs/blob/c4b8a80a8783ef965973283362221e365a193b76/bin/fhevm.js#L9
const FHE_LIB_ADDRESS = "0x000000000000000000000000000000000000005d";

let instance: FhevmInstance;

export const createFhevmInstance = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  
  const network = await provider.getNetwork();
  const chainId = +network.chainId.toString();
  // Get blockchain public key
  const ret = await provider.call({
    to: FHE_LIB_ADDRESS,
    // first four bytes of keccak256('fhePubKey(bytes1)') + 1 byte for library
    data: "0xd9d47bb001",
  });

  const abiencoder = ethers.utils.defaultAbiCoder;
  const decoded= abiencoder.decode(["bytes"], ret);
  const publicKey = decoded[0];
  console.log("publicKey", publicKey);
  instance = await createInstance({ chainId, publicKey });
};


export const getSignature = async (
  contractAddress: string,
  userAddress: string
) => {
  if (getInstance().hasKeypair(contractAddress)) {
    return getInstance().getPublicKey(contractAddress)!;
  } else {
    const { publicKey, eip712 } = getInstance().generatePublicKey({
      verifyingContract: contractAddress,
    });
    const params = [userAddress, JSON.stringify(eip712)];
    const signature: string = await window.ethereum.request({
      method: "eth_signTypedData_v4",
      params,
    });
    getInstance().setSignature(contractAddress, signature);
    return { signature, publicKey };
  }
};


export const getInstance = async () => {
  await init();
  await createFhevmInstance();
  return instance;
};