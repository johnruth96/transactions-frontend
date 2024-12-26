import { GridRowParams } from '@mui/x-data-grid'
import { Transaction } from './app/types'
import { Box } from '@mui/material'
import { RecordGrid } from './RecordGrid'

const TransactionGridDetailPanel = ({ row }: GridRowParams<Transaction>) => {
    return (
        <Box sx={{ p: 1 }}>
            <RecordGrid
                recordIds={row.records}
                density={'compact'}
                hideFooter
            />
        </Box>
    )
}

export const getDetailPanelContent = (props: GridRowParams<Transaction>) => {
    if (props.row.records.length === 0) {
        return null
    }

    return <TransactionGridDetailPanel {...props} />
}
