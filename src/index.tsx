import React from 'react'
import ReactDOM from 'react-dom/client'
import {store} from './redux/store'
import {Provider} from 'react-redux'
import {createRouter, RouterProvider} from '@tanstack/react-router'
import {routeTree} from './routeTree.gen'
import {transactionApi} from './redux/api'
import {DATA_GRID_LICENSE} from "./app/config.ts";
import {LicenseInfo} from '@mui/x-license';
import {AuthProvider} from "./auth/AuthProvider.tsx";
import Transformer from "./transform/transformer.ts";
import {TRANSFORM_RULES} from "./app/rules.tsx";

import 'bootstrap/dist/css/bootstrap.css'

// Material UI DataGrid
LicenseInfo.setLicenseKey(DATA_GRID_LICENSE)

// Transformer
Transformer.setRules(TRANSFORM_RULES)

// Fetch API
store.dispatch(transactionApi.endpoints.getTransactions.initiate())
store.dispatch(transactionApi.endpoints.getRecords.initiate())
store.dispatch(transactionApi.endpoints.getCategories.initiate())
store.dispatch(transactionApi.endpoints.getContracts.initiate())

// Create a new router instance
const router = createRouter({routeTree})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <AuthProvider>
            <Provider store={store}>
                <RouterProvider router={router}/>
            </Provider>
        </AuthProvider>
    </React.StrictMode>
)
