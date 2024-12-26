import { ButtonProps } from './types'
import {
    useBookmarkTransactionMutation,
    useRemoveBookmarkTransactionMutation,
} from '../redux/api'
import { GridActionsCellItem } from '@mui/x-data-grid-premium'
import { Bookmark, BookmarkBorder } from '@mui/icons-material'

const UnHighlightButton = ({ row }: ButtonProps) => {
    const [trigger, {}] = useRemoveBookmarkTransactionMutation()

    const handleClick = () => {
        trigger(row.id)
    }

    return (
        <GridActionsCellItem
            label="Un-Highlight"
            icon={<Bookmark />}
            onClick={handleClick}
        />
    )
}

const HighlightButton = ({ row }: ButtonProps) => {
    const [trigger, {}] = useBookmarkTransactionMutation()

    const handleClick = () => {
        trigger(row.id)
    }

    return (
        <GridActionsCellItem
            label="Highlight"
            icon={<BookmarkBorder />}
            onClick={handleClick}
        />
    )
}

export const HighlightAction = ({ row }: ButtonProps) => {
    if (row.is_highlighted) {
        return <UnHighlightButton row={row} />
    } else {
        return <HighlightButton row={row} />
    }
}
