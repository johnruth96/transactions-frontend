import React from 'react'
import { GridRenderCellParams } from '@mui/x-data-grid/models/params/gridCellParams'
import { Amount } from './Amount'

export const AmountCell = ({ value }: GridRenderCellParams) => {
    return <Amount value={value} />
}
