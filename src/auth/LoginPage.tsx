import {useAuth} from "react-oidc-context";
import {Page} from "./Page";
import {Button} from "@mui/material";

export const LoginPage = () => {
    const {signinRedirect} = useAuth();

    const handleClick = () => {
        signinRedirect()
    }

    return <Page>
        <Button onClick={handleClick} variant={"contained"}>Anmelden mit SSO</Button>
    </Page>
}