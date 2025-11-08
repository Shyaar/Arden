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
import { Wrench, User, PlusCircle, BadgeCheck, Search, AlertCircle, LogOut } from "lucide-react"
import { validateRequired, validateNumber, validateMinLength } from "@/lib/validation"
import { useLocalStorage } from "@/hooks/use-localStorage"
import { useRouter } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"

interface CampaignData {
  title: string
  description: string
  reward: string
  maxParticipants: string
}

export default function Dashboard() {
  const router = useRouter()
  const { ready, authenticated, user, logout } = usePrivy()
  const [view, setView] = useState<"builder" | "user">("user")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [alert, setAlert] = useState({ isVisible: false, message: "", variant: "success" as "success" | "error" })
  const [joinedCampaigns, setJoinedCampaigns] = useLocalStorage<string[]>("joinedCampaigns", [])
  const [createdCampaigns, setCreatedCampaigns] = useLocalStorage<CampaignData[]>("createdCampaigns", [])
  const [searchTerm, setSearchTerm] = useState("")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [formData, setFormData] = useState<CampaignData>({
    title: "",
    description: "",
    reward: "",
    maxParticipants: "",
  })

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/register")
    }
  }, [ready, authenticated, router])

  const userName = user?.google?.name || user?.github?.name

  const validateCreateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    const titleError = validateRequired(formData.title, "title")
    if (titleError) newErrors[titleError.field] = titleError.message

    const descError = validateMinLength(formData.description, "description", 10)
    if (descError) newErrors[descError.field] = descError.message

    const rewardError = validateNumber(formData.reward, "reward")
    if (rewardError) newErrors[rewardError.field] = rewardError.message

    const maxError = validateNumber(formData.maxParticipants, "maxParticipants")
    if (maxError) newErrors[maxError.field] = maxError.message

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

    setCreatedCampaigns([...createdCampaigns, formData])
    setIsCreateModalOpen(false)
    setFormData({ title: "", description: "", reward: "", maxParticipants: "" })
    setFormErrors({})

    setAlert({
      isVisible: true,
      message: "Campaign created successfully!",
      variant: "success",
    })
    setTimeout(() => setAlert({ isVisible: false, message: "", variant: "success" }), 5000)
  }

  const handleJoinCampaign = (campaignId: string) => {
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

  const filteredCampaigns = campaigns.filter(
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
        {/* Welcome Section */}
        <AnimatedSection className="mb-12 p-6 bg-card border border-border rounded-lg">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {userName} 👋</h1>
              <p className="text-muted-foreground">
                {view === "user" ? "Discover new campaigns and earn rewards" : "Manage your active campaigns"}
              </p>
            </div>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors font-semibold self-start md:self-auto"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </AnimatedSection>

        {/* Tabs */}
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

        {/* User View */}
        {view === "user" && (
          <AnimatedSection>
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign, idx) => (
                <AnimatedSection key={campaign.id} delay={idx * 0.05}>
                  <CampaignCard
                    id={campaign.id}
                    title={campaign.campaignName}
                    description={campaign.tasks[0]?.description || "No description available."}
                    icon={<Wrench size={24} />} // Placeholder icon
                    participants={campaign.taskCounter} // Using taskCounter as a placeholder for participants
                    reward={campaign.totalBudget.toString()} // Using totalBudget as a placeholder for reward
                    isJoined={joinedCampaigns.includes(campaign.id)}
                    onAction={() => handleJoinCampaign(campaign.id)}
                  />
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
        )}

        {/* Builder View */}
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

            {createdCampaigns.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Your Created Campaigns</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {createdCampaigns.map((campaign, idx) => (
                    <AnimatedSection key={idx} delay={idx * 0.05}>
                      <div className="bg-card border border-accent/30 rounded-lg p-6">
                        <h4 className="font-semibold mb-2 text-foreground">{campaign.title}</h4>
                        <p className="text-sm text-muted-foreground mb-4">{campaign.description}</p>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-accent">{campaign.reward}</span>
                          <span className="text-muted-foreground">Max: {campaign.maxParticipants}</span>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign, idx) => (
                <AnimatedSection key={campaign.id} delay={idx * 0.05}>
                  <CampaignCard
                    id={campaign.id}
                    title={campaign.campaignName}
                    description={campaign.tasks[0]?.description || "No description available."}
                    icon={<Wrench size={24} />} // Placeholder icon
                    participants={campaign.taskCounter} // Using taskCounter as a placeholder for participants
                    reward={campaign.totalBudget.toString()} // Using totalBudget as a placeholder for reward
                    onAction={() => {}}
                    isBuilder={true}
                  />
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
        )}

        {/* Create Campaign Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create Campaign"
          icon={<PlusCircle size={24} />}
        >
          <form onSubmit={handleCreateCampaign} className="space-y-4">
            <div className={isShaking && formErrors.title ? 'shake' : ''}>
              <label className="text-sm font-semibold text-foreground block mb-2">Campaign Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter campaign title"
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
                placeholder="What do you want users to do? (min. 10 characters)"
                required
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

            <div className="grid grid-cols-2 gap-4">
              <div className={isShaking && formErrors.reward ? 'shake' : ''}>
                <label className="text-sm font-semibold text-foreground block mb-2">Reward Amount</label>
                <input
                  type="text"
                  name="reward"
                  value={formData.reward}
                  onChange={handleInputChange}
                  placeholder="e.g., 500"
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
              <div className={isShaking && formErrors.maxParticipants ? 'shake' : ''}>
                <label className="text-sm font-semibold text-foreground block mb-2">Max Participants</label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  placeholder="100"
                  className={`w-full px-3 py-2 bg-card border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors ${
                    formErrors.maxParticipants ? "border-red-500" : "border-border focus:border-accent"
                  }`}
                />
                {formErrors.maxParticipants && (
                  <div className="flex items-center gap-2 mt-1.5 text-red-400 text-xs">
                    <AlertCircle size={12} />
                    {formErrors.maxParticipants}
                  </div>
                )}
              </div>
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

        {/* Logout Confirmation Modal */}
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

        {/* Alert Box */}
        <AlertBox
          isVisible={alert.isVisible}
          icon={alert.variant === "error" ? <AlertCircle size={20} /> : <BadgeCheck size={20} />}
          title={alert.variant === "error" ? "Error" : "Success"}
          message={alert.message}
          onClose={() => setAlert({ isVisible: false, message: "", variant: "success" })}
          variant={alert.variant}
        />
      </main>
      <Footer />
    </>
  )
}
