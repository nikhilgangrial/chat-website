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

import { Person } from "@mui/icons-material";


function Login(props) {
	const [errors, seterrors ] = useState({
		'email': '',
		'password': '',
	})

	const navigate = useNavigate();

	const login = (event) => {
		event.preventDefault()

		const data = Object.fromEntries(new FormData(event.currentTarget.parentElement))
		
		api(
			'/auth/token/login/',
			'post',
			data,
			false,
		).then((response) => {
			console.log(response.data);
			localStorage.setItem('token', response.data.auth_token);
			props.setlogin(true);
			navigate('/')
		}).catch((error) => {
			if (error.response.data.non_field_errors) {
				if (error.response.data.non_field_errors[0] === "The two password fields didn't match."){
					error.response.data.email = error.response.data.non_field_errors
					error.response.data.email = error.response.data.non_field_errors
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
				<Person fontSize="large"/>
			</Avatar>
			<Typography component="h1" variant="h5">
				Sign in
			</Typography>
			<Grid item xs={ 11 } sm={ 6 } lg={ 4 } component="form" noValidate sx={ { mt: 4, maxWidth: '95%' } }>
				<TextField
					margin="normal"
					size="small"
					required
					fullWidth
					id="email"
					name="email"
					label="Email Address"
					type={ "email" }
					autoComplete="email"
					helperText={ errors.email }
					error={ Boolean(errors.email) }
					autoFocus/>

				<Password
					margin="normal"
					size="small"
					required
					fullWidth
					id="password"
					name="password"
					label="Password"
					helperText={ errors.password }
					error={ Boolean(errors.password) }
					autoComplete="password"/>

				<Button type="submit" onClick={ login } fullWidth variant="contained" sx={ { mt: 3, mb: 2 } }>
					Login
				</Button>
				<Grid container>
					<Grid item xs>
						<Link component={ RouterLink } to="/auth/forgot" variant="body2">
							Forgot password?
						</Link>
					</Grid>
					<Grid item>
						<Link component={ RouterLink } to="/auth/signup/" variant="body2">
							{ "Don't have an account? Sign Up" }
						</Link>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}

export { Login }