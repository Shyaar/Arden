import {
  useAccount,
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { toast } from "react-toastify";
import novanaABI from "../abi/novana.json";

// ----- Types -----
export type Room = {
  id: number;
  topic: string;
  creator: string;
  isPrivate: boolean;
  memberCount: number;
  farcasterChannelId: string;
};

export type RawRoom = {
  id: string | number;
  topic: string;
  creator: string;
  isPrivate: boolean;
  memberCount: string | number;
  farcasterChannelId: string;
};

// ----- Create Room Hook -----
export function useCreateRoom() {
  const { address, isConnected } = useAccount();
  const contractAddress = process.env
    .NEXT_PUBLIC_NOVANA_M_CONTRACT_ADDRESS as `0x${string}`;

  const {
    data: hash,
    writeContractAsync,
    isPending,
    error: writeError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const createRoom = async (topic: string, isPrivate: boolean) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first!");
      throw new Error("Wallet not connected");
    }

    if (!contractAddress) {
      toast.error("Contract address missing");
      throw new Error("Contract address missing");
    }

    console.log("🟢 [CreateRoom] Creating room...", { topic, isPrivate });

    try {
      const tx = await writeContractAsync({
        address: contractAddress,
        abi: novanaABI,
        functionName: "createRoom",
        args: [topic, isPrivate],
      });

      toast.info("⏳ Transaction sent... waiting for confirmation");
      console.log("📦 [Tx Sent] Hash:", tx);

      return tx;
    } catch (err: unknown) {
      console.error("🔴 [CreateRoom] Failed:", err);
      toast.error("Failed to create room.");
      throw err;
    }
  };

  return {
    createRoom,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error: writeError,
  };
}

// ----- Read All Rooms -----
export function useReadRooms() {
  const contractAddress = process.env
    .NEXT_PUBLIC_NOVANA_M_CONTRACT_ADDRESS as `0x${string}`;

  const {
    data: roomsData,
    isLoading,
    isError,
    refetch,
  } = useReadContract({
    address: contractAddress,
    abi: novanaABI,
    functionName: "getAllRooms",
  });

  const rooms: Room[] = Array.isArray(roomsData)
    ? roomsData.map((r: RawRoom) => ({
        id: Number(r.id),
        topic: r.topic,
        creator: r.creator,
        isPrivate: r.isPrivate,
        memberCount: Number(r.memberCount),
        farcasterChannelId: r.farcasterChannelId,
      }))
    : [];

  return { rooms, isLoading, isError, refetch };
}

// ----- Read Rooms for Current User -----
export function useReadMyRooms() {
  const { address } = useAccount();
  const contractAddress = process.env
    .NEXT_PUBLIC_NOVANA_M_CONTRACT_ADDRESS as `0x${string}`;

  const {
    data: roomsData,
    isLoading,
    isError,
    refetch,
  } = useReadContract({
    address: contractAddress,
    abi: novanaABI,
    functionName: "getMyRooms",
  });

  console.log("🟢 [useReadMyRooms] Address:", address);
  console.log("🟢 [useReadMyRooms] Contract:", contractAddress);
  console.log("🟢 [useReadMyRooms] Raw roomsData:", roomsData);
  console.log("🟢 [useReadMyRooms] isLoading:", isLoading, "isError:", isError);


  const roomsArray: RawRoom[] = roomsData ? Object.values(roomsData) : [];

  const rooms: Room[] = roomsArray.map((r: RawRoom) => ({
    id: Number(r.id),
    topic: r.topic,
    creator: r.creator,
    isPrivate: r.isPrivate,
    memberCount: Number(r.memberCount),
    farcasterChannelId: r.farcasterChannelId,
  }));

  console.log("🟢 [useReadMyRooms] Processed rooms:", rooms);

  return { rooms, isLoading, isError, refetch };
}

export function useJoinRoom() {
  const { address, isConnected } = useAccount();
  const contractAddress = process.env
    .NEXT_PUBLIC_NOVANA_M_CONTRACT_ADDRESS as `0x${string}`;

  const {
    data: hash,
    writeContractAsync,
    isPending,
    error: writeError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const joinRoom = async (roomId: number) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first!");
      throw new Error("Wallet not connected");
    }

    if (!contractAddress) {
      toast.error("Contract address missing");
      throw new Error("Contract address missing");
    }

    console.log("joining room...", { roomId });

    try {
      const tx = await writeContractAsync({
        address: contractAddress,
        abi: novanaABI,
        functionName: "joinRoom",
        args: [roomId],
      });

      toast.info("⏳ Transaction sent... waiting for confirmation");
      console.log("📦 [Tx Sent] Hash:", tx);

      return tx;
    } catch (err: unknown) {
      console.error("🔴 [CreateRoom] Failed:", err);
      toast.error("Failed to create room.");
      throw err;
    }
  };

  return {
    joinRoom,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error: writeError,
  };
}
