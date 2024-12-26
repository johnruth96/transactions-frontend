import { configureStore } from '@reduxjs/toolkit'
import { transactionApi } from './api'

export const store = configureStore({
    reducer: {
        [transactionApi.reducerPath]: transactionApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(transactionApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
