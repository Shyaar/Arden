export interface Task {
    id: number;
    title: string;
    description: string;
    reward: number;
    isActive: boolean;
    completionCount: number;
}

export interface Campaign {
    id: string;
    factory: string;
    campaignName: string;
    dappLink: string;
    totalBudget: number;
    remainingBudget: number;
    campaignEndTime: number; // Timestamp
    isActive: boolean;
    taskCounter: number;
    tasks: Task[];
}
