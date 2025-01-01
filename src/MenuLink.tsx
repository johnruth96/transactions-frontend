import {createLink, LinkComponent} from '@tanstack/react-router'
import {ListItem, ListItemButton, ListItemText} from '@mui/material'
import React from 'react'
import {ListItemButtonOwnProps} from "@mui/material/ListItemButton/ListItemButton";


const BasicLink = React.forwardRef<HTMLAnchorElement, ListItemButtonOwnProps>(
    ({children, ...props}, ref) => {
        return (
            <ListItem disablePadding>
                <ListItemButton component={'a'} ref={ref} {...props}>
                    <ListItemText primary={children}/>
                </ListItemButton>
            </ListItem>
        )
    },
)

const CreatedLinkComponent = createLink(BasicLink)

export const MenuLink: LinkComponent<typeof BasicLink> = (props) => {
    return <CreatedLinkComponent preload={'intent'} {...props} />
}