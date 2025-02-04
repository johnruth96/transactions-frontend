import {createRootRoute, Outlet} from '@tanstack/react-router'
import {TanStackRouterDevtools} from '@tanstack/router-devtools'
import {Box, Divider, Drawer, List} from '@mui/material'
import {MenuLink} from "../MenuLink.tsx";
import {LogoutButton} from "../auth/LogoutButton.tsx";
import {FetchRemoteItem} from "../Fetch.tsx";
import {useAppDispatch} from "../redux/hooks.ts";
import {useEffect} from "react";
import {transactionApi} from "../redux/api.ts";

const drawerWidth = "240px"

const App = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(transactionApi.endpoints.getTransactions.initiate())
        dispatch(transactionApi.endpoints.getRecords.initiate())
        dispatch(transactionApi.endpoints.getCategories.initiate())
        dispatch(transactionApi.endpoints.getContracts.initiate())
    }, [dispatch])

    return (
        <Box sx={{display: 'flex', height: "100%"}}>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <List>
                    <MenuLink to="/">Transactions</MenuLink>
                    <MenuLink to="/records/staging">Staging Area</MenuLink>
                    <MenuLink to="/records">Records</MenuLink>
                    <Divider/>
                    <MenuLink to="/import">Import</MenuLink>
                    <Divider/>
                    <FetchRemoteItem/>
                    <Divider/>
                    <LogoutButton/>
                </List>
            </Drawer>

            <Box
                component="main"
                sx={{flexGrow: 1, bgcolor: 'background.default', p: 1}}
            >

                <Outlet/>
            </Box>

            <TanStackRouterDevtools/>
        </Box>
    )
}

export const Route = createRootRoute({
    component: App,
})
