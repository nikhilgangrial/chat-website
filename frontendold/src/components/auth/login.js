import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { api } from '../common/axios-short'
import Password from '../common/password';

import {
	Button,
	TextField,
	Box,
	Link,
	Avatar,
	Typography,
} from '@mui/material';

import { Person } from "@mui/icons-material";


function Login(props) {
	const [errors, seterrors] = useState({
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
			localStorage.set('token', response.data.auth_token)

			api('/auth/users/me/', 'get', {}, true)
				.then((response) => {
					localStorage.set('user', JSON.stringify(response.data))
					props.setuserupdated(true)
					navigate('/')
				})
				.catch(() => {
					localStorage.remove('user')
					localStorage.remove('token')
				})

		}).catch((error) => {
			if (error.response.data.non_field_errors) {
				if (error.response.data.non_field_errors[0] === "The two password fields didn't match.") {
					error.response.data.email = error.response.data.non_field_errors
					error.response.data.email = error.response.data.non_field_errors
				} else {
					alert(error.response.data.non_field_errors);
				}
			}
			seterrors(error.response.data)
		});

	}

	return (
		<Box className="d-flex flex-column align-items-center mt-5">
			
			<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
				<Person fontSize="large" />
			</Avatar>
			
			<Typography component="h1" variant="h5">
				Sign in
			</Typography>
			
			<Box  xs={11} sm={6} lg={4} component="form" noValidate sx={{ mt: 4, maxWidth: '95%' }}>
				<TextField
					margin="normal"
					size="small"
					required
					fullWidth
					id="email"
					name="email"
					label="Email Address"
					type={"email"}
					autoComplete="email"
					helperText={errors.email}
					error={Boolean(errors.email)}
					autoFocus />

				<Password
					margin="normal"
					size="small"
					required
					fullWidth
					id="password"
					name="password"
					label="Password"
					helperText={errors.password}
					error={Boolean(errors.password)}
					autoComplete="password" />

				<Button type="submit" onClick={login} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
					Login
				</Button>

				<Box className="d-flex flex-row justify-content-between">
					<Box>
						<Link component={RouterLink} to="/auth/forgot" variant="body2">
							Forgot password?
						</Link>
					</Box>
					<Box >
						<Link component={RouterLink} to="/auth/signup/" variant="body2">
							{"Don't have an account? Sign Up"}
						</Link>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}

export { Login }