"use client"

import type React from "react"
import { useState } from "react"
import { Campaign, Task } from "@/types/campaign"
import {
  Calendar,
  DollarSign,
  Link as LinkIcon,
  CheckCircle,
  XCircle,
  Hash,
  Users,
  ArrowLeft,
  PartyPopper,
} from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { AlertBox } from "@/components/alert-box"
import Link from "next/link"

// Helper component for consistent info display
const InfoItem = ({
  icon,
  label,
  value,
  isAddress = false,
  valueClass = "",
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  isAddress?: boolean
  valueClass?: string
}) => (
  <div className="flex items-start justify-between">
    <p className="flex items-center gap-2 text-muted-foreground">
      {icon}
      <span className="font-semibold">{label}:</span>
    </p>
    {isAddress && typeof value === "string" ? (
      <p className={`text-sm font-mono text-right ${valueClass}`}>
        {value.slice(0, 6)}...{value.slice(-4)}
      </p>
    ) : (
      <p className={`text-right ${valueClass}`}>{value}</p>
    )}
  </div>
)

// Helper component for Task card
const TaskCard = ({ task }: { task: Task }) => (
  <div className="bg-card border border-border rounded-lg p-6 transition-shadow hover:shadow-lg">
    <h3 className="text-xl font-semibold text-foreground mb-2">{task.title}</h3>
    <p className="text-muted-foreground mb-4">{task.description}</p>
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-sm text-accent font-semibold">
        <DollarSign size={16} />
        <span>{task.reward} Reward</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users size={16} />
        <span>{task.completionCount} Completions</span>
      </div>
      <div
        className={`flex items-center gap-2 text-sm font-medium ${
          task.isActive ? "text-green-500" : "text-red-500"
        }`}
      >
        {task.isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
        <span>{task.isActive ? "Active" : "Inactive"}</span>
      </div>
    </div>
  </div>
)


export const CampaignDetails = ({ campaign }: { campaign: Campaign }) => {
  const [alert, setAlert] = useState({ isVisible: false, message: "", variant: "success" as "success" | "error" })

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleJoinCampaign = () => {
    setAlert({
      isVisible: true,
      message: "Welcome! Check your email for next steps.",
      variant: "success",
    })
    setTimeout(() => setAlert({ isVisible: false, message: "", variant: "success" }), 5000)
  }

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-6 py-12">
      {/* Header Section */}
      <AnimatedSection className="mb-8">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 p-6 bg-card border border-border rounded-lg">
          <div>
            <h1 className="text-3xl font-bold mb-2">{campaign.campaignName}</h1>
            <p className="text-muted-foreground">
              Join the movement and get rewarded for your participation.
            </p>
          </div>
          <button
            onClick={handleJoinCampaign}
            className="flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold self-start md:self-auto"
          >
            <PartyPopper size={20} />
            Join Campaign
          </button>
        </div>
      </AnimatedSection>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Campaign Info */}
        <div className="lg:col-span-1">
          <AnimatedSection>
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Campaign Details</h2>
              <div className="space-y-3">
                <InfoItem icon={<Hash size={18} />} label="Factory Address" value={campaign.factory} isAddress />
                <InfoItem icon={<DollarSign size={18} />} label="Total Budget" value={campaign.totalBudget.toString()} />
                <InfoItem
                  icon={<DollarSign size={18} />}
                  label="Remaining Budget"
                  value={campaign.remainingBudget.toString()}
                />
                <InfoItem icon={<Calendar size={18} />} label="End Time" value={formatTimestamp(campaign.campaignEndTime)} />
                <InfoItem
                  icon={campaign.isActive ? <CheckCircle size={18} /> : <XCircle size={18} />}
                  label="Status"
                  value={campaign.isActive ? "Active" : "Inactive"}
                  valueClass={campaign.isActive ? "text-green-500" : "text-red-500"}
                />
                <InfoItem icon={<Users size={18} />} label="Task Completions" value={campaign.taskCounter.toString()} />
                <InfoItem
                  icon={<LinkIcon size={18} />}
                  label="DApp Link"
                  value={
                    <a
                      href={campaign.dappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      Visit DApp
                    </a>
                  }
                />
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Right Column: Tasks */}
        <div className="lg:col-span-2">
          <AnimatedSection>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Available Tasks</h2>
            {campaign.tasks.length > 0 ? (
              <div className="space-y-6">
                {campaign.tasks.map((task: Task, idx) => (
                  <AnimatedSection key={task.id} delay={idx * 0.1}>
                    <TaskCard task={task} />
                  </AnimatedSection>
                ))}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <p className="text-muted-foreground">No tasks defined for this campaign yet.</p>
              </div>
            )}
          </AnimatedSection>
        </div>
      </div>

      {/* Alert Box */}
      <AlertBox
        isVisible={alert.isVisible}
        icon={<PartyPopper size={20} />}
        title="Success"
        message={alert.message}
        onClose={() => setAlert({ isVisible: false, message: "", variant: "success" })}
        variant={alert.variant}
      />
    </main>
  )
}
