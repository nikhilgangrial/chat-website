import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { api } from '../common/axios-short'
import Password from '../common/password';

import {
	Button,
	TextField,
	Grid,
	Link,
	Avatar,
	Typography,
} from '@mui/material'

import { PersonAdd } from "@mui/icons-material";


function Signup(props) {

	const [errors, seterrors ] = useState({
		'username': '',
		'email': '',
		'phone_no': '',
		'password': '',
		're_password': '',
	})

	const navigate = useNavigate();

	const signup = (event) => {
		event.preventDefault()

		const data = Object.fromEntries(new FormData(event.currentTarget.parentElement))

		api(
			'/auth/users/',
			'post',
			data,
			false,
		).then((response) => {
			localStorage.setItem('token', response.data.auth_token);
			localStorage.setItem('user', JSON.stringify(response.data.user))
			props.setuserupdated(true)
			navigate('/');
		}).catch((error) => {

			if (error.response.data.non_field_errors) {
				if (error.response.data.non_field_errors[0] === "The two password fields didn't match."){
					error.response.data.re_password = error.response.data.non_field_errors
				} else{
					alert(error.response.data.non_field_errors);
				}
			}
			seterrors(error.response.data)
		});

	}

	return (
		<Grid container sx={ {
			marginTop: 8,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
		} }>
			<Avatar sx={ { m: 1, bgcolor: 'secondary.main' } }>
				<PersonAdd fontSize="medium"/>
			</Avatar>
			<Typography component="h1" variant="h5">
				Sign up
			</Typography>
			<Grid item xs={ 11 } md={ 8 } lg={ 4 } component="form" noValidate sx={ { mt: 4 } }>
				<TextField margin="normal" size="small" required fullWidth name="username" label="Username"
						   type="text" id="username" autoComplete="username" autoFocus error={Boolean(errors.username)} helperText={errors.username}/>
				<TextField margin="normal" size="small" required fullWidth name="email" label="Email Address"
						   type="email" id="email" autoComplete="email" error={Boolean(errors.email)} helperText={errors.email}/>
				<TextField margin="normal" size="small" required fullWidth name="phone_no" label="Phone no"
						   type="text" id="phone_no" autoComplete="phone_no" error={Boolean(errors.phone_no)} helperText={errors.phone_no}/>
				<Password margin="normal" size="small" required fullWidth name="password" label="Password"
						   type="password" id="password" autoComplete="password" error={Boolean(errors.password)} helperText={errors.password}/>
				<Password margin="normal" size="small" required fullWidth name="re_password" label="Confirm Password"
						   type="password" id="re_password" autoComplete="re-password" error={Boolean(errors.re_password)} helperText={errors.re_password}/>

				<Button type="submit" fullWidth onClick={ signup } variant="contained" sx={ { mt: 3, mb: 2 } }>
					Sign up
				</Button>
				<Grid container sx={ { flexDirection: "column", alignItems: "center" } }>
					<Grid item>
						<Link component={ RouterLink } to="/auth/login/" variant="body2">
							{ "Already an account? Login" }
						</Link>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}

export { Signup }