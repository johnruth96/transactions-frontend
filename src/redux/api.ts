import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import type {Contract, Transaction} from '../app/types'
import {Category, RecordProxy} from '../app/types'
import {createEntityAdapter, EntityState} from '@reduxjs/toolkit'
import {RootState} from './store'
import {getAccessToken} from "../auth/token.ts";
import {API_BASE} from "../app/config.ts";

const transactionsAdapter = createEntityAdapter<Transaction>({})
const recordsAdapter = createEntityAdapter<RecordProxy>({})
const categoryAdapter = createEntityAdapter<Category>({})
const contractAdapter = createEntityAdapter<Contract>({})

// @ts-ignore
const upsertTransaction = async (dispatch, queryFulfilled) => {
    try {
        const {data} = await queryFulfilled

        dispatch(
            transactionApi.util.updateQueryData(
                'getTransactions',
                undefined,
                (draft) => transactionsAdapter.upsertOne(draft, data)
            )
        )
    } catch {
    }
}

export const transactionApi = createApi({
    reducerPath: 'transactionApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE,
        prepareHeaders: (headers, {}) => {
            const accessToken = getAccessToken()

            if (accessToken !== null) {
                headers.set('Authorization', `Bearer ${accessToken}`)
            }
        },
    }),
    tagTypes: ['Transaction', 'Record'],
    endpoints: (builder) => ({
        /* 
         Transaction
         */
        getTransactions: builder.query<EntityState<Transaction, number>, void>({
            query: () => `transactions/`,
            providesTags: ['Transaction'],
            transformResponse: (response: Transaction[]) => {
                return transactionsAdapter.addMany(
                    transactionsAdapter.getInitialState(),
                    response
                )
            },
        }),
        hideTransaction: builder.mutation<Transaction, number>({
            query: (id) => ({
                url: `transactions/${id}/hide/`,
                method: 'POST',
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                await upsertTransaction(dispatch, queryFulfilled)
            },
        }),
        showTransaction: builder.mutation<Transaction, number>({
            query: (id) => ({
                url: `transactions/${id}/show/`,
                method: 'POST',
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                await upsertTransaction(dispatch, queryFulfilled)
            },
        }),
        bookmarkTransaction: builder.mutation<Transaction, number>({
            query: (id) => ({
                url: `transactions/${id}/bookmark/`,
                method: 'POST',
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                await upsertTransaction(dispatch, queryFulfilled)
            },
        }),
        removeBookmarkTransaction: builder.mutation<Transaction, number>({
            query: (id) => ({
                url: `transactions/${id}/unbookmark/`,
                method: 'POST',
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                await upsertTransaction(dispatch, queryFulfilled)
            },
        }),
        counterBookingTransaction: builder.mutation<void, number[]>({
            query: (payload) => ({
                url: `transactions/counter_booking/`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['Transaction'],
        }),
        setRecordsMutation: builder.mutation<
            Transaction,
            { transaction: number; records: number[] }
        >({
            query: ({transaction, records}) => ({
                url: `transactions/${transaction}/records/`,
                method: 'POST',
                body: records,
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                await upsertTransaction(dispatch, queryFulfilled)
            },
        }),
        importCsv: builder.mutation<void, string[]>({
            query: (contents) => ({
                url: `transactions/import/`,
                method: 'POST',
                body: contents,
            }),
            invalidatesTags: ['Transaction'],
        }),
        /*
         Finance API
         */
        fetchFromRemote: builder.mutation<void, void>({
            query: () => ({
                url: `records/fetch/`,
                method: "POST",
            }),
            invalidatesTags: ["Record"]
        }),
        getCategories: builder.query<EntityState<Category, number>, void>({
            query: () => `categories/`,
            transformResponse: (response: Category[]) => {
                return categoryAdapter.addMany(
                    categoryAdapter.getInitialState(),
                    response
                )
            },
        }),
        getContracts: builder.query<EntityState<Contract, number>, void>({
            query: () => `contracts/`,
            transformResponse: (response: Contract[]) => {
                return contractAdapter.addMany(
                    contractAdapter.getInitialState(),
                    response
                )
            },
        }),
        /*
         Record
         */
        getRecords: builder.query<EntityState<RecordProxy, number>, void>({
            query: () => `records/`,
            providesTags: ['Record'],
            transformResponse: (response: RecordProxy[]) => {
                return recordsAdapter.addMany(
                    recordsAdapter.getInitialState(),
                    response
                )
            },
        }),
        createRecordMutation: builder.mutation<
            RecordProxy,
            Partial<RecordProxy>
        >({
            query: (payload) => ({
                url: `records/`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['Transaction'],
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled

                    dispatch(
                        transactionApi.util.updateQueryData(
                            'getRecords',
                            undefined,
                            (draft) => recordsAdapter.upsertOne(draft, data)
                        )
                    )
                } catch {
                }
            },
        }),
        changeRecordMutation: builder.mutation<
            RecordProxy,
            Pick<RecordProxy, 'id'> & Partial<RecordProxy>
        >({
            query: ({id, ...payload}) => ({
                url: `records/${id}/`,
                method: 'PATCH',
                body: payload,
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled

                    dispatch(
                        transactionApi.util.updateQueryData(
                            'getRecords',
                            undefined,
                            (draft) => recordsAdapter.upsertOne(draft, data)
                        )
                    )
                } catch {
                }
            },
        }),
        deleteRecordsMutation: builder.mutation<void, number[]>({
            query: (ids) => ({
                url: `records/bulk_delete/`,
                method: 'DELETE',
                body: ids,
            }),
            invalidatesTags: ['Transaction', 'Record'],
        }),
        publishRecordsMutation: builder.mutation<void, number[]>({
            query: (ids) => ({
                url: `records/publish/`,
                method: 'POST',
                body: ids,
            }),
            invalidatesTags: ['Record'],
        }),
    }),
})

const selectGetTransactionsResult =
    transactionApi.endpoints.getTransactions.select()
const selectGetRecordsResult = transactionApi.endpoints.getRecords.select()
const selectGetCategoriesResult =
    transactionApi.endpoints.getCategories.select()
const selectGetContractsResult = transactionApi.endpoints.getContracts.select()

export const transactionSelectors = transactionsAdapter.getSelectors(
    (state: RootState) => {
        return (
            selectGetTransactionsResult(state)?.data ??
            transactionsAdapter.getInitialState()
        )
    }
)

export const recordSelectors = recordsAdapter.getSelectors<RootState>(
    (state: RootState) => {
        return (
            selectGetRecordsResult(state)?.data ??
            recordsAdapter.getInitialState()
        )
    }
)

export const categorySelectors = categoryAdapter.getSelectors(
    (state: RootState) => {
        return (
            selectGetCategoriesResult(state)?.data ??
            categoryAdapter.getInitialState()
        )
    }
)

export const contractSelectors = contractAdapter.getSelectors(
    (state: RootState) => {
        return (
            selectGetContractsResult(state)?.data ??
            contractAdapter.getInitialState()
        )
    }
)

export const {
    useHideTransactionMutation,
    useShowTransactionMutation,
    useBookmarkTransactionMutation,
    useRemoveBookmarkTransactionMutation,
    useCounterBookingTransactionMutation,
    useSetRecordsMutationMutation,
    useCreateRecordMutationMutation,
    useChangeRecordMutationMutation,
    useDeleteRecordsMutationMutation,
    usePublishRecordsMutationMutation,
    useFetchFromRemoteMutation,
    useImportCsvMutation
} = transactionApi
