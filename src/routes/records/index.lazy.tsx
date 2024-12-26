import { createLazyFileRoute } from '@tanstack/react-router'
import { RecordGrid } from '../../RecordGrid'
import { GridToolbar } from '@mui/x-data-grid-premium'
import { getDetailPanelContent } from '../../RecordGridDetailPanel'

const RecordListView = () => {
    return (
        <RecordGrid
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
            }}
            slots={{
                toolbar: GridToolbar,
            }}
            getDetailPanelContent={getDetailPanelContent}
            getDetailPanelHeight={() => 'auto'}
        />
    )
}

export const Route = createLazyFileRoute('/records/')({
    component: RecordListView,
})
