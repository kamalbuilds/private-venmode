import { Web3Button, useContract } from "@thirdweb-dev/react";
import { PVENMODE_CONTRACT_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import { useToast } from "@chakra-ui/react";
import abi from "../abi/abi";
type Props = {
    tokenAddress: string;
    receiver: string;
    amount: string;
    message: string;
    claimcode: string;
};

export default function TransferButton({ tokenAddress, receiver, amount, message , claimcode }: Props) {
    const toast = useToast();

    const {
        contract: tokenContract
    } = useContract(tokenAddress, 'token');

    const {
        contract: transferContract
    } = useContract(PVENMODE_CONTRACT_ADDRESS,abi);

    return (
        <Web3Button
            contractAddress={PVENMODE_CONTRACT_ADDRESS}
            action={async (contract) => {
                await tokenContract?.setAllowance(
                    PVENMODE_CONTRACT_ADDRESS,
                    ethers.utils.parseEther(amount).toString()
                );
                
                await transferContract?.call(
                    "createGiftWithClaimCode",
                    [
                        tokenAddress,
                        receiver,
                        ethers.utils.parseEther(amount),
                        message,
                        claimcode
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
        >Transfer Token</Web3Button>
    );
}