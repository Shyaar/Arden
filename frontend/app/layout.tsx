import { Analytics } from "@vercel/analytics/next"
import { ArdenPrivyProvider } from "@/components/privy-provider"
import ContextProvider from "./context"
import "./globals.css"

import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Arden - Find Your First Users",
  description: "Arden helps new builders find their first real users via incentivized campaigns",
  generator: "v0.app",
  icons: {
    icon: "/logo.png",
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // AppKit style: get cookies from headers
  const headersObj = await import("next/headers").then((mod) => mod.headers())
  const cookies = headersObj.get("cookie")

  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased ${inter.className}`}>
        <ContextProvider cookies={cookies}>
          <ArdenPrivyProvider>
            {children}
          </ArdenPrivyProvider>
        </ContextProvider>
        <Analytics />
      </body>
    </html>
  )
}