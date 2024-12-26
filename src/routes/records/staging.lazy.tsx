import { createLazyFileRoute } from '@tanstack/react-router'
import { getDetailPanelContent } from '../../RecordGridDetailPanel'
import { RecordGrid } from '../../RecordGrid'
import { useAppSelector } from '../../redux/hooks'
import {
    recordSelectors,
    useChangeRecordMutationMutation,
    useDeleteRecordsMutationMutation,
    usePublishRecordsMutationMutation,
} from '../../redux/api'
import { RecordProxy } from '../../app/types'
import { GridCellParams } from '@mui/x-data-grid/models/params/gridCellParams'
import {
    GridToolbarContainer,
    useGridApiContext,
} from '@mui/x-data-grid-premium'
import { Button } from '@mui/material'

const BulkDeleteButton = () => {
    const apiRef = useGridApiContext()
    const [deleteRecords, { isLoading }] = useDeleteRecordsMutationMutation()

    const handleDelete = () => {
        const rows: RecordProxy[] = []
        apiRef.current.getSelectedRows().forEach((value) => {
            rows.push(value as RecordProxy)
        })

        const parts = [
            'Records',
            rows.map((record) => `'${record.subject}'`).join(', '),
            'löschen?',
        ]

        if (confirm(parts.join(' '))) {
            const ids = rows.map((row) => row.id)
            deleteRecords(ids)
        }
    }

    return (
        <Button size={'small'} onClick={handleDelete} disabled={isLoading}>
            Löschen
        </Button>
    )
}

const PublishButton = () => {
    const apiRef = useGridApiContext()
    const [publish, { isLoading }] = usePublishRecordsMutationMutation()

    const handleClick = () => {
        const rows: RecordProxy[] = []
        apiRef.current.getSelectedRows().forEach((value) => {
            rows.push(value as RecordProxy)
        })

        if (confirm(`${rows.length} veröffentlichen?`)) {
            const ids = rows.map((row) => row.id)
            publish(ids)
        }
    }

    return (
        <Button size={'small'} onClick={handleClick} disabled={isLoading}>
            Veröffentlichen
        </Button>
    )
}

const CustomToolbar = () => {
    return (
        <GridToolbarContainer>
            <PublishButton />
            <BulkDeleteButton />
        </GridToolbarContainer>
    )
}

export const StagingAreaView = ({}) => {
    const [update, _] = useChangeRecordMutationMutation()
    const records = useAppSelector(recordSelectors.selectAll)

    const ids = records
        .filter((record) => record.remote_id === null)
        .map((record) => record.id)

    const processRowUpdate = (newRow: RecordProxy) => {
        update(newRow)
        return newRow
    }

    const isCellEditable = ({ row }: GridCellParams<RecordProxy>) => {
        return row.remote_id === null
    }

    return (
        <RecordGrid
            checkboxSelection
            density={'compact'}
            disableRowSelectionOnClick
            recordIds={ids}
            getDetailPanelContent={getDetailPanelContent}
            getDetailPanelHeight={() => 'auto'}
            processRowUpdate={processRowUpdate}
            isCellEditable={isCellEditable}
            initialState={{
                columns: {
                    columnVisibilityModel: {
                        is_remote: false,
                        transaction_count: false,
                    },
                },
            }}
            slots={{
                toolbar: CustomToolbar,
            }}
        />
    )
}

export const Route = createLazyFileRoute('/records/staging')({
    component: StagingAreaView,
})
