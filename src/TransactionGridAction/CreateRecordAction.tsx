import {ButtonProps} from './types'
import {GridActionsCellItem} from '@mui/x-data-grid-premium'
import{useEffect} from 'react'
import {categorySelectors, contractSelectors, useCreateRecordMutationMutation,} from '../redux/api'
import {AddCircle} from '@mui/icons-material'
import {useAppSelector} from '../redux/hooks'
import Transformer from "../transform/transformer.ts";


export const CreateRecordAction = ({row}: ButtonProps) => {
    const [createRecord, {isLoading}] = useCreateRecordMutationMutation()
    const categories = useAppSelector(categorySelectors.selectAll)
    const contracts = useAppSelector(contractSelectors.selectAll)

    useEffect(() => {
        Transformer.setCategories(categories)
        Transformer.setContracts(contracts)
    }, [categories, contracts])

    const handleClick = () => {
        const record = Transformer.transform(row)

        console.debug("Transformed record:", record)

        createRecord(record)
    }

    return (
        <GridActionsCellItem
            label={'Create record'}
            icon={<AddCircle/>}
            onClick={handleClick}
            disabled={isLoading}
        />
    )
}
