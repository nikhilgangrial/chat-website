import { Link as RouterLink } from 'react-router-dom';

import {
    Button,
    TextField,
    Grid,
    Link,
    Avatar,
    Typography,
} from '@mui/material'

import { Person } from "@mui/icons-material";

function Login() {
    return (
        <Grid container sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
            <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                <Person fontSize="large"/>
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
            <Grid item xs={11} sm={6} lg={4} component="form" noValidate sx={{mt: 4, maxWidth: '95%'}}>
                <TextField  margin="normal" size="small" required fullWidth id="email" label="Email Address"
                            type="email" name="email" autoComplete="email" autoFocus />
                <TextField margin="normal" size="small" required fullWidth name="password" label="Password"
                           type="password" id="password" autoComplete="current-password" />

                <Button type="submit" fullWidth variant="contained" sx={{mt: 3, mb: 2}}>
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
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export {Login}