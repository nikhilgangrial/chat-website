import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { api } from "../common/axios-short";

function Logout(props) {

    const navigate = useNavigate();

    useEffect(() => {
        if (props.islogin) {
            api('/auth/token/logout/', 'post', {}, true)
                .then((response) => {
                    localStorage.removeItem('user')
                    localStorage.removeItem('token')
                    props.setlogin(false)
                })
                .catch((error) => {
                    localStorage.removeItem('user')
                    localStorage.removeItem('token')
                    props.setlogin(false)
                })
        }
        navigate('/')
    })


    return (
        <>
        </>
    )
}

export {Logout}