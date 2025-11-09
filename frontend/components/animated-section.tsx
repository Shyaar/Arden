"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface AnimatedSectionProps {
  children: ReactNode
  delay?: number
  className?: string
  id?: string
}

export function AnimatedSection({ children, delay = 0, className = "", id }: AnimatedSectionProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
