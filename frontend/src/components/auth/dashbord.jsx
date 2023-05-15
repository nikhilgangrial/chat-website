import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { api } from '../common/axios-short'

import { TextField, FormLabel, Button } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

import './dashbord.css'

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});


function Dashbord(props) {

    const [errors, seterrors] = useState({});
    const formref = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        const formData = new FormData(form);

        const body = Object.fromEntries(formData.entries());
        const local = props.user;

        const keys = Object.keys(body);
        for (let i in keys) {
            const key = keys[i];
            
            if (body[key] === local[key]) {
                delete body[key];
            }
            if (typeof body[key] === 'object') {
                console.log(key);
                if (document.getElementById(key + "-display").value === local[key]) {
                    delete body[key];
                    console.log(key + " deleted");
                }
                else if (body[key].name === '' || body[key].size === 0) {
                    body[key] = null;
                    console.log(key + " null");
                }
                else {
                    body[key] = await toBase64(body[key]);
                    console.log(key + " base64");
                    console.log(body[key]);
                }
            }
        }

        props.callback({ dashboard_form: formref.current })
        
        api(
            '/auth/users/me/',
            'patch',
            body,
            true,
        ).then((response) => {
            localStorage.setItem('user', JSON.stringify(response.data));
            seterrors({});
            props.setuserupdated(true);
        }).catch((error) => {
            if (error.response.data.non_field_errors) {
                alert(error.response.data.non_field_errors);
            }
            seterrors(error.response.data)
        });
    }

    return (
        <div className="d-flex gap-1 mt-1 flex-column col-12 align-items-center">

            <h1 className="h1 text-center mb-5">Dashbord</h1>

            <form ref={formref} onSubmit={handleSubmit}
                className="d-flex px-4 flex-column justify-content-center align-items-center flex-nowrap w-100 pd-5">

                <div className="d-flex flex-column col-12 col-md-5">
                    <FormLabel>Email</FormLabel>
                    <TextField
                        className="mt-0"
                        id="email"
                        name="email"
                        type="email"
                        variant="outlined"
                        margin="normal"
                        disabled
                        value={props.user.email}
                        size="small"
                        helperText={errors.email}
                        error={errors.email ? true : false}
                    />
                </div>

                <div className="d-flex flex-column col-12 col-md-5">
                    <FormLabel>Username</FormLabel>
                    <TextField
                        className="mt-0"
                        id="username"
                        name="username"
                        type="text"
                        variant="outlined"
                        margin="normal"
                        defaultValue={props.user.username}
                        size="small"
                        helperText={errors.username}
                        error={errors.username ? true : false}
                    />
                </div>

                <div className="d-flex flex-column col-12 col-md-5">
                    <FormLabel >Phone no</FormLabel>
                    <TextField
                        className="mt-0"
                        id="phone_no"
                        name="phone_no"
                        type="text"
                        variant="outlined"
                        margin="normal"
                        defaultValue={props.user.phone_no}
                        size="small"
                        helperText={errors.phone_no}
                        error={errors.phone_no ? true : false}
                    />
                </div>

                <div className="py-2 d-flex flex-column col-12 col-md-5">
                    <FormLabel>Profile</FormLabel>
                    <TextField
                        id="profile-display"
                        type="label"
                        size="small"
                        variant="outlined"
                        defaultValue={props.user.profile}
                        disabled
                        InputProps={{
                            startAdornment: (
                                <Button variant="contained" component="label" size="small" startIcon={<CloudUpload />} className='m-0 px-4'>
                                    Upload
                                    <input
                                        type="file"
                                        id="profile"
                                        name="profile"
                                        hidden onChange={(e) => {
                                            document.getElementById('profile-display').value = e.currentTarget.value
                                        }}
                                    />
                                </Button>
                            ),
                        }}
                        helperText={errors.profile}
                        error={errors.profile ? true : false}
                    />
                </div>

                <div className="py-2 d-flex flex-column col-12 col-md-5">
                    <FormLabel>Cover</FormLabel>
                    <TextField
                        id="cover-display"
                        type="label"
                        size="small"
                        variant="outlined"
                        disabled
                        defaultValue={props.user.cover}
                        InputProps={{
                            startAdornment: (
                                <Button variant="contained" component="label" size="small" startIcon={<CloudUpload />} className='m-0 px-4'>
                                    Upload
                                    <input
                                        type="file"
                                        id="cover"
                                        name="cover"
                                        hidden onChange={(e) => {
                                            document.getElementById('cover-display').value = e.currentTarget.value
                                        }}
                                    />
                                </Button>
                            ),
                        }}
                        helperText={errors.cover}
                        error={errors.cover ? true : false}
                    />
                </div>

                <Button variant="contained" size="small" type="submit" className="col-12 col-md-5 mx-auto mt-4"> Save Changes </Button>

                <Button variant="outlined" color="error" size="small" type="reset" className="col-12 col-md-5 mx-auto mt-2"> reset </Button>
            </form >
        </div >
    )
}

export { Dashbord };