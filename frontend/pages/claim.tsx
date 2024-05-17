import { Container, Flex } from "@chakra-ui/react";
import TransferCard from "../components/TransferCard";
import ClaimCard from "../components/ClaimCard";

export default function TransferPage() {
    return (
        <Container maxW={"1440px"}>
            <Flex flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
                <ClaimCard />
            </Flex>
        </Container>
    );
}