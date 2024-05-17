import { Web3Button, useContract } from "@thirdweb-dev/react";
import { PVENMODE_CONTRACT_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import { useToast } from "@chakra-ui/react";
import abi from "../abi/abi";
type Props = {
    tokenAddress: string;
    receiver: string;
    amount: string;
};

export default function CharityButton({ tokenAddress, receiver, amount }: Props) {
    const toast = useToast();

    const {
        contract: tokenContract
    } = useContract(tokenAddress, 'token');

    const {
        contract: transferContract
    } = useContract(PVENMODE_CONTRACT_ADDRESS,abi);

    console.log(tokenContract,"token")

    return (
        <Web3Button
            contractAddress={PVENMODE_CONTRACT_ADDRESS}
            action={async (contract) => {
                await tokenContract?.setAllowance(
                    PVENMODE_CONTRACT_ADDRESS,
                    ethers.utils.parseEther(amount).toString()
                );
                
                await transferContract?.call(
                    "donateToCharity",
                    [
                        tokenAddress,
                        receiver,
                        ethers.utils.parseEther(amount),
                    ]
                );
            }}
            onSuccess={() => toast({
                title: 'Charity Successful',
                description: "You have successfully donated the tokens!",
                status: 'success',
                duration: 9000,
                isClosable: true,
            })}
        >Donate to Charity ⚡</Web3Button>
    );
}