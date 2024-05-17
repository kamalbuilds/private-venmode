import { Container, Flex } from "@chakra-ui/react";
import Events from "../components/Events";
import Charity from "../components/Charity";

export default function TransferPage() {
    return (
        <Container maxW={"1440px"}>
            <Flex flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
                <Charity />
                <Events />
            </Flex>
        </Container>
    );
}