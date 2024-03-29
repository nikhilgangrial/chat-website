import { useNavigate } from 'react-router-dom';

import {
    Button,
    TextField,
    Box,
    Avatar,
    Typography,
} from '@mui/material'

import { LockOutlined } from "@mui/icons-material";

function ForgotPassword() {
    const navigate = useNavigate();

    return (
        <Box className="container d-flex mt-5 flex-column justify-content-center align-items-center">
            <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                <LockOutlined/>
            </Avatar>
            <Typography component="h1" variant="h5">
                Forgot Password
            </Typography>
            <Box className='col-12 col-md-6 col-lg-5 mt-4' component="form">

                <TextField  margin="normal" size="small" required fullWidth id="email" label="Email Address"
                            type="email" name="email" autoComplete="email" autoFocus />

                <Button type="submit" fullWidth variant="contained" sx={{mt: 3, mb: 2}}>
                    Send Mail
                </Button>
                <Button onClick={() => { navigate("/auth/login") }} fullWidth variant="outlined" color="error" sx={{ mb: 2}}>
                    Cancel
                </Button>
            </Box>
        </Box>
    );
}

export { ForgotPassword }
