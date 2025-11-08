"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AnimatedSection } from "@/components/animated-section"
import { CampaignCard } from "@/components/campaign-card"
import { Modal } from "@/components/modal"
import { AlertBox } from "@/components/alert-box"
import { campaigns } from "@/data/campaign"
import { FilterDropdown } from "@/components/filter-dropdown"
import { ProfileModal } from "@/components/ProfileModal"
import { CreateTaskModal } from "@/components/CreateTaskModal"
import { Wrench, User, PlusCircle, BadgeCheck, Search, AlertCircle, LogOut} from "lucide-react"
import { validateRequired, validateNumber } from "@/lib/validation"
import { useLocalStorage } from "@/hooks/use-localStorage"
import { useRouter } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"
import { Campaign, Task } from "@/types/campaign"

interface CampaignFormData {
  campaignName: string
  dappLink: string
  totalBudget: string
  campaignEndTime: string
  tasks: Task[]
}

export default function Dashboard() {
  const router = useRouter()
  const { ready, authenticated, user, logout } = usePrivy()
  const [view, setView] = useState<"builder" | "user">("user")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false)
  const [alert, setAlert] = useState({ isVisible: false, message: "", variant: "success" as "success" | "error" })
  const [joinedCampaigns, setJoinedCampaigns] = useLocalStorage<string[]>("joinedCampaigns", [])
  const [createdCampaigns, setCreatedCampaigns] = useLocalStorage<Campaign[]>("createdCampaigns", [])
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("All")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [formData, setFormData] = useState<CampaignFormData>({
    campaignName: "",
    dappLink: "",
    totalBudget: "",
    campaignEndTime: "",
    tasks: [],
  })

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/register")
    }
  }, [ready, authenticated, router])

  const userName = user?.google?.name || user?.github?.name
  const userEmail = user?.google?.email || user?.github?.email
  const userPicture = user?.google?.picture || user?.github?.avatarUrl

    const validateCreateForm = (): boolean => {

      const newErrors: Record<string, string> = {}

  

      const campaignNameError = validateRequired(formData.campaignName, "Campaign Name")

      if (campaignNameError) newErrors[campaignNameError.field] = campaignNameError.message

  

      const dappLinkError = validateRequired(formData.dappLink, "DApp Link")

      if (dappLinkError) newErrors[dappLinkError.field] = dappLinkError.message

  

      const totalBudgetError = validateNumber(formData.totalBudget, "Total Budget")

      if (totalBudgetError) newErrors[totalBudgetError.field] = totalBudgetError.message

  

      const campaignEndTimeError = validateRequired(formData.campaignEndTime, "Campaign End Time")

      if (campaignEndTimeError) newErrors[campaignEndTimeError.field] = campaignEndTimeError.message

  

      setFormErrors(newErrors)

      return Object.keys(newErrors).length === 0

    }

  const handleCreateCampaign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateCreateForm()) {
      setAlert({
        isVisible: true,
        message: "Please fill out all fields correctly",
        variant: "error",
      })
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
      return
    }
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsLoading(false)
    const newCampaign: Campaign = {
      id: (createdCampaigns.length + 1).toString(),
      factory: "0x0000000000000000000000000000000000000000", // Placeholder
      campaignName: formData.campaignName,
      dappLink: formData.dappLink,
      totalBudget: parseFloat(formData.totalBudget),
      remainingBudget: parseFloat(formData.totalBudget),
      campaignEndTime: new Date(formData.campaignEndTime).getTime() / 1000,
      isActive: true,
      taskCounter: 0,
      tasks: [],
    }
    setCreatedCampaigns([...createdCampaigns, newCampaign])
    setIsCreateModalOpen(false)
    setFormData({
      campaignName: "",
      dappLink: "",
      totalBudget: "",
      campaignEndTime: "",
      tasks: [],
    })
    setFormErrors({})
    setAlert({
      isVisible: true,
      message: "Campaign created successfully!",
      variant: "success",
    })
    setTimeout(() => setAlert({ isVisible: false, message: "", variant: "success" }), 5000)
  }

  const handleJoinCampaign = (e: React.MouseEvent, campaignId: string) => {
    e.stopPropagation()
    e.preventDefault()
    if (!joinedCampaigns.includes(campaignId)) {
      setJoinedCampaigns([...joinedCampaigns, campaignId])
      setAlert({
        isVisible: true,
        message: "Welcome! Check your email for next steps.",
        variant: "success",
      })
      setTimeout(() => setAlert({ isVisible: false, message: "", variant: "success" }), 5000)
    }
  }

  const handleLeaveCampaign = (e: React.MouseEvent, campaignId: string) => {
    e.stopPropagation()
    e.preventDefault()
    setJoinedCampaigns(joinedCampaigns.filter((id) => id !== campaignId))
    setAlert({
      isVisible: true,
      message: "You have left the campaign.",
      variant: "success",
    })
    setTimeout(() => setAlert({ isVisible: false, message: "", variant: "success" }), 5000)
  }

  const handleAddTask = (newTask: Task) => {
    setFormData((prev) => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }))
    setIsCreateTaskModalOpen(false)
  }

  const handleLogout = async () => {
    setIsLogoutModalOpen(false)
    await logout()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const filteredCampaigns = campaigns
    .filter((c) => {
      if (filter === "All") return true
      if (filter === "Builder") return createdCampaigns.some((cc) => cc.id === c.id)
      if (filter === "User") return joinedCampaigns.includes(c.id)
      if (filter === "Joined") return joinedCampaigns.includes(c.id)
      if (filter === "Unjoined") return !joinedCampaigns.includes(c.id)
      return true
    })
    .filter(
      (c) =>
        c.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.tasks[0]?.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

  if (!ready || !authenticated) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen max-w-7xl mx-auto px-6 py-12 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen max-w-7xl mx-auto px-6 py-12">
        <AnimatedSection className="mb-12 p-6 bg-card border border-border rounded-lg">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {userName} 👋</h1>
              <p className="text-muted-foreground">
                {view === "user" ? "Discover new campaigns and earn rewards" : "Manage your active campaigns"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-semibold self-start md:self-auto"
              >
                <User size={18} />
                Profile
              </button>
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors font-semibold self-start md:self-auto"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="mb-12">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8">
            <button
              onClick={() => setView("user")}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
                view === "user" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User size={20} />
              Discover Campaigns
            </button>
            <button
              onClick={() => setView("builder")}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
                view === "builder" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Wrench size={20} />
              My Campaigns
            </button>
          </div>
        </AnimatedSection>

        {view === "user" && (
          <AnimatedSection>
            <div className="mb-8 flex items-center gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
                />
              </div>
              <FilterDropdown onFilterChange={setFilter} />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign, idx) => (
                <AnimatedSection key={campaign.id} delay={idx * 0.02}>
                  <CampaignCard
                    id={campaign.id}
                    title={campaign.campaignName}
                    description={campaign.tasks[0]?.description || "No description available."}
                    icon={<Wrench size={24} />}
                    participants={campaign.taskCounter}
                    reward={campaign.totalBudget.toString()}
                    isJoined={joinedCampaigns.includes(campaign.id)}
                    onJoin={(e) => handleJoinCampaign(e, campaign.id)}
                    onLeave={(e) => handleLeaveCampaign(e, campaign.id)}
                  />
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
        )}

        {view === "builder" && (
          <AnimatedSection>
            <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">My Campaigns</h2>
                <p className="text-muted-foreground">Manage your active campaigns and track engagement</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold self-start md:self-auto"
              >
                <PlusCircle size={20} />
                New Campaign
              </button>
            </div>

            {createdCampaigns.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {createdCampaigns.map((campaign) => (
                  <AnimatedSection key={campaign.id} delay={0}>
                    <CampaignCard
                      id={campaign.id}
                      title={campaign.title}
                      description={campaign.description}
                      icon={<Wrench size={24} />}
                      participants={0}
                      reward={campaign.reward}
                      isBuilder={true}
                      onJoin={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                      }}
                      onLeave={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                      }}
                    />
                  </AnimatedSection>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                <p className="text-muted-foreground mb-2">You haven&apos;t created any campaigns yet.</p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
                >
                  <PlusCircle size={18} />
                  Create your first campaign
                </button>
              </div>
            )}
          </AnimatedSection>
        )}

        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create Campaign"
          icon={<PlusCircle size={24} />}
        >
          <form onSubmit={handleCreateCampaign} className="space-y-4">
            <div className={isShaking && formErrors.campaignName ? 'shake' : ''}>
              <label className="text-sm font-semibold text-foreground block mb-2">Campaign Name</label>
              <input
                type="text"
                name="campaignName"
                value={formData.campaignName}
                onChange={handleInputChange}
                placeholder="Enter campaign name"
                className={`w-full px-3 py-2 bg-card border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors ${
                  formErrors.campaignName ? "border-red-500" : "border-border focus:border-accent"
                }`}
              />
              {formErrors.campaignName && (
                <div className="flex items-center gap-2 mt-1.5 text-red-400 text-sm">
                  <AlertCircle size={14} />
                  {formErrors.campaignName}
                </div>
              )}
            </div>

            <div className={isShaking && formErrors.dappLink ? 'shake' : ''}>
              <label className="text-sm font-semibold text-foreground block mb-2">DApp Link</label>
              <input
                type="url"
                name="dappLink"
                value={formData.dappLink}
                onChange={handleInputChange}
                placeholder="e.g., https://example.com"
                className={`w-full px-3 py-2 bg-card border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors ${
                  formErrors.dappLink ? "border-red-500" : "border-border focus:border-accent"
                }`}
              />
              {formErrors.dappLink && (
                <div className="flex items-center gap-2 mt-1.5 text-red-400 text-sm">
                  <AlertCircle size={14} />
                  {formErrors.dappLink}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={isShaking && formErrors.totalBudget ? 'shake' : ''}>
                <label className="text-sm font-semibold text-foreground block mb-2">Total Budget (ETH)</label>
                <input
                  type="number"
                  name="totalBudget"
                  value={formData.totalBudget}
                  onChange={handleInputChange}
                  placeholder="e.g., 100"
                  step="0.01"
                  className={`w-full px-3 py-2 bg-card border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors ${
                    formErrors.totalBudget ? "border-red-500" : "border-border focus:border-accent"
                  }`}
                />
                {formErrors.totalBudget && (
                  <div className="flex items-center gap-2 mt-1.5 text-red-400 text-xs">
                    <AlertCircle size={12} />
                    {formErrors.totalBudget}
                  </div>
                )}
              </div>
              <div className={isShaking && formErrors.campaignEndTime ? 'shake' : ''}>
                <label className="text-sm font-semibold text-foreground block mb-2">Campaign End Time</label>
                <input
                  type="datetime-local"
                  name="campaignEndTime"
                  value={formData.campaignEndTime}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-card border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors ${
                    formErrors.campaignEndTime ? "border-red-500" : "border-border focus:border-accent"
                  }`}
                />
                {formErrors.campaignEndTime && (
                  <div className="flex items-center gap-2 mt-1.5 text-red-400 text-xs">
                    <AlertCircle size={12} />
                    {formErrors.campaignEndTime}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Tasks</h3>
              {formData.tasks.length === 0 ? (
                <p className="text-muted-foreground text-sm">No tasks added yet.</p>
              ) : (
                <ul className="space-y-2">
                  {formData.tasks.map((task, index) => (
                    <li key={index} className="flex justify-between items-center bg-background border border-border rounded-lg p-3">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      </div>
                      <span className="text-sm font-bold">{task.reward} ETH</span>
                    </li>
                  ))}
                </ul>
              )}
              <button
                type="button"
                onClick={() => setIsCreateTaskModalOpen(true)}
                className="w-full py-2.5 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <PlusCircle size={18} />
                Add Task
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <PlusCircle size={18} />
                  Create Campaign
                </>
              )}
            </button>
          </form>
        </Modal>

        <Modal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          title="Confirm Logout"
          icon={<LogOut size={24} />}
        >
          <div>
            <p className="text-muted-foreground mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </Modal>

        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={{
            name: userName,
            email: userEmail,
            picture: userPicture,
          }}
          createdCampaigns={createdCampaigns.length}
          joinedCampaigns={joinedCampaigns.length}
        />

        <AlertBox
          isVisible={alert.isVisible}
          icon={alert.variant === "error" ? <AlertCircle size={20} /> : <BadgeCheck size={20} />}
          title={alert.variant === "error" ? "Error" : "Success"}
          message={alert.message}
          onClose={() => setAlert({ isVisible: false, message: "", variant: "success" })}
          variant={alert.variant}
        />
        <CreateTaskModal
          isOpen={isCreateTaskModalOpen}
          onClose={() => setIsCreateTaskModalOpen(false)}
          onAddTask={handleAddTask}
        />
      </main>
      <Footer />
    </>
  )
}
