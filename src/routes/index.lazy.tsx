import { createLazyFileRoute } from '@tanstack/react-router'
import React from 'react'
import { TransactionListView } from '../TransactionListView'

export const Route = createLazyFileRoute('/')({
    component: Index,
})

function Index() {
    return <TransactionListView />
}
