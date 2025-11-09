"use client"

import type React from "react"
import { PrivyProvider } from "@privy-io/react-auth"

export function ArdenPrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId="cmhqaffll00axjp0cqwpcv2zk"
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: "/logo.png",
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}
