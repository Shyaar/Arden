
"use client"

import React from "react"
import Image from "next/image"
import { Modal } from "./modal"
import { User, CheckCircle, PlusCircle } from "lucide-react"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: {
    name?: string
    email?: string
    picture?: string
  }
  createdCampaigns: number
  joinedCampaigns: number
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  createdCampaigns,
  joinedCampaigns,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Profile" icon={<User size={24} />}>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          {user.picture && (
            <Image src={user.picture} alt="Profile" width={64} height={64} className="rounded-full" />
          )}
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="flex items-center space-x-2">
            <PlusCircle size={20} />
            <span>Created Campaigns:</span>
            <span className="font-bold">{createdCampaigns}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle size={20} />
            <span>Joined Campaigns:</span>
            <span className="font-bold">{joinedCampaigns}</span>
          </div>
        </div>
      </div>
    </Modal>
  )
}
