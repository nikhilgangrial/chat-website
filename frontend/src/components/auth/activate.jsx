import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ActivateAccount() {
	const navigate = useNavigate();
	useEffect(() => {
		navigate('/auth/activate/completed')
	}, [])

	return <></>
}

export { ActivateAccount }
