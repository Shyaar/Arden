"use client"

import { campaigns } from "@/data/campaign"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CampaignDetails } from "@/components/campaign-details"
import { useLocalStorage } from "@/hooks/use-localStorage"
import { Campaign as CampaignType } from "@/types/campaign"

import { useParams } from "next/navigation"

const CampaignDetailsPage = () => {
  const params = useParams()
  const slug_id = params.slug_id as string
  console.log("CampaignDetailsPage - slug_id:", slug_id)
  const [createdCampaigns] = useLocalStorage<CampaignType[]>("createdCampaigns", [])

  if (!slug_id) {
    notFound()
  }
  const id = slug_id
  console.log("CampaignDetailsPage - extracted id:", id)

  const allCampaigns = [...campaigns, ...createdCampaigns]
  console.log("CampaignDetailsPage - allCampaigns:", allCampaigns)
  const campaign = allCampaigns.find((c) => c.id === id)
  console.log("CampaignDetailsPage - found campaign:", campaign)

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
