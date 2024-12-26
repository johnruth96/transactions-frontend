import {ButtonProps} from './types'
import {GridActionsCellItem} from '@mui/x-data-grid-premium'
import {Link} from '@mui/icons-material'
import {useMemo, useState} from 'react'
import {Box, Button, Modal, SxProps} from '@mui/material'
import {useSetRecordsMutationMutation} from '../redux/api'
import {RecordGrid} from '../RecordGrid'
import {GridInitialStatePremium} from '@mui/x-data-grid-premium/models/gridStatePremium'
import {GridRowSelectionModel} from "@mui/x-data-grid/models/gridRowSelectionModel";

const style: SxProps = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '95vw',
    height: '95vh',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    display: 'flex',
    flexDirection: 'column',
}

const bodyStyle: SxProps = {
    p: 4,
    overflow: 'scroll',
}

const footerStyle: SxProps = {
    px: 4,
    pb: 4,
    bgcolor: 'background.paper',
    textAlign: 'end',
}

export const ConnectAction = ({row}: ButtonProps) => {
    const getRowSelectionModel = () => {
        // @ts-ignore
        return row.records.map((r) => r.id)
    }

    const [setRecords, {}] = useSetRecordsMutationMutation()
    const [selectionModel, setSelectionModel] = useState(getRowSelectionModel)

    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const handleSubmit = () => {
        setRecords({
            transaction: row.id,
            records: selectionModel,
        })
            .unwrap()
            .then(() => {
                handleClose()
            })
    }

    const initialFilterState: GridInitialStatePremium = useMemo(() => {
        if (row.records.length === 0) {
            return {
                filter: {
                    filterModel: {
                        items: [
                            {
                                field: 'transaction_count',
                                operator: '=',
                                value: 0,
                            },
                        ],
                    },
                },
            }
        } else {
            return {}
        }
    }, [row])

    const handleRowSelectionModelChange = (rowSelectionModel: GridRowSelectionModel) => {
        // @ts-ignore
        setSelectionModel(rowSelectionModel)
    }

    return (
        <div>
            <GridActionsCellItem
                label="Un-ignore"
                icon={<Link/>}
                onClick={handleOpen}
                disabled={row.is_ignored}
            />

            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <Box sx={bodyStyle}>
                        <RecordGrid
                            rowSelectionModel={selectionModel}
                            onRowSelectionModelChange={handleRowSelectionModelChange}
                            density={'compact'}
                            pagination
                            headerFilters
                            headerFilterHeight={75}
                            initialState={initialFilterState}
                        />
                    </Box>
                    <Box sx={footerStyle}>
                        <Button onClick={handleClose}>Abbrechen</Button>
                        <Button
                            onClick={handleSubmit}
                            sx={{mr: 1}}
                            variant={'contained'}
                        >
                            Verbinden
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    )
}
