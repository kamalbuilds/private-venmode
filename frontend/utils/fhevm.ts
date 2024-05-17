// @ts-nocheck
import {  ethers} from "ethers";
import { initFhevm, createInstance, FhevmInstance } from "fhevmjs";


export const init = async () => {
  await initFhevm();
};

// TFHE.sol contract address
// From https://github.com/zama-ai/fhevmjs/blob/c4b8a80a8783ef965973283362221e365a193b76/bin/fhevm.js#L9
const FHE_LIB_ADDRESS = "0x000000000000000000000000000000000000005d";


export let instance: FhevmInstance;

export const createFhevmInstance = async () => {
  console.log("createFhevmInstance");
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  
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

export const getInstance = async () => {
  await init();
  await createFhevmInstance();
  return instance;
};

export const getTokenSignature = async (contractAddress, userAddress, provider) => {
  const eip712Domain = {
    // This defines the network, in this case, Gentry Testnet.
    chainId: 9090,
    // Give a user-friendly name to the specific contract you're signing for.
    // MUST match the string in contract constructor (EIP712Modifier).
    name: 'Authorization token',
    // // Add a verifying contract to make sure you're establishing contracts with the proper entity.
    verifyingContract: contractAddress,
    // This identifies the latest version.
    // MUST match the version in contract constructor (EIP712Modifier).
    version: '1',
  };


  console.log(provider,"provider",);

  const reencryption = instance.generatePublicKey(eip712Domain);

  const signature = await provider._signTypedData(
    reencryption.eip712.domain,
    {Reencrypt: reencryption.eip712.types.Reencrypt},
    reencryption.eip712.message
  )
  instance.setSignature(contractAddress, signature);

  const publicKey = instance.getPublicKey(contractAddress).publicKey;
  return { signature, publicKey };
};

export const getSignature = async (contractAddress, userAddress, chainId, ) => {
  if (!instance) {
    await getInstance();
  }
  if (instance.hasKeypair(contractAddress)) {
    return instance.getPublicKey(contractAddress);
  } else {
    const { publicKey, eip712 } = instance.generatePublicKey({
      chainId: chainId,
      name: "Authorization token",
      version: "1",
      verifyingContract: contractAddress
    });
    const params = [userAddress, JSON.stringify(eip712)];
    const signature = await window.ethereum.request({ method: 'eth_signTypedData_v4', params });
    instance.setSignature(contractAddress, signature);
    return { signature, publicKey };
  }
};
