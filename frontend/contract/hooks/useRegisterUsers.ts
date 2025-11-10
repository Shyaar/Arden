"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { toast } from "react-toastify";
import userAbi from "../abi/userRegistry.json";
import { useConnectedWallet } from "./useConnectedWallet";

const contractAddress = process.env.NEXT_PUBLIC_UREGIS_CONTRACT_ADDRESS as `0x${string}`;

export function useRegisterUser() {
  const address = useConnectedWallet();

  const { data: hash, writeContractAsync, isPending, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const register = async (firstName: string, lastName: string, role: number) => {
    if (!contractAddress) throw new Error("Contract address missing");

    try {
      const tx = await writeContractAsync({
        address: contractAddress,
        abi: userAbi,
        functionName: "registerUser",
        args: [firstName, role, lastName],
      });

      toast.info("⏳ Transaction sent... waiting for confirmation");
      return tx;
    } catch (err: unknown) {
      console.error("🔴 [RegisterUser] Failed:", err);
      toast.error("Registration failed.");
      throw err;
    }
  };

  return {
    register,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error: writeError,
  };
}
