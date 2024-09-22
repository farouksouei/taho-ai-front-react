import { configureStore } from '@reduxjs/toolkit';
import spendingsReducer from './spendingsQuery.ts';  // Import your slice

const store = configureStore({
    reducer: {
        spendings: spendingsReducer,
    },
});

export default store;

// Optionally, if you need to type RootState or AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
