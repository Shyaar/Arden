import { Analytics } from "@vercel/analytics/next"
import { ArdenPrivyProvider } from "@/components/privy-provider"
import "./globals.css"



export const metadata: Metadata = {
  title: "Arden - Find Your First Users",
  description: "Arden helps new builders find their first real users via incentivized campaigns",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased`}>
        <ArdenPrivyProvider>{children}</ArdenPrivyProvider>
        <Analytics />
      </body>
    </html>
  )
}
