"use client"

import type { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  icon?: ReactNode
  children: ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full" // Added "full" size
}

export function Modal({ isOpen, onClose, title, icon, children, size = "md" }: ModalProps) {
  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    full: "max-w-full", // Added max-w-full for "full" size
  }[size];

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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={`fixed max-sm:inset-x-4 max-sm:top-16 max-sm:h-[calc(100vh-8rem)] sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 w-full ${maxWidthClass} bg-card rounded-lg shadow-2xl z-50`}
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                {icon && <div className="text-accent">{icon}</div>}
                <h2 className="text-xl font-semibold">{title}</h2>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-12rem)] sm:max-h-[80vh]">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
