"use client"

import { useState } from "react"
import { Campaign, Task } from "@/types/campaign"
import { CampaignData } from "@/types/dashboard"
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
  Edit,
  Trash2,
  Target,
  Trophy,
} from "lucide-react"
import Link from "next/link"
import { useLocalStorage } from "@/hooks/use-localStorage"
import { AnimatedSection } from "@/components/animated-section"
import { AlertBox } from "@/components/alert-box"

export const CampaignDetails = ({ campaign }: { campaign: Campaign }) => {
  const [alert, setAlert] = useState({ isVisible: false, message: "", variant: "success" as "success" | "error" })
  const [createdCampaigns] = useLocalStorage<CampaignData[]>("createdCampaigns", [])
  const isCreator = useState(() => {
    const found = createdCampaigns.find((c) => c.id === campaign.id)
    return !!found
  })[0]

  const formatTimestamp = (timestamp: number) =>
    new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  const handleJoinCampaign = () => {
    setAlert({
      isVisible: true,
      message: "🎉 Welcome aboard! Check your email for next steps.",
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
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 p-6 bg-gradient-to-tr from-card to-background border border-border rounded-2xl shadow-md">
          <div>
            <h1 className="text-4xl font-extrabold mb-2 text-foreground flex items-center gap-2">
              <Target className="text-primary" size={28} />
              {campaign.campaignName}
            </h1>
            <p className="text-muted-foreground">
              Join the movement and earn rewards for your participation 🚀
            </p>
          </div>

          {isCreator ? (
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-3 bg-accent text-accent-foreground rounded-xl shadow hover:opacity-90 transition-opacity font-semibold">
                <Edit size={20} />
                Edit
              </button>
              <button className="flex items-center gap-2 px-4 py-3 bg-destructive text-destructive-foreground rounded-xl shadow hover:opacity-90 transition-opacity font-semibold">
                <Trash2 size={20} />
                Delete
              </button>
            </div>
          ) : (
            <button
              onClick={handleJoinCampaign}
              className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all font-semibold"
            >
              <PartyPopper size={20} />
              Join Campaign
            </button>
          )}
        </div>
      </AnimatedSection>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Campaign Info */}
        <div className="lg:col-span-1">
          <AnimatedSection>
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-24 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <Hash className="text-primary" size={20} />
                Campaign Info
              </h2>
              <div className="space-y-3">
                <InfoItem icon={<Hash size={18} />} label="Factory Address" value={campaign.factory} isAddress />
                <InfoItem icon={<DollarSign size={18} />} label="Total Budget" value={`${campaign.totalBudget} ETH`} />
                <InfoItem
                  icon={<DollarSign size={18} />}
                  label="Remaining Budget"
                  value={`${campaign.remainingBudget} ETH`}
                />
                <InfoItem icon={<Calendar size={18} />} label="End Date" value={formatTimestamp(campaign.campaignEndTime)} />
                <InfoItem
                  icon={campaign.isActive ? <CheckCircle size={18} /> : <XCircle size={18} />}
                  label="Status"
                  value={campaign.isActive ? "Active" : "Inactive"}
                  valueClass={campaign.isActive ? "text-green-500" : "text-red-500"}
                />
                <InfoItem icon={<Users size={18} />} label="Task Count" value={campaign.taskCounter.toString()} />
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
                      Visit DApp ↗
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
            <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
              <Trophy className="text-yellow-500" size={24} />
              Available Tasks
            </h2>
            {campaign.tasks.length > 0 ? (
              <div className="space-y-6">
                {campaign.tasks.map((task: Task, idx) => (
                  <AnimatedSection key={task.id} delay={idx * 0.1}>
                    <TaskCard task={task} />
                  </AnimatedSection>
                ))}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-xl p-8 text-center">
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

// ✅ Supporting Mini Components

const InfoItem = ({
  icon,
  label,
  value,
  valueClass,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  valueClass?: string
  isAddress?: boolean
}) => (
  <div className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
    <span className="text-muted-foreground flex items-center gap-2 min-w-[150px]">
      {icon}
      {label}:
    </span>
    <span className={`font-medium break-all ${valueClass || "text-foreground"}`}>{value}</span>
  </div>
)

const TaskCard = ({ task }: { task: Task }) => (
  <div className="p-6 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all">
    <h3 className="text-xl font-semibold flex items-center gap-2 text-foreground">
      <Target className="text-primary" size={20} />
      {task.title}
    </h3>
    <p className="text-muted-foreground mb-3 mt-1">{task.description}</p>
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
      <span className="flex items-center gap-1">
        <DollarSign size={16} />
        Reward: <strong className="text-foreground">{task.reward}</strong>
      </span>
      <span className="flex items-center gap-1">
        {task.isActive ? (
          <CheckCircle className="text-green-500" size={16} />
        ) : (
          <XCircle className="text-red-500" size={16} />
        )}
        {task.isActive ? "Active" : "Inactive"}
      </span>
      <span className="flex items-center gap-1">
        <Users size={16} />
        {task.completionCount} completions
      </span>
    </div>
  </div>
)
