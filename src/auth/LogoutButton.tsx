import {ListItem, ListItemButton, ListItemText} from "@mui/material";
import {useAuth} from "react-oidc-context";
import React from "react";
import red from "@mui/material/colors/red";

export const LogoutButton = () => {
    const {removeUser, user} = useAuth();

    const handleClick = () => {
        removeUser()
    }

    return (
        <ListItem disablePadding>
            <ListItemButton onClick={handleClick}>
                <ListItemText primary={"Sign out"} secondary={user?.profile.email} sx={{color: red[700]}}/>
            </ListItemButton>
        </ListItem>
    )
}