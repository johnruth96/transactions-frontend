import {useAuth} from "react-oidc-context";

export const ErrorPage = ({}) => {
    const {error} = useAuth();

    return <div>Oops... {error?.message}</div>
}