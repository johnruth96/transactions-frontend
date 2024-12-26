export interface RecordProxy {
    id: number
    remote_id: number | null
    date: string
    subject: string
    amount: number
    account: number | null
    category: number | null
    contract: number | null

    transactions: number[]
}

export interface Category {
    id: number
    name: string
    parent: number | null
    color: string
}

export interface Contract {
    id: number
    name: string
}

export interface Transaction {
    id: number
    account: string

    value_date: string
    booking_date: string
    creditor: string
    purpose: string
    transaction_type: string
    amount: number
    currency: 'EUR'

    is_counter_to: null
    is_highlighted: boolean

    // State flags
    is_ignored: boolean

    records: number[]
}

export enum TransactionState {
    NEW,
    STAGING,
    IMPORTED,
    IGNORED,
}

export const getTransactionState = (
    transaction: Transaction,
    recordById: Record<number, RecordProxy>
) => {
    if (transaction.is_ignored) {
        return TransactionState.IGNORED
    }

    if (transaction.records.length === 0) {
        return TransactionState.NEW
    }

    if (transaction.records.some((id) => recordById[id]?.remote_id === null)) {
        return TransactionState.STAGING
    }

    return TransactionState.IMPORTED
}
