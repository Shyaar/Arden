"use client";

import { v4 as uuidv4 } from "uuid";

import { useState, useEffect, useMemo } from "react"; // Added useMemo
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AnimatedSection } from "@/components/animated-section";
import { CampaignCard } from "@/components/campaign-card";
import { Modal } from "@/components/modal";
import { AlertBox } from "@/components/alert-box";
import { campaigns } from "@/data/campaign";
import { FilterDropdown } from "@/components/filter-dropdown";
import { ProfileModal } from "@/components/ProfileModal";
import {
  Wrench,
  User,
  PlusCircle,
  BadgeCheck,
  Search,
  AlertCircle,
  LogOut,
  Globe,
} from "lucide-react";
import {
  validateRequired,
  validateNumber,
  validateUrl,
  validateFutureDatetime,
} from "@/lib/validation";
import { useLocalStorage } from "@/hooks/use-localStorage";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { slugify } from "@/lib/utils";
import { Campaign, Task } from "@/types/campaign";
import { OwnedCampaignDetailsModal } from "@/components/OwnedCampaignDetailsModal"; // New import
import { DiscoverCampaignDetailsModal } from "@/components/DiscoverCampaignDetailsModal"; // New import
import { useUsers } from "@/contract/hooks/useUsers";
import LoadingModal from "@/components/ui/modals/LoadingModal";
import { useRegisterUser } from "@/contract/hooks/useRegisterUsers";
import { toast } from "react-toastify";

interface CampaignFormData {
  campaignName: string;
  description: string; // New field
  dappLink: string;
  totalBudget: string;
  campaignEndTime: string;
  tasks: Task[];
}

