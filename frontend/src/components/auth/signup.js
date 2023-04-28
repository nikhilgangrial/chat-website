import { Link as RouterLink } from 'react-router-dom';

import {
	Button,
	TextField,
	Grid,
	Link,
	Avatar,
	Typography,
} from '@mui/material'

import { PersonAdd } from "@mui/icons-material";

function Signup() {
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
				<TextField margin="normal" size="small" required fullWidth name="email" label="Email Address"
						   type="email" id="email" autoComplete="email" autoFocus/>
				<TextField margin="normal" size="small" required fullWidth name="username" label="Username"
						   type="text" id="username" autoComplete="username"/>
				<TextField margin="normal" size="small" required fullWidth name="password" label="Password"
						   type="password" id="password" autoComplete="current-password"/>
				<TextField margin="normal" size="small" required fullWidth name="repassword" label="Confirm Password"
						   type="password" id="repassword" autoComplete="current-password"/>

				<Button type="submit" fullWidth variant="contained" sx={ { mt: 3, mb: 2 } }>
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