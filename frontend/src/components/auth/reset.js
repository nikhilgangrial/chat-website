import {
    Button,
    TextField,
    Grid,
    Avatar,
    Typography,
} from '@mui/material'

import { LockOutlined } from "@mui/icons-material";

function ResetPassword() {
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
                Create New Password
            </Typography>
            <Grid item xs={11} sm={6} lg={4} component="form" noValidate sx={{mt: 1, maxWidth: '95%'}}>

                <TextField margin="normal" size="small" required fullWidth name="password" label="New Password"
                           type="password" id="password" autoComplete="current-password" />
                <TextField margin="normal" size="small" required fullWidth name="re_password" type="password"
                           label="Confirm New Password" id="re_password" autoComplete="current-password" />

                <Button type="submit" fullWidth variant="contained" sx={{mt: 3, mb: 2}}>
                    Reset Password
                </Button>

            </Grid>
        </Grid>
    );
}

export { ResetPassword }
