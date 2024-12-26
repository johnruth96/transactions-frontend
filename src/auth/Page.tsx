import {Box} from "@mui/material";
import React from "react";

export const Page = ({children}) => {
    return (
        <Box sx={{p: 2}}>{children}</Box>
    )
}