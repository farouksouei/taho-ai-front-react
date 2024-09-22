export interface Spending {
    id: number;
    userid: number;
    count: number;
    type: string;
    model: string;
    created_at: string;
}

export interface NewSpending {
    userid: number;
    count: number;
    type: string;
    model: string;
}

