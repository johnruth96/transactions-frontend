import {ListItem, ListItemButton, ListItemText} from "@mui/material";
import {useFetchFromRemoteMutation} from "./redux/api.ts";
import green from "@mui/material/colors/green";
import red from "@mui/material/colors/red";

export const FetchRemoteItem = () => {
    const [triggerFetch, {isLoading, isSuccess, isError, error}] = useFetchFromRemoteMutation();

    const handleClick = () => {
        triggerFetch()
    }

    const sx = {
        ...(isSuccess ? {color: green[600]} : {}),
        ...(isError ? {color: red[600]} : {}),
    }

    if (error) {
        console.error(error)
    }

    return (
        <ListItem disablePadding>
            <ListItemButton onClick={handleClick} disabled={isLoading}>
                <ListItemText primary={"Fetch"} secondary={"Records from Finance API"} sx={sx}/>
            </ListItemButton>
        </ListItem>
    )
}