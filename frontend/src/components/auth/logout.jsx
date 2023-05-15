import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { api } from "../common/axios-short";

function Logout(props) {

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('user')) {
            api('/auth/token/logout/', 'post', {}, true)
                .then((response) => {
                    localStorage.removeItem('user')
                    localStorage.removeItem('token')
                    props.setuserupdated(true)
                })
                .catch((error) => {
                    localStorage.removeItem('user')
                    localStorage.removeItem('token')
                    props.setuserupdated(true)
                })
        }
        navigate('/auth/login')
    })


    return (
        <>
        </>
    )
}

export {Logout}