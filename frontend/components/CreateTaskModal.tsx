
"use client"

import React, { useState } from "react"
import { Modal } from "./modal"
import { PlusCircle, AlertCircle } from "lucide-react"
import { validateRequired, validateNumber, validateMinLength } from "@/lib/validation"
import { Task } from "@/types/campaign"

interface TaskFormData {
  title: string
  description: string
  reward: string
}

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onAddTask: (task: Omit<Task, "id" | "isActive" | "completionCount">) => void
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, onAddTask }) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    reward: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isShaking, setIsShaking] = useState(false)

  const validateTaskForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    const titleError = validateRequired(formData.title, "Title")
    if (titleError) newErrors[titleError.field] = titleError.message

    const descError = validateMinLength(formData.description, "Description", 10)
    if (descError) newErrors[descError.field] = descError.message

    const rewardError = validateNumber(formData.reward, "Reward")
    if (rewardError) newErrors[rewardError.field] = rewardError.message

    setFormErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateTaskForm()) {
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
      return
    }

    onAddTask({
      title: formData.title,
      description: formData.description,
      reward: parseFloat(formData.reward),
      completed: false, // Initialize completed to false
    })
    setFormData({ title: "", description: "", reward: "" })
    setFormErrors({})
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Task" icon={<PlusCircle size={24} />}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={isShaking && formErrors.title ? 'shake' : ''}>
          <label className="text-sm font-semibold text-foreground block mb-2">Task Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Write a review"
            className={`w-full px-3 py-2 bg-card border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors ${
              formErrors.title ? "border-red-500" : "border-border focus:border-accent"
            }`}
          />
          {formErrors.title && (
            <div className="flex items-center gap-2 mt-1.5 text-red-400 text-sm">
              <AlertCircle size={14} />
              {formErrors.title}
            </div>
          )}
        </div>

        <div className={isShaking && formErrors.description ? 'shake' : ''}>
          <label className="text-sm font-semibold text-foreground block mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe the task in detail (min. 10 characters)"
            rows={3}
            className={`w-full px-3 py-2 bg-card border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors resize-none ${
              formErrors.description ? "border-red-500" : "border-border focus:border-accent"
            }`}
          />
          {formErrors.description && (
            <div className="flex items-center gap-2 mt-1.5 text-red-400 text-sm">
              <AlertCircle size={14} />
              {formErrors.description}
            </div>
          )}
        </div>

        <div className={isShaking && formErrors.reward ? 'shake' : ''}>
          <label className="text-sm font-semibold text-foreground block mb-2">Reward (ETH)</label>
          <input
            type="number"
            name="reward"
            value={formData.reward}
            onChange={handleInputChange}
            placeholder="e.g., 0.5"
            step="0.01"
            className={`w-full px-3 py-2 bg-card border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors ${
              formErrors.reward ? "border-red-500" : "border-border focus:border-accent"
            }`}
          />
          {formErrors.reward && (
            <div className="flex items-center gap-2 mt-1.5 text-red-400 text-xs">
              <AlertCircle size={12} />
              {formErrors.reward}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <PlusCircle size={18} />
          Add Task
        </button>
      </form>
    </Modal>
  )
}