export default function Dashboard() {
  const router = useRouter();
  const { userData, isLoading } = useUsers();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const { register, isPending, isConfirming, isConfirmed, error } =
    useRegisterUser();
  console.log("userDAta@@@@:::::", userData?.userAddress);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [userAddress, setUserAddress] = useState<string | null>(null);
  const { ready, authenticated, user, logout } = usePrivy();
  const [view, setView] = useState<"builder" | "user">("user");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [alert, setAlert] = useState({
    isVisible: false,
    message: "",
    variant: "success" as "success" | "error",
  });
  const [joinedCampaigns, setJoinedCampaigns] = useLocalStorage<string[]>(
    "joinedCampaigns",
    []
  );
  const [createdCampaigns, setCreatedCampaigns] = useLocalStorage<Campaign[]>(
    "createdCampaigns",
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [dataLoad, setDataLoad] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [formData, setFormData] = useState<CampaignFormData>({
    campaignName: "",
    description: "", // Initialize new field
    dappLink: "",
    totalBudget: "",
    campaignEndTime: "",
    tasks: [],
  });
  const [isOwnedCampaignModalOpen, setIsOwnedCampaignModalOpen] =
    useState(false); // New state
  const [selectedOwnedCampaign, setSelectedOwnedCampaign] =
    useState<Campaign | null>(null); // New state
  const [isDiscoverCampaignModalOpen, setIsDiscoverCampaignModalOpen] =
    useState(false); // New state
  const [selectedDiscoverCampaign, setSelectedDiscoverCampaign] =
    useState<Campaign | null>(null); // New state

  // Effect to disable body scroll when any modal is open
  useEffect(() => {
    const anyModalOpen =
      isCreateModalOpen ||
      isLogoutModalOpen ||
      isProfileModalOpen ||
      isOwnedCampaignModalOpen ||
      isDiscoverCampaignModalOpen;

    if (anyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup function to re-enable scroll when component unmounts or dependencies change
    return () => {
      document.body.style.overflow = "";
    };
  }, [
    isLoading,
    isCreateModalOpen,
    isLogoutModalOpen,
    isProfileModalOpen,
    isOwnedCampaignModalOpen,
    isDiscoverCampaignModalOpen,
  ]);

  useEffect(() => {
    if (!ready || !authenticated || !user) return;

    const interval = setInterval(() => {
      if (!user.linkedAccounts?.length) {
        console.log("⏳ Waiting for linked accounts...");
        return;
      }

      console.log("Linked555555555:::", user.linkedAccounts);

      const wallet =
        user.linkedAccounts.find((a) => a.type === "smart_wallet") ||
        user.linkedAccounts.find((a) => a.type === "wallet");

      const gAccount = user.linkedAccounts.find(
        (a) => a.type === "google_oauth"
      );

      if (gAccount?.name) {
        console.log("✅ Wallet found!");
        const [firstName, ...lastNameParts] = gAccount?.name.split(" ");
        const lastName = lastNameParts.join(" ");
        console.log("First Name ^^^^^^^^:", firstName);
        console.log("Last Name>>>>>>>>>>:", lastName);
        setFirstName(firstName);
        setLastName(lastName);
      }

      if (wallet?.address) {
        console.log("✅ Wallet found!");
        console.log("Address:", wallet.address, typeof wallet.address);
        setUserAddress(wallet.address);
        

        console.log("Type:", wallet.type);
        clearInterval(interval);
      } else {
        console.log("Waiting for wallet to link...");
      }
    }, 1000);
  }, [ready, authenticated, user]);

  useEffect(() => {
    const unregistered =
      userData?.userAddress === "0x0000000000000000000000000000000000000000";

    if (unregistered) {
      console.log("fake Account @@@@@@@@£££");
      registerUser();
    }else{
      console.log("welcomeBack")
    }
  }, [userData?.userAddress]);

     useEffect(() => {
 

     if (isLoading) {
       setShowModal(true);
       setModalMessage("Please wait... the sun is warming up!! 🌞");
     } else if (isPending || isConfirming) {
       setShowModal(true);
       setModalMessage("Please wait while we create your account...");
     } else if ( isConfirmed || error) {
       setShowModal(false);
     }
   }, [
     isLoading,
     isPending,
     isConfirming,
     isConfirmed,
    error
   ]);

  console.log("USer ADDRESS :::: ", userAddress);

  const userName = user?.google?.name || user?.github?.name || undefined;
  const userEmail = user?.google?.email || user?.github?.email || undefined;
  // const userPicture =
  //   (user?.google as any)?.picture ||
  //   (user?.github as any)?.avatarUrl ||
  //   undefined;

  async function registerUser() {
    try {
      await register(firstName, lastName, 0);
      toast.success("successfully registered");
    } catch (err) {
      console.log("Registration failed");
    } finally {
      setShowModal(false);
    }
  }

  const validateCreateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const campaignNameError = validateRequired(
      formData.campaignName,
      "Campaign Name"
    );

    if (campaignNameError)
      newErrors[campaignNameError.field] = campaignNameError.message;

    const descriptionError = validateRequired(
      formData.description,
      "Description"
    ); // Validate description
    if (descriptionError)
      newErrors[descriptionError.field] = descriptionError.message;

    const dappLinkError = validateUrl(formData.dappLink, "DApp Link");

    if (dappLinkError) newErrors[dappLinkError.field] = dappLinkError.message;

    const totalBudgetError = validateNumber(
      formData.totalBudget,
      "Total Budget"
    );

    if (totalBudgetError)
      newErrors[totalBudgetError.field] = totalBudgetError.message;

    const campaignEndTimeError = validateFutureDatetime(
      formData.campaignEndTime,
      "Campaign End Time"
    );

    if (campaignEndTimeError)
      newErrors[campaignEndTimeError.field] = campaignEndTimeError.message;

    setFormErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleCreateCampaign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateCreateForm()) {
      setAlert({
        isVisible: true,
        message: "Please fill out all fields correctly",
        variant: "error",
      });
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }
    setDataLoad(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setDataLoad(false);
    const newCampaignId = uuidv4(); // Generate ID first
    const newCampaign: Campaign = {
      id: newCampaignId,
      slug: "", // Initialize slug with an empty string or a temporary value
      factory: "0x0000000000000000000000000000000000000000", // Placeholder
      campaignName: formData.campaignName,
      description: formData.description, // Add description to new campaign
      owner: user?.id || "", // Initialize owner with user ID
      dappLink: formData.dappLink,
      totalBudget: parseFloat(formData.totalBudget),
      currentAmount: 0, // Initialize currentAmount
      targetAmount: parseFloat(formData.totalBudget), // Initialize targetAmount
      remainingBudget: parseFloat(formData.totalBudget),
      campaignEndTime: new Date(formData.campaignEndTime).getTime() / 1000,
      isActive: true,
      taskCounter: 0,
      backers: 0, // Initialize backers
      tasks: [],
    };
    newCampaign.slug = slugify(newCampaign.campaignName) + "-" + newCampaign.id; // Assign correct slug
    setCreatedCampaigns([...createdCampaigns, newCampaign]);
    setIsCreateModalOpen(false);
    setFormData({
      campaignName: "",
      description: "", // Clear description field
      dappLink: "",
      totalBudget: "",
      campaignEndTime: "",
      tasks: [],
    });
    setFormErrors({});
    setAlert({
      isVisible: true,
      message: "Campaign created successfully!",
      variant: "success",
    });
    setTimeout(
      () => setAlert({ isVisible: false, message: "", variant: "success" }),
      5000
    );
  };

  const handleJoinCampaign = (e: React.MouseEvent, campaignId: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (!joinedCampaigns.includes(campaignId)) {
      setJoinedCampaigns([...joinedCampaigns, campaignId]);
      setAlert({
        isVisible: true,
        message: "Welcome! Check your email for next steps.",
        variant: "success",
      });
      setTimeout(
        () => setAlert({ isVisible: false, message: "", variant: "success" }),
        5000
      );
    }
  };

  const handleLeaveCampaign = (e: React.MouseEvent, campaignId: string) => {
    e.stopPropagation();
    e.preventDefault();
    setJoinedCampaigns(joinedCampaigns.filter((id) => id !== campaignId));
    setAlert({
      isVisible: true,
      message: "You have left the campaign.",
      variant: "success",
    });
    setTimeout(
      () => setAlert({ isVisible: false, message: "", variant: "success" }),
      5000
    );
  };

  const handleLogout = async () => {
    setIsLogoutModalOpen(false);
    await logout();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const allAvailableCampaigns = useMemo(() => {
    const combined = [...campaigns, ...createdCampaigns];
    const uniqueCampaigns = Array.from(
      new Set(combined.map((item) => item.id))
    ).map((id) => combined.find((item) => item.id === id));
    return uniqueCampaigns.filter(Boolean) as Campaign[]; // Filter out any undefined if find fails
  }, [createdCampaigns]);

  const filteredCampaigns = allAvailableCampaigns
    .filter((c) => {
      if (filter === "All") return true;
      if (filter === "Joined") return joinedCampaigns.includes(c.id);
      if (filter === "Unjoined") return !joinedCampaigns.includes(c.id);
      return true;
    })
    .filter(
      (c) =>
        c.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.tasks[0]?.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (!ready || !authenticated) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen max-w-7xl mx-auto px-6 py-12 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full  animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleUpdateSelectedOwnedCampaign = (updatedCampaign: Campaign) => {
    setSelectedOwnedCampaign(updatedCampaign);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen max-w-7xl mx-auto px-6 py-12 overflow-y-auto custom-scrollbar">
        <AnimatedSection className="mb-12 p-6 bg-card border border-border ">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {userName} 👋
              </h1>
              <p className="text-muted-foreground">
                {view === "user"
                  ? "Discover new campaigns and earn rewards"
                  : "Manage your active campaigns"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary  hover:bg-primary/20 transition-colors font-semibold self-start md:self-auto"
              >
                <User size={18} />
                Profile
              </button>
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive  hover:bg-destructive/20 transition-colors font-semibold self-start md:self-auto"
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
              className={`flex items-center gap-2 px-4 py-3  font-semibold transition-colors ${
                view === "user"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User size={20} />
              Discover Campaigns
            </button>
            <button
              onClick={() => setView("builder")}
              className={`flex items-center gap-2 px-4 py-3  font-semibold transition-colors ${
                view === "builder"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
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
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-card border border-border  text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
                />
              </div>
              <FilterDropdown onFilterChange={setFilter} />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign, idx) => (
                <AnimatedSection key={campaign.id} delay={idx * 0.02}>
                  <CampaignCard
                    id={campaign.id}
                    slug={
                      campaign.slug ||
                      slugify(campaign.campaignName) + "-" + campaign.id
                    }
                    onClick={() => {
                      setSelectedDiscoverCampaign(campaign);
                      setIsDiscoverCampaignModalOpen(true);
                    }}
                    title={campaign.campaignName}
                    description={
                      campaign.description || "No description available."
                    }
                    icon={<Globe size={24} />}
                    participants={campaign.taskCounter}
                    reward={campaign.totalBudget.toString()}
                    taskCount={campaign.taskCounter} // Pass taskCount
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
                <p className="text-muted-foreground">
                  Manage your active campaigns and track engagement
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground  hover:opacity-90 transition-opacity font-semibold self-start md:self-auto"
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
                      slug={campaign.slug}
                      onClick={() => {
                        // Modified onClick
                        setSelectedOwnedCampaign(campaign);
                        setIsOwnedCampaignModalOpen(true);
                      }}
                      title={campaign.campaignName}
                      description={campaign.description || campaign.dappLink}
                      icon={<Wrench size={24} />}
                      participants={campaign.taskCounter}
                      reward={(campaign.totalBudget ?? 0).toString()}
                      taskCount={campaign.taskCounter} // Pass taskCount
                      isBuilder={true}
                      onJoin={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                      onLeave={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                    />
                  </AnimatedSection>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-border ">
                <p className="text-muted-foreground mb-2">
                  You haven&apos;t created any campaigns yet.
                </p>
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
            <div
              className={isShaking && formErrors.campaignName ? "shake" : ""}
            >
              <label className="text-sm font-semibold text-foreground block mb-2">
                Campaign Name
              </label>
              <input
                type="text"
                name="campaignName"
                value={formData.campaignName}
                onChange={handleInputChange}
                placeholder="Enter campaign name"
                className={`w-full px-3 py-2 bg-card border  text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors ${
                  formErrors.campaignName
                    ? "border-red-500"
                    : "border-border focus:border-accent"
                }`}
              />
              {formErrors.campaignName && (
                <div className="flex items-center gap-2 mt-1.5 text-red-400 text-sm">
                  <AlertCircle size={14} />
                  {formErrors.campaignName}
                </div>
              )}
            </div>

            <div className={isShaking && formErrors.description ? "shake" : ""}>
              <label className="text-sm font-semibold text-foreground block mb-2">
                Campaign Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your campaign in detail"
                rows={3}
                className={`w-full px-3 py-2 bg-card border  text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors resize-none ${
                  formErrors.description
                    ? "border-red-500"
                    : "border-border focus:border-accent"
                }`}
              />
              {formErrors.description && (
                <div className="flex items-center gap-2 mt-1.5 text-red-400 text-sm">
                  <AlertCircle size={14} />
                  {formErrors.description}
                </div>
              )}
            </div>

            <div className={isShaking && formErrors.dappLink ? "shake" : ""}>
              <label className="text-sm font-semibold text-foreground block mb-2">
                DApp Link
              </label>
              <input
                type="url"
                name="dappLink"
                value={formData.dappLink}
                onChange={handleInputChange}
                placeholder="e.g., https://example.com"
                className={`w-full px-3 py-2 bg-card border  text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors ${
                  formErrors.dappLink
                    ? "border-red-500"
                    : "border-border focus:border-accent"
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
              <div
                className={isShaking && formErrors.totalBudget ? "shake" : ""}
              >
                <label className="text-sm font-semibold text-foreground block mb-2">
                  Total Budget (ETH)
                </label>
                <input
                  type="number"
                  name="totalBudget"
                  value={formData.totalBudget}
                  onChange={handleInputChange}
                  placeholder="e.g., 100"
                  step="0.01"
                  className={`w-full px-3 py-2 bg-card border  text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors ${
                    formErrors.totalBudget
                      ? "border-red-500"
                      : "border-border focus:border-accent"
                  }`}
                />
                {formErrors.totalBudget && (
                  <div className="flex items-center gap-2 mt-1.5 text-red-400 text-xs">
                    <AlertCircle size={12} />
                    {formErrors.totalBudget}
                  </div>
                )}
              </div>
              <div
                className={
                  isShaking && formErrors.campaignEndTime ? "shake" : ""
                }
              >
                <label className="text-sm font-semibold text-foreground block mb-2">
                  Campaign End Time
                </label>
                <input
                  type="datetime-local"
                  name="campaignEndTime"
                  value={formData.campaignEndTime}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-card border  text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors ${
                    formErrors.campaignEndTime
                      ? "border-red-500"
                      : "border-border focus:border-accent"
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

            <button
              type="submit"
              disabled={dataLoad}
              className="w-full py-2.5 bg-accent text-accent-foreground  font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {dataLoad ? (
                <>
                  <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground  animate-spin" />
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
            <p className="text-muted-foreground mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 bg-secondary text-secondary-foreground  hover:opacity-90 transition-opacity font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-destructive text-destructive-foreground  hover:opacity-90 transition-opacity font-semibold"
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
            // picture: userPicture,
          }}
          address={userAddress}
          createdCampaigns={createdCampaigns.length}
          joinedCampaigns={joinedCampaigns.length}
        />

        <OwnedCampaignDetailsModal // New modal
          isOpen={isOwnedCampaignModalOpen}
          onClose={() => setIsOwnedCampaignModalOpen(false)}
          campaign={selectedOwnedCampaign}
          onUpdateCampaign={handleUpdateSelectedOwnedCampaign}
        />

        <AlertBox
          isVisible={alert.isVisible}
          icon={
            alert.variant === "error" ? (
              <AlertCircle size={20} />
            ) : (
              <BadgeCheck size={20} />
            )
          }
          title={alert.variant === "error" ? "Error" : "Success"}
          message={alert.message}
          onClose={() =>
            setAlert({ isVisible: false, message: "", variant: "success" })
          }
          variant={alert.variant}
        />
        <DiscoverCampaignDetailsModal
          isOpen={isDiscoverCampaignModalOpen}
          onClose={() => setIsDiscoverCampaignModalOpen(false)}
          campaign={selectedDiscoverCampaign}
        />

        <LoadingModal show={showModal} message={modalMessage} />
      </main>
      <Footer />
    </>
  );
}
