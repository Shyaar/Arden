"use client"

import { Modal } from "./modal"
import { Copy, Check } from "lucide-react"
import { useState } from "react"
// import { QRCodeCanvas } from "qrcode.react"

interface ReceiveFundsModalProps {
  isOpen: boolean
  onClose: () => void
  address: string | undefined
}

import { motion, AnimatePresence } from "framer-motion"

interface ReceiveFundsModalProps {
  isOpen: boolean
  onClose: () => void
  address: string | undefined
}

export function ReceiveFundsModal({ isOpen, onClose, address }: ReceiveFundsModalProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
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
            className="fixed inset-0 bg-black/60 z-50"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md bg-card rounded-lg shadow-2xl"
            >
              <Modal isOpen={true} onClose={onClose} title="Receive Funds">
                <div className="space-y-4 text-center">
                  <p className="text-muted-foreground">
                    Scan the QR code or copy the address below to receive funds into your wallet.
                  </p>
                  <div className="flex flex-col items-center justify-center p-4 bg-card/50 rounded-lg">
                    {/* <QRCodeCanvas value={address || ""} size={128} /> */}
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-card/50 p-4">
                    <span className="text-sm text-muted-foreground">{address}</span>
                    <button onClick={handleCopy} className="text-sm font-semibold text-foreground flex items-center gap-2">
                      {isCopied ? <Check size={16} /> : <Copy size={16} />}
                      {isCopied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              </Modal>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
