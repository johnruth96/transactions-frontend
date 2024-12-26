import { ButtonProps } from './types'
import {
    useHideTransactionMutation,
    useShowTransactionMutation,
} from '../redux/api'
import { GridActionsCellItem } from '@mui/x-data-grid-premium'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import React from 'react'
import { TransactionState } from '../app/types'

const IgnoreButton = ({ row }: ButtonProps) => {
    const [hide, {}] = useHideTransactionMutation()

    const handleClick = () => {
        hide(row.id)
    }

    return (
        <GridActionsCellItem
            label="Ignore"
            icon={<VisibilityOff />}
            onClick={handleClick}
            disabled={row.state !== TransactionState.NEW}
        />
    )
}

const UnIgnoreButton = ({ row }: ButtonProps) => {
    const [show, {}] = useShowTransactionMutation()

    const handleClick = () => {
        show(row.id)
    }

    return (
        <GridActionsCellItem
            label="Un-ignore"
            icon={<Visibility />}
            onClick={handleClick}
            disabled={row.state !== TransactionState.IGNORED}
        />
    )
}

export const IgnoreAction = ({ row }: ButtonProps) => {
    if (row.state === TransactionState.IGNORED) {
        return <UnIgnoreButton row={row} />
    } else {
        return <IgnoreButton row={row} />
    }
}
