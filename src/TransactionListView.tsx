import { GridRowId, GridToolbar } from '@mui/x-data-grid-premium'
import { useState } from 'react'
import { useCounterBookingTransactionMutation } from './redux/api'
import { GridRowSelectionModel } from '@mui/x-data-grid/models/gridRowSelectionModel'
import { Box, Button } from '@mui/material'
import { SyncAlt } from '@mui/icons-material'
import { TransactionGrid } from './TransactionGrid'
import { getDetailPanelContent } from './TransactionGridDetailPanel'
import { TransactionState } from './app/types'

export const TransactionListView = ({}) => {
    const [counterBooking, {}] = useCounterBookingTransactionMutation()
    const [rowSelectionModel, setRowSelectionModel] = useState<
        readonly GridRowId[]
    >([])

    const onRowSelectionModelChange = (
        rowSelectionModel: GridRowSelectionModel
    ) => {
        setRowSelectionModel(rowSelectionModel)
    }

    const handleCounterBooking = () => {
        counterBooking(rowSelectionModel as number[])
    }

    return (
        <Box>
            <Button
                onClick={handleCounterBooking}
                disabled={rowSelectionModel.length === 0}
                sx={{ pb: 2 }}
            >
                <SyncAlt /> Gegenbuchung
            </Button>

            <TransactionGrid
                checkboxSelection
                rowSelection
                pagination
                initialState={{
                    density: 'compact',
                    pagination: {
                        paginationModel: {
                            pageSize: 50,
                        },
                    },
                    columns: {
                        columnVisibilityModel: {
                            is_highlighted: false,
                            is_duplicate: false,
                        },
                    },
                    filter: {
                        filterModel: {
                            items: [
                                {
                                    field: 'state',
                                    operator: 'is',
                                    value: TransactionState.NEW,
                                },
                                {
                                    field: 'is_duplicate',
                                    operator: 'is',
                                    value: false,
                                },
                            ],
                        },
                    },
                }}
                rowSelectionModel={rowSelectionModel}
                onRowSelectionModelChange={onRowSelectionModelChange}
                slots={{
                    toolbar: GridToolbar,
                }}
                getDetailPanelContent={getDetailPanelContent}
                getDetailPanelHeight={() => 'auto'}
            />
        </Box>
    )
}
