import type { NextPage } from "next";
import { Box, Button, Container, Flex, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { MediaRenderer } from "@thirdweb-dev/react";
import FeatureCard from "../components/FeatureCard";
import Link from "next/link";
import Events from "../components/Events";

const Home: NextPage = () => {
  return (
    <Container maxW={"1440px"}>
      <Flex h={"75vh"} px={20} borderRadius={20} >
        <Flex flexDirection={"row"}>
          <Flex flexDirection={"column"} justifyContent={"center"} w={"60%"}>
            <Stack spacing={4}>
              <Heading fontSize={"xl"}>PrivateVenmode</Heading>
              <Heading fontSize={"6xl"}>
                Send tokens along with a secret message to your friends by wrapping it in a gift.
              </Heading>
              <Text fontSize={"xl"}>
                Select from a selection of tokens to transfer to your friends and family. Write a message and code to go along with your token transfer. Connect your wallet to get started now!
              </Text>
              <Link href={"/wrapgift"}>
                <Button w={"80%"}>Wrap a gift</Button>
              </Link>
            </Stack>
          </Flex>
          <Box marginLeft={"auto"} w={"80%"}>
            <MediaRenderer
              src="/pvenmode.png"
              height="100%"
              width="100%"
            />
          </Box>
        </Flex>
      </Flex>
      <SimpleGrid columns={2} spacing={4} mt={4}>
        <Flex>
          <MediaRenderer
            src="/pvenmode.png"
            height="100%"
            width="80%"
          />
        </Flex>
        <Flex flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
          <Stack spacing={4}>
            <FeatureCard
              step={"01"}
              title={"Select a Token"}
              description={"Select from a list of verified tokens from the drop down to send to your friends and family."}
            />
            <FeatureCard
              step={"02"}
              title={"Who to Send To"}
              description={"Enter the wallet address of the person you want to send the token to. This is non-reversible so make sure you have the right address."}
            />
            <FeatureCard
              step={"03"}
              title={"Select the method"}
              description={"Simple , Timelock or Recurring"}
            />
            <FeatureCard
              step={"04"}
              title={"Write a Message"}
              description={"Write a message to go along with your token transfer. A nicer way to send a message along with the gift to your friends and family."}
            />
            <FeatureCard
              step={"05"}
              title={"Input the Unique Claim Code"}
              description={"Write the unique claim code that will be used to claim by the recipient. This is non-reversible so make sure you input the right code."}
            />
          </Stack>
        </Flex>
      </SimpleGrid>
      <Events />
    </Container>
  );
};

export default Home;