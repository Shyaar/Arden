"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Wallet, LogOut, Eye } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (connected: boolean) => void
  isConnected: boolean
}

export function WalletModal({ isOpen, onClose, onConnect, isConnected }: WalletModalProps) {
  const [balance] = useState("0.00 USDC")
  const isMobile = useMediaQuery("(max-width: 640px)")

  const handleConnect = () => {
    onConnect(true)
  }

  const handleDisconnect = () => {
    onConnect(false)
  }

  const modalVariants = {
    hidden: {
      opacity: 0,
      x: isMobile ? 0 : 400,
      y: isMobile ? 200 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
    exit: {
      opacity: 0,
      x: isMobile ? 0 : 400,
      y: isMobile ? 200 : 0,
    },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40"
          />
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed right-10 top-0 sm:top-auto sm:bottom-0 h-screen sm:h-full w-full sm:w-96 bg-card border-l border-border shadow-2xl z-50 overflow-y-auto rounded-t-lg sm:rounded-t-none"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg text-accent">
                  <Wallet size={20} />
                </div>
                <h2 className="text-lg font-semibold">Wallet</h2>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {!isConnected ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Connect your Account Abstraction wallet to start participating in campaigns.
                  </p>
                  <button
                    onClick={handleConnect}
                    className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Wallet size={18} />
                    Wallet
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-card/50 border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <span className="text-sm font-semibold text-accent flex items-center gap-2">
                        <div className="w-2 h-2 bg-accent rounded-full" />
                        Connected
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Balance</span>
                      <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Eye size={16} />
                        {balance}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleDisconnect}
                    className="w-full py-2.5 bg-muted text-foreground rounded-lg font-semibold hover:bg-muted/80 transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut size={18} />
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
