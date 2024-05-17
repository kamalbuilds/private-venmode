import { Box, Card, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { useContract, useContractEvents } from "@thirdweb-dev/react";
import { PVENMODE_CONTRACT_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import abi from "../abi/abi.json";
export default function Events() {
    function truncateAddress(address: string) {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }

    const {
        contract
    } = useContract(PVENMODE_CONTRACT_ADDRESS,abi);

    const {
        data: events,
        isLoading: isEventsLoading,
    } = useContractEvents(
        contract,
        "Transfer",
        {
            queryFilter: {
                fromBlock: 257785,
            }
        }
    );

    return (
        <Box mt={20} w={"100%"}>
            <Heading>Recent Transfer:</Heading>
            {!isEventsLoading ? (
                events?.map((event: any, index) => (
                    <Card key={index} p={8} my={4}>
                        <Flex flexDirection={"row"} alignItems={"center"}>
                            <Text p={2} border={"1px solid grey"} borderRadius={6} fontSize={"xs"}>{truncateAddress(event.data.sender)}</Text>
                            <Text mx={2} fontSize={"sm"}>To</Text>
                            <Text p={2} border={"1px solid grey"} borderRadius={6} fontSize={"xs"}>{truncateAddress(event.data.receiver)}</Text>
                        </Flex>
                        <Text fontSize={"xl"} my={4}>{event.data.message}</Text>
                        <Text>Amount: {ethers.utils.formatEther(event.data.amount)}</Text>
                    </Card>
                )).reverse()
            ) : (
                <Spinner />
            )}
        </Box>
    )
};