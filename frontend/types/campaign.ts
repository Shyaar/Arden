export interface Task {
    id: number;
    title: string;
    description: string;
    reward: number;
    isActive: boolean;
    completionCount: number;
    completed: boolean; // New property
}

export interface Campaign {
    id: string;
    slug: string;
    factory: string;
    campaignName: string;
    description: string; // New property
    owner: string; // New property
    dappLink: string;
    totalBudget: number;
    currentAmount: number; // New property
    targetAmount: number; // New property
    remainingBudget: number;
    campaignEndTime: number; // Timestamp
    isActive: boolean;
    taskCounter: number;
    backers: number; // New property
    tasks: Task[];
}
