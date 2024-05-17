import { Avatar, Container, Flex, Heading, SimpleGrid, Spinner, Text, Toast, useToast } from "@chakra-ui/react";
import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { PVENMODE_CONTRACT_ADDRESS } from "../../const/addresses";
import BalanceCard from "../../components/BalanceCard";
import abi from "../../abi/abi.json";
import accountabstractionabi from "../../abi/accountabstractionabi.json";
import { Web3Button } from "@thirdweb-dev/react";


export default function AccountPage() {
    const address = useAddress();
    const toast = useToast();


    function truncateAddress(address: string) {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    const {
        contract: transferContract,
    } = useContract(PVENMODE_CONTRACT_ADDRESS, abi);

    const {
        data: verifiedTokens,
        isLoading: isVerifiedTokensLoading,
    } = useContractRead(
        transferContract,
        "getAllVerifiedTokens"
    );

    const { contract: accountabstractionwallet, isLoading: isAccountAbstractionWalletLoading } = useContract("0x68DA1997502c5B8b4a4cD1030395dB9F4078A6a1", accountabstractionabi);

    const { data: smc, isLoading: smcloading } = useContractRead(accountabstractionwallet, "getAddress", [address, "0x"]);


    return (
        <Container maxW={"1440px"} py={4}>
            {address ? (
                <Flex>
                    <Flex flexDirection={"column"} mr={8} p={10}>
                        <Avatar size={"2xl"} mb={4} />
                        <Text
                            fontSize={"sm"}
                            border={"1px solid black"}
                            textAlign={"center"}
                            borderRadius={4}
                        >{truncateAddress(address)}</Text>
                    </Flex>
                    <Flex flexDirection={"column"} w={"100%"}>
                        <Heading>Token Balances</Heading>
                        <SimpleGrid columns={3} spacing={4} mt={4}>
                            {!isVerifiedTokensLoading ? (
                                verifiedTokens.map((token: string) => (
                                    <BalanceCard
                                        key={token}
                                        tokenAddress={token}
                                    />
                                )

                                )
                            ) : (
                                <Spinner />
                            )}

                        </SimpleGrid>

                        <Web3Button
                            contractAddress="0x68DA1997502c5B8b4a4cD1030395dB9F4078A6a1"
                            action={async () => {

                                await accountabstractionwallet?.call(
                                    "createAccount",
                                    [
                                        address,
                                        "0x"
                                    ]
                                );
                            }}
                            className="p-8"
                            onSuccess={() => toast({
                                title: 'Smart Wallet created ⚡',
                                description: "Created smart account with your address as owner!",
                                status: 'success',
                                duration: 9000,
                                isClosable: true,
                            })}
                        >Deploy your Smart Wallet</Web3Button>

                        {!smcloading ? (
                            <Flex>
                                <h2 className="h2"> Your Smart Account Address is : {smc}</h2>
                            </Flex>
                        ) : (
                            <Spinner />
                        )}
                    </Flex>
                </Flex>
            ) : (
                <Flex>
                    <Text>Connect Wallet</Text>
                </Flex>
            )}

        </Container>
    )
}