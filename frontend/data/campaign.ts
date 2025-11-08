import { Campaign } from "@/types/campaign"

export const campaigns: Campaign[] = [
  {
    id: "1",
    factory: "0x123abc...",
    campaignName: "Launch Analytics Dashboard",
    dappLink: "https://analytics.example.com",
    totalBudget: 1000,
    remainingBudget: 500,
    campaignEndTime: Math.floor(Date.now() / 1000) + 86400 * 7, // 7 days from now
    isActive: true,
    taskCounter: 3,
    tasks: [
      {
        id: 1,
        title: "Test Dashboard Features",
        description: "Explore all features and report any bugs.",
        reward: 100,
        isActive: true,
        completionCount: 50,
      },
      {
        id: 2,
        title: "Provide UI/UX Feedback",
        description: "Submit suggestions for improving the user interface.",
        reward: 150,
        isActive: true,
        completionCount: 30,
      },
      {
        id: 3,
        title: "Write a Short Review",
        description: "Publish a short review on your social media.",
        reward: 250,
        isActive: false,
        completionCount: 20,
      },
    ],
  },
  {
    id: "2",
    factory: "0x456def...",
    campaignName: "Beta Test Database Tool",
    dappLink: "https://database.example.com",
    totalBudget: 800,
    remainingBudget: 300,
    campaignEndTime: Math.floor(Date.now() / 1000) + 86400 * 14, // 14 days from now
    isActive: true,
    taskCounter: 4,
    tasks: [
      {
        id: 1,
        title: "Stress Test Database",
        description: "Run performance tests and report benchmarks.",
        reward: 200,
        isActive: true,
        completionCount: 10,
      },
      {
        id: 2,
        title: "Document Setup Process",
        description: "Create a step-by-step guide for tool setup.",
        reward: 100,
        isActive: true,
        completionCount: 5,
      },
    ],
  },
  {
    id: "3",
    factory: "0x789ghi...",
    campaignName: "Design System Review",
    dappLink: "https://design.example.com",
    totalBudget: 600,
    remainingBudget: 600,
    campaignEndTime: Math.floor(Date.now() / 1000) + 86400 * 3, // 3 days from now
    isActive: false,
    taskCounter: 2,
    tasks: [
      {
        id: 1,
        title: "Review Color Palette",
        description: "Evaluate the new color scheme for accessibility.",
        reward: 100,
        isActive: true,
        completionCount: 15,
      },
    ],
  },
  {
    id: "4",
    factory: "0xabcjkl...",
    campaignName: "API Integration Testing",
    dappLink: "https://api.example.com",
    totalBudget: 700,
    remainingBudget: 200,
    campaignEndTime: Math.floor(Date.now() / 1000) + 86400 * 10, // 10 days from now
    isActive: true,
    taskCounter: 5,
    tasks: [
      {
        id: 1,
        title: "Test User Authentication",
        description: "Verify all authentication endpoints.",
        reward: 150,
        isActive: true,
        completionCount: 25,
      },
      {
        id: 2,
        title: "Data Retrieval Tests",
        description: "Ensure data is correctly retrieved from the API.",
        reward: 100,
        isActive: true,
        completionCount: 20,
      },
    ],
  },
  {
    id: "5",
    factory: "0xdefmno...",
    campaignName: "Mobile App Feedback",
    dappLink: "https://mobile.example.com",
    totalBudget: 900,
    remainingBudget: 400,
    campaignEndTime: Math.floor(Date.now() / 1000) + 86400 * 5, // 5 days from now
    isActive: true,
    taskCounter: 3,
    tasks: [
      {
        id: 1,
        title: "Test iOS App on iPhone 15",
        description: "Install and test the app on the latest iPhone.",
        reward: 200,
        isActive: true,
        completionCount: 10,
      },
    ],
  },
  {
    id: "6",
    factory: "0xghipqr...",
    campaignName: "Component Library Testing",
    dappLink: "https://components.example.com",
    totalBudget: 550,
    remainingBudget: 150,
    campaignEndTime: Math.floor(Date.now() / 1000) + 86400 * 12, // 12 days from now
    isActive: true,
    taskCounter: 4,
    tasks: [
      {
        id: 1,
        title: "Review Button Components",
        description: "Check all button states and responsiveness.",
        reward: 75,
        isActive: true,
        completionCount: 30,
      },
    ],
  },
]
