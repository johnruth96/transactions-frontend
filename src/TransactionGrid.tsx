import {
    DataGridPremium,
    DataGridPremiumProps,
    GridColDef,
    GridRowClassNameParams,
} from '@mui/x-data-grid-premium'
import { useMemo } from 'react'
import { recordSelectors, transactionSelectors } from './redux/api'
import dayjs from 'dayjs'
import { getTransactionState, Transaction, TransactionState } from './app/types'
import { AmountCell } from './AmountCell'
import { IgnoreAction } from './TransactionGridAction/IgnoreAction'
import { HighlightAction } from './TransactionGridAction/HighlightAction'
import { ConnectAction } from './TransactionGridAction/ConnectAction'
import { CreateRecordAction } from './TransactionGridAction/CreateRecordAction'
import { useAppSelector } from './redux/hooks'

export interface RowModel extends Transaction {
    state: TransactionState
}

const columns: GridColDef<RowModel>[] = [
    {
        field: 'account',
        headerName: 'Konto',
        type: 'string',
        valueFormatter: (value: string) => value.substring(2, 4),
    },
    {
        field: 'booking_date',
        headerName: 'Datum',
        type: 'date',
        valueGetter: (value: string) => value && dayjs(value).toDate(),
    },
    {
        field: 'creditor',
        headerName: 'Auftraggeber/Empfänger',
        flex: 1,
    },
    {
        field: 'transaction_type',
        headerName: 'Buchungstext',
    },
    {
        field: 'purpose',
        headerName: 'Verwendungszweck',
        flex: 1,
    },
    {
        field: 'amount',
        headerName: 'Betrag',
        type: 'number',
        renderCell: AmountCell,
    },
    {
        field: 'is_highlighted',
        headerName: 'Markiert',
        type: 'boolean',
    },
    {
        field: 'is_duplicate',
        headerName: 'Duplikat',
        type: 'boolean',
        valueGetter: (_, row) => row.is_counter_to !== null,
    },
    {
        field: 'state',
        headerName: 'Zustand',
        type: 'singleSelect',
        valueOptions: [
            {
                value: TransactionState.NEW,
                label: 'neu',
            },
            {
                value: TransactionState.STAGING,
                label: 'in Bearbeitung',
            },
            {
                value: TransactionState.IGNORED,
                label: 'ignoriert',
            },
            {
                value: TransactionState.IMPORTED,
                label: 'importiert',
            },
        ],
    },
    {
        field: 'actions',
        headerName: 'Aktionen',
        flex: 1,
        type: 'actions',
        getActions: ({ row }) => [
            <IgnoreAction row={row} />,
            <HighlightAction row={row} />,
            <ConnectAction row={row} />,
            <CreateRecordAction row={row} />,
        ],
    },
]

const getRowClassName = ({ row }: GridRowClassNameParams<RowModel>) => {
    let className = ''

    if (row.is_highlighted) {
        className = 'bg-primary-subtle'
    } else if (row.is_counter_to !== null) {
        className = 'bg-secondary-subtle'
    } else {
        if (row.state === TransactionState.NEW) {
            className = ''
        } else if (row.state === TransactionState.IGNORED) {
            className = 'bg-secondary-subtle'
        } else if (row.state === TransactionState.STAGING) {
            className = 'bg-warning-subtle'
        } else {
            className = 'bg-success-subtle'
        }
    }

    return className
}

interface TransactionGridProps
    extends Omit<DataGridPremiumProps, 'rows' | 'columns'> {
    transactionIds?: number[]
}

export const TransactionGrid = ({
    transactionIds,
    ...props
}: TransactionGridProps) => {
    const transactions = useAppSelector(transactionSelectors.selectAll)
    const transactionById = useAppSelector(transactionSelectors.selectEntities)
    const recordById = useAppSelector(recordSelectors.selectEntities)

    const rows: RowModel[] = useMemo(() => {
        const transactionList = transactionIds
            ? transactionIds.map((id) => transactionById[id])
            : transactions

        return transactionList.map((t) => ({
            ...t,
            state: getTransactionState(t, recordById),
        }))
    }, [transactions, transactionById, transactionIds, recordById])

    return (
        <DataGridPremium
            columns={columns}
            rows={rows}
            getRowClassName={getRowClassName}
            {...props}
        />
    )
}
