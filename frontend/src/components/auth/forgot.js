import { useNavigate } from 'react-router-dom';

import {
    Button,
    TextField,
    Grid,
    Avatar,
    Typography,
} from '@mui/material'

import { LockOutlined } from "@mui/icons-material";

function ForgotPassword() {
    const navigate = useNavigate();

    return (
        <Grid container sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                <LockOutlined/>
            </Avatar>
            <Typography component="h1" variant="h5">
                Forgot Password
            </Typography>
            <Grid item xs={11} sm={6} lg={4} component="form" noValidate sx={{mt: 4, maxWidth: '95%'}}>
                <TextField  margin="normal" size="small" required fullWidth id="email" label="Email Address"
                            type="email" name="email" autoComplete="email" autoFocus />

                <Button type="submit" fullWidth variant="contained" sx={{mt: 3, mb: 2}}>
                    Send Mail
                </Button>
                <Button onClick={() => { navigate("/auth/login") }} fullWidth variant="outlined" color="error" sx={{ mb: 2}}>
                    Cancel
                </Button>
            </Grid>
        </Grid>
    );
}

export { ForgotPassword }
