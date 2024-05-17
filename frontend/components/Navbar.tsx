import { Container, Flex, Text } from "@chakra-ui/react";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import Link from "next/link";

export default function Navbar() {
    const address = useAddress();

    return (
        <Container maxW={"1440px"} py={4}>
            <Flex flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <Link href={"/"}>
                    <Text fontWeight={"black"}>PrivateVenmode</Text>
                </Link>
                {address && (
                    <Flex flexDirection={"row"}>
                        <Link href={"/wrapgift"}>
                            <Text mr={8}>Wrap Gift</Text>
                        </Link>
                        
                            <Link href="/claim">
                                <Text mr={8}> Claim Gift</Text>
                            </Link>

                            <Link href="/timelockedgift">
                                <Text mr={8}> Time ⌚ Locked Gift</Text>
                            </Link>

                            <Link href={"/donatetocharity"}>
                            <Text mr={8}>Donate to Charity 💁</Text>
                        </Link>
                        
                        <Link href={`/profile/${address}`}>
                            <Text>My Account</Text>
                        </Link>
                    </Flex>
                )}
                <ConnectWallet/>
            </Flex>
        </Container>
    )
}