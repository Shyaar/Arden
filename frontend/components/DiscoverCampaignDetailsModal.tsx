"use client"

import { Modal } from "./modal"
import { Campaign, Task } from "@/types/campaign"
import { formatEther } from "viem"
import { Separator } from "./ui/separator"
import { Progress } from "./ui/progress"
import { CheckCircle2, Circle, User, Target, DollarSign, Calendar, Users } from "lucide-react" // Imported new icons

interface DiscoverCampaignDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  campaign: Campaign | null
}

export function DiscoverCampaignDetailsModal({ isOpen, onClose, campaign }: DiscoverCampaignDetailsModalProps) {
  if (!campaign) {
    return null
  }

  const progress = (Number(campaign.currentAmount) / Number(campaign.targetAmount)) * 100

  const formatTimestamp = (timestamp: number) => {
    if (timestamp && !isNaN(timestamp)) {
      return new Date(timestamp * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return "N/A"; // Fallback for invalid date
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={campaign.campaignName} size="6xl">
      <div className="space-y-4 ">
        <div>
          <h3 className="text-lg font-semibold">Description</h3>
          <p className="text-muted-foreground">{campaign.description}</p>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold">Details</h3>
          <InfoItem icon={<User size={18} />} label="Owner" value={campaign.owner} />
          <InfoItem icon={<Target size={18} />} label="Target Amount" value={`${formatEther(BigInt(campaign.targetAmount ?? '0'))} ETH`} />
          <InfoItem icon={<DollarSign size={18} />} label="Current Amount" value={`${formatEther(BigInt(campaign.currentAmount ?? '0'))} ETH`} />
          <InfoItem icon={<Calendar size={18} />} label="Deadline" value={formatTimestamp(campaign.campaignEndTime)} />
          <InfoItem icon={<Users size={18} />} label="Backers" value={(campaign.backers ?? 0).toString()} />
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold">Funding Progress</h3>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2">
            {progress.toFixed(2)}% of target reached
          </p>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold">Tasks</h3>
          {campaign.tasks && campaign.tasks.length > 0 ? (
            <ul className="space-y-2">
              {campaign.tasks.map((task: Task) => (
                <li key={task.id} className="flex flex-col p-3 border border-border rounded-md">
                  <div className="flex items-center gap-2">
                    {task.completed ? (
                      <CheckCircle2 className="text-green-500" size={20} />
                    ) : (
                      <Circle className="text-muted-foreground" size={20} />
                    )}
                    <span className="font-medium">{task.title}</span>
                  </div>
                  <p className="text-muted-foreground text-sm ml-7">{task.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground ml-7 mt-1">
                    <span>Reward: {task.reward} ETH</span>
                    <span>Completions: {task.completionCount}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No tasks defined for this campaign.</p>
          )}
        </div>
      </div>
    </Modal>
  )
}

// Reusable InfoItem component
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
}) => (
  <div className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
    <span className="text-muted-foreground flex items-center gap-2 min-w-[150px]">
      {icon}
      {label}:
    </span>
    <span className={`font-medium break-all ${valueClass || "text-foreground"}`}>{value}</span>
  </div>
)
