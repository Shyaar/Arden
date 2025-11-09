"use client"

import React, { useState } from "react"
import { Modal } from "./modal"
import { Campaign, Task } from "@/types/campaign"
import { PlusCircle, Target, Hash, DollarSign, Calendar, CheckCircle, XCircle, Users, Link as LinkIcon, PartyPopper } from "lucide-react"
import { CreateTaskModal } from "./CreateTaskModal"
import { AlertBox } from "./alert-box"
import { useLocalStorage } from "@/hooks/use-localStorage"

interface OwnedCampaignDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  campaign: Campaign | null
  onUpdateCampaign: (updatedCampaign: Campaign) => void // New prop
}

export const OwnedCampaignDetailsModal: React.FC<OwnedCampaignDetailsModalProps> = ({
  isOpen,
  onClose,
  campaign,
  onUpdateCampaign,
}) => {
  const [alert, setAlert] = useState({ isVisible: false, message: "", variant: "success" as "success" | "error" })
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false)
  const [isConfirmTaskModalOpen, setIsConfirmTaskModalOpen] = useState(false) // New state
  const [taskToConfirm, setTaskToConfirm] = useState<Omit<Task, "id" | "isActive" | "completionCount" | "completed"> | null>(null) // New state
  const [createdCampaigns, setCreatedCampaigns] = useLocalStorage<Campaign[]>("createdCampaigns", []) // Needed for task management

  if (!campaign) return null;

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

  const handleAddTask = (newTaskData: Omit<Task, "id" | "isActive" | "completionCount" | "completed">) => {
    setTaskToConfirm(newTaskData);
    setIsConfirmTaskModalOpen(true);
    setIsCreateTaskModalOpen(false); // Close the create task modal
  };

  const confirmAddTask = () => {
    if (!taskToConfirm) return;

    const newTask: Task = {
      ...taskToConfirm,
      id: campaign.taskCounter + 1,
      isActive: true,
      completionCount: 0,
      completed: false, // Initialize completed to false
    };

    const updatedCampaign = { ...campaign, tasks: [...campaign.tasks, newTask], taskCounter: campaign.taskCounter + 1 };
    
    // Update the campaign in localStorage
    setCreatedCampaigns((prevCampaigns) => 
      prevCampaigns.map((c) => (c.id === updatedCampaign.id ? updatedCampaign : c))
    );
    onUpdateCampaign(updatedCampaign); // Call the prop to update parent state

    setAlert({
      isVisible: true,
      message: "Task added successfully! Remember, tasks cannot be deleted or edited.",
      variant: "success",
    });
    setIsConfirmTaskModalOpen(false); // Close the confirmation modal
    setTaskToConfirm(null); // Clear the task to confirm
  };

  const cancelAddTask = () => {
    setIsConfirmTaskModalOpen(false);
    setTaskToConfirm(null);
    setAlert({
      isVisible: true,
      message: "Task creation cancelled.",
      variant: "error",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={campaign.campaignName} icon={<Target size={24} />} size="6xl">
      <div className="p-4">
        {/* Action Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setIsCreateTaskModalOpen(true)}
            className="flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl shadow hover:opacity-90 transition-opacity font-semibold"
          >
            <PlusCircle size={20} />
            Add Task
          </button>
        </div>

        {/* Campaign Info */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6 shadow-sm">
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

        {/* Tasks List */}
        <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
          <PartyPopper className="text-yellow-500" size={24} />
          Tasks
        </h2>
        {campaign.tasks.length > 0 ? (
          <div className="space-y-4">
            {campaign.tasks.map((task: Task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <p className="text-muted-foreground">No tasks defined for this campaign yet.</p>
          </div>
        )}
      </div>

      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onAddTask={handleAddTask}
      />

      <Modal
        isOpen={isConfirmTaskModalOpen}
        onClose={cancelAddTask}
        title="Confirm Task Creation"
        icon={<PlusCircle size={24} />}
      >
        <div className="p-4">
          <p className="text-muted-foreground mb-4">
            Please confirm the details of the task. Once created, tasks cannot be deleted or edited.
          </p>
          {taskToConfirm && (
            <div className="space-y-2 mb-6">
              <p>
                <span className="font-medium">Title:</span> {taskToConfirm.title}
              </p>
              <p>
                <span className="font-medium">Description:</span> {taskToConfirm.description}
              </p>
              <p>
                <span className="font-medium">Reward:</span> {taskToConfirm.reward} ETH
              </p>
            </div>
          )}
          <div className="flex justify-end gap-4">
            <button
              onClick={cancelAddTask}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={confirmAddTask}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>

      <AlertBox
        isVisible={alert.isVisible}
        icon={alert.variant === "error" ? <XCircle size={20} /> : <CheckCircle size={20} />}
        title={alert.variant === "error" ? "Error" : "Success"}
        message={alert.message}
        onClose={() => setAlert({ isVisible: false, message: "", variant: "success" })}
        variant={alert.variant}
      />
    </Modal>
  )
}

// Re-use InfoItem and TaskCard from CampaignDetails
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
