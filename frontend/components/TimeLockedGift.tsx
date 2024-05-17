import { Box, Card, Flex, Heading, Input, Text } from "@chakra-ui/react";
import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { PVENMODE_CONTRACT_ADDRESS } from "../const/addresses";
import TokenSelection from "./TokenSelection";
import { useState } from "react";
import TokenBalance from "./TokenBalance";
import TransferButton from "./TransferButton";
import styles from "../styles/Home.module.css";
import abi from "../abi/abi.json";
import TimeLockGiftButton from "./TimeLockGiftButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function TimeLockedGift() {
    const address = useAddress();
    const [startDate, setStartDate] = useState(new Date());
    const {
        contract
    } = useContract(PVENMODE_CONTRACT_ADDRESS, abi);

    const {
        data: verifiedTokens,
        isLoading: isVerifiedTokensLoading,
    } = useContractRead(contract, "getAllVerifiedTokens");


    console.log(verifiedTokens,"verifiedTokens", isVerifiedTokensLoading);
    const [formData, setFormData] = useState({
        receiver: '',
        amount: '',
        message: '',
    });

    const [selectedToken, setSelectedToken] = useState('');

    const handleChange = (event: any, name: any) => {
        setFormData((prevState) => ({
            ...prevState,
            [name]: event.target.value
        }));
    };

    const handleTokenSelection = (tokenAddress: string) => {
        setSelectedToken(tokenAddress);
    };

    return (
<Card w={"50%"} p={20}>
            <Heading>Send TimeLocked Gift:</Heading>

            <Text mt={4} fontWeight={"bold"}>Select Token:</Text>
            <Flex flexDirection={"row"} mt={4}>
                {!isVerifiedTokensLoading && verifiedTokens && 
                    verifiedTokens.map((token : string) => (
                        <Box
                            key={token}
                            onClick={() => handleTokenSelection(token)}
                            className={styles.tokenButton}
                        >
                            <TokenSelection
                                tokenAddress={token}
                                isSelected={selectedToken === token}
                            />
                        </Box>
                    ))}
            </Flex>

            <TokenBalance tokenAddress={selectedToken} />

            <Text mt={4} fontWeight={"bold"}>Send To:</Text>
            <Input
                placeholder="0x0000000"
                type="text"
                value={formData.receiver}
                onChange={(event) => handleChange(event, "receiver")}
            />
            <Text mt={4} fontWeight={"bold"}>Amount:</Text>
            <Input
                placeholder="0.0"
                type="number"
                value={formData.amount}
                onChange={(event) => handleChange(event, "amount")}
            />
            <Text mt={4} fontWeight={"bold"}>Message:</Text>
            <Input
                placeholder="Add a short message here."
                type="text"
                value={formData.message}
                onChange={(event) => handleChange(event, "message")}
            />
             

            <Text mt={4} fontWeight={"bold"}>Unlock Time:</Text>
            <DatePicker selected={startDate} onChange={(date: any) => setStartDate(date)} />
   
            <Box mt={8}>
            {address ? (
                <TimeLockGiftButton
                    tokenAddress={selectedToken}
                    receiver={formData.receiver}
                    amount={formData.amount.toString()}
                    message={formData.message}
                    unlocktime={startDate}
                />
                ) : (
                    <Text>Please connect your wallet to make a transfer.</Text>
                )}
            </Box>
        </Card>
    );
};