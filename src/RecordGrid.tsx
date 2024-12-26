import {
    DataGridPremium,
    DataGridPremiumProps,
    GridColDef,
} from '@mui/x-data-grid-premium'
import React, { useMemo } from 'react'
import {
    categorySelectors,
    contractSelectors,
    recordSelectors,
} from './redux/api'
import dayjs from 'dayjs'
import { AmountCell } from './AmountCell'
import { RecordProxy } from './app/types'
import { useAppSelector } from './redux/hooks'

interface RecordGridProps
    extends Omit<DataGridPremiumProps, 'rows' | 'columns'> {
    recordIds?: number[]
}

export const RecordGrid = ({ recordIds, ...props }: RecordGridProps) => {
    const data = useAppSelector(recordSelectors.selectAll)
    const categoryById = useAppSelector(categorySelectors.selectEntities)
    const contracts = useAppSelector(contractSelectors.selectAll)

    const categoryValueOptions = useMemo(() => {
        const options = Object.values(categoryById).map((category) => ({
            label:
                category.parent === null
                    ? category.name
                    : `${categoryById[category.parent].name}/${category.name}`,
            value: category.id,
        }))
        options.sort((a, b) => a.label.localeCompare(b.label))
        return options
    }, [categoryById])

    const records = useAppSelector((state) => {
        if (recordIds) {
            return recordIds.map((id) => recordSelectors.selectById(state, id))
        } else {
            return null
        }
    })

    const rows = useMemo(() => {
        if (records) {
            return records
        } else if (data) {
            return data
        } else {
            return []
        }
    }, [data, records])

    const columns: GridColDef<RecordProxy>[] = [
        {
            field: 'date',
            headerName: 'Datum',
            type: 'date',
            valueGetter: (value: string) => dayjs(value).toDate(),
            editable: true,
        },
        {
            field: 'subject',
            headerName: 'Betreff',
            flex: 3,
            editable: true,
        },
        {
            field: 'amount',
            headerName: 'Betrag',
            type: 'number',
            renderCell: AmountCell,
            editable: true,
        },
        {
            field: 'category',
            headerName: 'Kategorie',
            type: 'singleSelect',
            valueOptions: categoryValueOptions,
            flex: 1,
            editable: true,
        },
        {
            field: 'contract',
            headerName: 'Vertrag',
            type: 'singleSelect',
            valueOptions: contracts.map((contract) => ({
                value: contract.id,
                label: contract.name,
            })),
            editable: true,
        },
        {
            field: 'account',
            headerName: 'Konto',
            type: 'number',
            editable: true,
        },
        {
            field: 'is_remote',
            headerName: 'Remote',
            type: 'boolean',
            valueGetter: (_, row) => row.remote_id !== null,
        },
        {
            field: 'transaction_count',
            headerName: 'Transaktionen',
            type: 'number',
            valueGetter: (_, row) => row.transactions.length,
        },
    ]

    return (
        <DataGridPremium
            columns={columns}
            rows={rows}
            isCellEditable={() => false}
            {...props}
        />
    )
}
