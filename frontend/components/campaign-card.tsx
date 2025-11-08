"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { Users, Award, ArrowRight, Check } from "lucide-react"

interface CampaignCardProps {
  id: string
  title: string
  description: string
  icon: ReactNode
  participants: number
  reward: string
  isJoined?: boolean
  onAction: () => void
  isBuilder?: boolean
}

export function CampaignCard({
  id,
  title,
  description,
  icon,
  participants,
  reward,
  isJoined = false,
  onAction,
  isBuilder = false,
}: CampaignCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-colors group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-accent/10 rounded-lg text-accent">{icon}</div>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            isJoined ? "bg-green-500/20 text-green-300" : "bg-muted text-muted-foreground"
          }`}
        >
          {isJoined ? "Joined" : "Active"}
        </span>
      </div>

      <h3 className="text-lg font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>

      <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Users size={16} />
          <span>{participants}</span>
        </div>
        <div className="flex items-center gap-1">
          <Award size={16} />
          <span>{reward}</span>
        </div>
      </div>

      {isJoined ? (
        <button
          onClick={onAction}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all bg-muted text-muted-foreground cursor-default"
          disabled={isJoined}
        >
          <Check size={18} />
          Complete Tasks
        </button>
      ) : (
        <Link
          href={`/campaign/${id}`}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
            isBuilder
              ? "bg-accent text-accent-foreground hover:opacity-90"
              : "bg-primary text-primary-foreground hover:opacity-90 group-hover:gap-3"
          }`}
        >
          {isBuilder ? "View" : "Join"}
          <ArrowRight size={18} />
        </Link>
      )}
    </motion.div>
  )
}