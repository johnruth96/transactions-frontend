import {Category, Contract, RecordProxy, Transaction} from "../app/types.ts";
import {RecordDraft, TransformRule} from "./types.ts";

const matchTransaction = (transaction: Transaction, rule: TransformRule) => {
    return rule.conditions.every(cond => {
        if (cond.operator === "equals") {
            return transaction[cond.field] === cond.value
        } else if (cond.operator === "startsWith") {
            const value = transaction[cond.field]
            return typeof value === "string" ? value.startsWith(cond.value) : false
        }
    })
}

const applyRule = (rule: TransformRule, transaction: Transaction): RecordDraft => {
    if (typeof rule.action === "function") {
        return rule.action(transaction)
    } else {
        return rule.action
    }
}

class Transformer {
    private categories: Category[] = [];
    private contracts: Contract[] = [];
    private rules: TransformRule[] = [];

    setRules(rules: TransformRule[]) {
        this.rules = rules
    }

    setCategories(categories: Category[]) {
        this.categories = categories
    }

    setContracts(contracts: Contract[]) {
        this.contracts = contracts
    }

    transform(transaction: Transaction): Omit<RecordProxy, 'id' | 'remote_id'> {
        // Initial draft
        let record: Omit<RecordProxy, 'id' | 'remote_id'> = {
            subject: transaction.creditor !== '' ? transaction.creditor : transaction.purpose,
            date: transaction.value_date,
            amount: transaction.amount,
            account: 1, // FIXME
            transactions: [transaction.id],
            category: null,
            contract: null
        }

        for (const rule of this.rules) {
            if (matchTransaction(transaction, rule)) {
                const draft = applyRule(rule, transaction)

                for (const [attribute, value] of Object.entries(draft)) {
                    if (attribute === "category") {
                        if (typeof value === "string") {
                            record.category = this.getCategoryId(value)
                        } else {
                            record.category = value
                        }

                    } else if (attribute === "contract") {
                        if (typeof value === "string") {
                            record.contract = this.getContractId(value)
                        } else {
                            record.contract = value
                        }
                    } else {
                        // @ts-ignore
                        record[attribute] = value
                    }
                }
            }
        }

        return record
    }

    private getCategoryId(name: string): number | null {
        return this.categories.find((cat) => cat.name === name)?.id ?? null
    }

    private getContractId(name: string): number | null {
        return this.contracts.find((con) => con.name === name)?.id ?? null
    }
}

export default new Transformer()

