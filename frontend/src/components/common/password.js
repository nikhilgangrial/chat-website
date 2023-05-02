import { useState } from "react";

import { 
    TextField,
    InputAdornment,
    IconButton,
 } from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function Password(props) {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    const {...pprops} = props;

    return (
        <TextField
            {...pprops}
            type={showPassword ? "text" : "password"} // <-- This is where the magic happens
            InputProps={{ // <-- This is where the toggle button is added.
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                        >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
    );
}

export default Password;