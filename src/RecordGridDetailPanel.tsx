import { GridRowParams } from '@mui/x-data-grid'
import { RecordProxy } from './app/types'
import { Box } from '@mui/material'
import React from 'react'
import { TransactionGrid } from './TransactionGrid'

export const RecordGridDetailPanel = ({ row }: GridRowParams<RecordProxy>) => {
    return (
        <Box sx={{ p: 1 }}>
            <TransactionGrid
                transactionIds={row.transactions}
                density={'compact'}
                hideFooter
            />
        </Box>
    )
}

export const getDetailPanelContent = (props: GridRowParams<RecordProxy>) => {
    if (props.row.transactions.length === 0) {
        return null
    }

    return <RecordGridDetailPanel {...props} />
}
