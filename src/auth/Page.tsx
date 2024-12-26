import {Box} from "@mui/material";
import {PropsWithChildren} from "react";

export const Page = ({children}: PropsWithChildren) => {
    return (
        <Box sx={{p: 2}}>{children}</Box>
    )
}