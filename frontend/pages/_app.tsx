import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ChakraProvider } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MyApp({ Component, pageProps }: AppProps) {

  const pvenmoderollupChain = {
    chainId: 1729, // Chain ID of the network
    rpc: ["https://rpc-loyalty-roller-roqlic24du.t.conduit.xyz"], // Array of RPC URLs to use
   
    // Information for adding the network to your wallet (how it will appear for first time users) === \\
    // Information about the chain's native currency (i.e. the currency that is used to pay for gas)
    nativeCurrency: {
      decimals: 18,
      name: "ETH",
      symbol: "ETH",
    },
    shortName: "pvenmode", // Display value shown in the wallet UI
    slug: "pvenmode", // Display value shown in the wallet UI
    testnet: true, // Boolean indicating whether the chain is a testnet or mainnet
    chain: "Private-Venmode", // Name of the network
    name: "Private-Venmode", // Name of the network
  };


  return (
    <ThirdwebProvider 
        activeChain={pvenmoderollupChain} 
        supportedChains={[pvenmoderollupChain]}
        clientId={process.env.NEXT_PUBLIC_THIRDWEB_KEY}
        >
      <ChakraProvider>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </ChakraProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;
