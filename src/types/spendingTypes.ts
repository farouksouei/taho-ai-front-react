// Define the Spending interface
export interface Spending {
    id: number;
    userid: number;
    count: number;
    type: string;
    model: string;
    createdat: string; // Adjusted for consistency
}

// Define the filter structure
export interface SpendingFilters {
    userid?: number;
    startdate?: string;
    enddate?: string;
    type?: string;
    model?: string;
}

// Define the initial state
export interface SpendingsState {
    spendings: Spending[];
    loading: boolean;
    error: string | null;
    filters: SpendingFilters;
    currentPage: number;  // Current page number
    totalPages: number;    // Total number of pages
}

export const initialState: SpendingsState = {
    spendings: [],
    loading: false,
    error: null,
    filters: {},
    currentPage: 1,
    totalPages: 1,
};
