import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";

export function useConnectedWallet(): `0x${string}` | null {
  const { user, ready, authenticated } = usePrivy();
  const [userAddress, setUserAddress] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !authenticated || !user) return;

    const interval = setInterval(() => {
      if (!user.linkedAccounts?.length) return;

      const wallet =
        user.linkedAccounts.find((a) => a.type === "smart_wallet") ||
        user.linkedAccounts.find((a) => a.type === "wallet");

      if (wallet?.address) {
        setUserAddress(wallet.address);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [ready, authenticated, user]);

  // Typecast safely; return null until ready
  return userAddress ? (userAddress as `0x${string}`) : null;
}
