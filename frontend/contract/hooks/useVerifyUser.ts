"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { toast } from "react-toastify";
import userAbi from "../abi/userRegistry.json";
import { useConnectedWallet } from "./useConnectedWallet";

const contractAddress = process.env.NEXT_PUBLIC_UREGIS_CONTRACT_ADDRESS as `0x${string}`;

export function useVerifyUser() {
  const address = useConnectedWallet();

  const { data: hash, writeContractAsync, isPending, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const verify = async (userAddress: string, kycHash: string) => {
    if (!contractAddress) throw new Error("Contract address missing");

    try {
      const tx = await writeContractAsync({
        address: contractAddress,
        abi: userAbi,
        functionName: "verifyUser",
        args: [userAddress, kycHash],
      });

      toast.info("⏳ Verification transaction sent...");
      return tx;
    } catch (err: unknown) {
      console.error("🔴 [VerifyUser] Failed:", err);
      toast.error("Verification failed.");
      throw err;
    }
  };

  return {
    verify,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error: writeError,
  };
}
