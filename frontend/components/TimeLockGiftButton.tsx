import { Web3Button, useContract } from "@thirdweb-dev/react";
import { PVENMODE_CONTRACT_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import { useToast } from "@chakra-ui/react";
import abi from "../abi/abi.json";
type Props = {
    tokenAddress: string;
    receiver: string;
    amount: string;
    message: string;
    unlocktime: any;
};

export default function TimeLockGiftButton({ tokenAddress, receiver, amount, message , unlocktime }: Props) {
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
                    "createTimelockedGift",
                    [
                        tokenAddress,
                        receiver,
                        ethers.utils.parseEther(amount),
                        message,
                        unlocktime
                    ]
                );
            }}
            onSuccess={() => toast({
                title: 'Transfer Successful',
                description: "You have successfully transferred tokens!",
                status: 'success',
                duration: 9000,
                isClosable: true,
            })}
        >Wrap in the ⌚ Locker</Web3Button>
    );
}