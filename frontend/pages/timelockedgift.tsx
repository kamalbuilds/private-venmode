import { Container, Flex } from "@chakra-ui/react";
import Events from "../components/Events";
import TimeLockedGift from "../components/TimeLockedGift";

export default function TransferPage() {
    return (
        <Container maxW={"1440px"}>
            <Flex flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
                <TimeLockedGift />
                <Events />
            </Flex>
        </Container>
    );
}