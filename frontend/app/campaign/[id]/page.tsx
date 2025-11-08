import { campaigns } from "@/data/campaign"
import { Campaign } from "@/types/campaign"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CampaignDetails } from "@/components/campaign-details"

interface CampaignDetailsPageProps {
  params: Promise<{ id: string }>
}

const CampaignDetailsPage = async ({ params }: CampaignDetailsPageProps) => {
  const { id } = await params
  const campaign = campaigns.find((c) => c.id === id)

  if (!campaign) notFound()

  return (
    <>
      <Navbar />
      <CampaignDetails campaign={campaign} />
      <Footer />
    </>
  )
}

export default CampaignDetailsPage
