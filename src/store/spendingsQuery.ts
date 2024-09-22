import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Spending, SpendingFilters ,initialState } from '../types/spendingTypes';



// Async Thunk to fetch spendings with pagination and filters
export const fetchSpendings = createAsyncThunk(
    'spendings/fetchSpendings',
    async ({ filters, page }: { filters: SpendingFilters; page: number }) => {
        const params = new URLSearchParams(
            Object.entries(filters).reduce((acc, [key, value]) => {
                if (value !== undefined) acc[key] = String(value);
                return acc;
            }, {} as Record<string, string>)
        ).toString();

        const response = await axios.get(`http://localhost:5000/api/v1/spendings?${params}&page=${page}`);
        return response.data; // Ensure this includes total pages info
    }
);

// Async Thunk to fetch a spending by ID
export const fetchSpendingById = createAsyncThunk(
    'spendings/fetchSpendingById',
    async (id: number) => {
        const response = await axios.get(`http://localhost:5000/api/v1/spendings/${id}`);
        return response.data;
    }
);

// Async Thunk to add a new spending
export const addSpending = createAsyncThunk(
    'spendings/addSpending',
    async (newSpending: Omit<Spending, 'id' | 'createdat'>) => {
        const response = await axios.post('http://localhost:5000/api/v1/spendings', newSpending);
        return response.data;
    }
);

// Async Thunk to update a spending
export const updateSpending = createAsyncThunk(
    'spendings/updateSpending',
    async ({ id, data }: { id: number; data: Partial<Spending> }) => {
        const response = await axios.put(`http://localhost:5000/api/v1/spendings/${id}`, data);
        return response.data;
    }
);

// Async Thunk to delete a spending
export const deleteSpending = createAsyncThunk(
    'spendings/deleteSpending',
    async (id: number) => {
        await axios.delete(`http://localhost:5000/api/v1/spendings/${id}`);
        return id;
    }
);

// Slice
const spendingsSlice = createSlice({
    name: 'spendings',
    initialState,
    reducers: {
        setFilter: (state, action: PayloadAction<Partial<SpendingFilters>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle fetching spendings
            .addCase(fetchSpendings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSpendings.fulfilled, (state, action: PayloadAction<{ data: Spending[]; totalPages: number }>) => {
                state.spendings = action.payload.data;
                state.totalPages = action.payload.totalPages; // Update total pages
                state.loading = false;
            })
            .addCase(fetchSpendings.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to fetch spendings';
                state.loading = false;
            })
            // Handle fetching spending by ID
            .addCase(fetchSpendingById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSpendingById.fulfilled, (state, action: PayloadAction<Spending>) => {
                const index = state.spendings.findIndex(spending => spending.id === action.payload.id);
                if (index !== -1) {
                    state.spendings[index] = action.payload;
                } else {
                    state.spendings.push(action.payload);
                }
                state.loading = false;
            })
            .addCase(fetchSpendingById.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to fetch spending by ID';
                state.loading = false;
            })
            // Handle adding a new spending
            .addCase(addSpending.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addSpending.fulfilled, (state, action: PayloadAction<Spending>) => {
                state.spendings.push(action.payload);
                state.loading = false;
            })
            .addCase(addSpending.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to add spending';
                state.loading = false;
            })
            // Handle updating a spending
            .addCase(updateSpending.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSpending.fulfilled, (state, action: PayloadAction<Spending>) => {
                const index = state.spendings.findIndex(spending => spending.id === action.payload.id);
                if (index !== -1) {
                    state.spendings[index] = action.payload;
                }
                state.loading = false;
            })
            .addCase(updateSpending.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to update spending';
                state.loading = false;
            })
            // Handle deleting a spending
            .addCase(deleteSpending.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteSpending.fulfilled, (state, action: PayloadAction<number>) => {
                state.spendings = state.spendings.filter(spending => spending.id !== action.payload);
                state.loading = false;
            })
            .addCase(deleteSpending.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to delete spending';
                state.loading = false;
            });
    },
});

export const { setFilter, setCurrentPage } = spendingsSlice.actions;
export default spendingsSlice.reducer;
