"use client";

import { useReadContract } from "wagmi";
import userAbi from "../abi/userRegistry.json";
import { useConnectedWallet } from "./useConnectedWallet";

export type User = {
  userAddress: string;
  firstName: string;
  lastName: string;
  role: number;
  isRegistered: boolean;
  isVerified: boolean;
};

const contractAddress = process.env.NEXT_PUBLIC_UREGIS_CONTRACT_ADDRESS as `0x${string}`;

export function useUsers() {
  const address = useConnectedWallet(); 

  const userRead = useReadContract({
    address: contractAddress,
    abi: userAbi,
    functionName: "getUser",
    args: [address],
  });

  const ardenUserRead = useReadContract({
    address: contractAddress,
    abi: userAbi,
    functionName: "ardenUsers",
    args: [address],
  });

  const totalRegisteredRead = useReadContract({
    address: contractAddress,
    abi: userAbi,
    functionName: "registeredUsers",
  });

  const totalVerifiedRead = useReadContract({
    address: contractAddress,
    abi: userAbi,
    functionName: "verifiedUsers",
  });

  const kycRead = useReadContract({
    address: contractAddress,
    abi: userAbi,
    functionName: "kycVerification",
    args: [address],
  });

  const userDataRaw = (userRead.data || ardenUserRead.data) as User | undefined;

  const userData = userDataRaw
    ? {
        userAddress: userDataRaw.userAddress,
        firstName: userDataRaw.firstName,
        lastName: userDataRaw.lastName,
        role: userDataRaw.role,
        isRegistered: userDataRaw.isRegistered,
        isVerified: userDataRaw.isVerified,
      }
    : undefined;

  return {
    address,
    userData,
    kycHash: kycRead.data as string | undefined,
    totalRegistered: totalRegisteredRead.data as number | undefined,
    totalVerified: totalVerifiedRead.data as number | undefined,
    isLoading:
      userRead.isLoading ||
      ardenUserRead.isLoading ||
      totalRegisteredRead.isLoading ||
      totalVerifiedRead.isLoading ||
      kycRead.isLoading,
    isError:
      userRead.isError ||
      ardenUserRead.isError ||
      totalRegisteredRead.isError ||
      totalVerifiedRead.isError ||
      kycRead.isError,
    refetchUser: userRead.refetch,
    refetchArden: ardenUserRead.refetch,
    refetchTotalRegistered: totalRegisteredRead.refetch,
    refetchTotalVerified: totalVerifiedRead.refetch,
    refetchKYC: kycRead.refetch,
  };
}
