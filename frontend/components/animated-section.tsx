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
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
