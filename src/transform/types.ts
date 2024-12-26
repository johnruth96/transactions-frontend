import {RecordProxy, Transaction} from "../app/types.ts";


export interface RecordDraft extends Partial<Omit<RecordProxy, 'category' | 'contract'>> {
    category?: string | number
    contract?: string | number
}

export interface EqualsCondition {
    field: keyof Transaction
    operator: "equals"
    value: string | number | boolean
}

export interface StartsWithCondition {
    field: keyof Transaction
    operator: "startsWith"
    value: string
}

export type Condition = EqualsCondition | StartsWithCondition

export interface TransformRule {
    conditions: Condition[]
    action: RecordDraft | ((transaction: Transaction) => RecordDraft)
}