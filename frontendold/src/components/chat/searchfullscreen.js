import React, { useRef, useState } from "react";

import { Backdrop, TextField, Typography } from "@mui/material";

import { ChatCard } from "./chatcard";
import { UserCard } from "./usercard";

import { api } from "../common/axios-short";


function SearchFullScreen(props) {

    const [options, setoptions] = useState([]);
    const Component = { 'ChatCard': ChatCard, 'UserCard': UserCard, 'div': React.div }[props.component];
    const attribute = props.attribute ? props.attribute : 'children';

    const seachbox = useRef(null);

    const searchUpdate = async (e, value) => {

        const query = value ? value : e.target.value;

        await api(`${props.url}?search=${query}`, 'get', {}, true)
            .then((res) => {
                console.log(res.data.results);
                setoptions(res.data.results);
            })
            .catch((e) => {
                console.log(e);
            })
    }

    const optionSelect = (e) => {
        e.preventDefault();
        e.stopPropagation();
        props.onSelect && props.onSelect(JSON.parse(e.currentTarget.title))
        handleClose(e);
    }

    const handleClose = (e) => {
        seachbox.current.value = '';
        setoptions([]);
        props.onClose(e);
    }

    return (
        <Backdrop open={props.open} onClick={props.onClose} onClose={handleClose}
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, opacity: 0.75, "alignItems": "start" }}
        >

            <div className={'flex-column col-10 col-md-6 d-flex mt-5'} onClick={(e) => { e.preventDefault(); e.stopPropagation() }}>
                <Typography variant="h6" className="text-center">{props.title}</Typography>
                < div className='d-flex flex-row w-100 mt-4'>
                    <TextField
                        ref={seachbox}
                        autoFocus
                        fullWidth
                        size="small"
                        sx={{ borderRadius: 1, backgroundColor: 'background.paper', opacity: 0.95 }}
                        placeholder='Search'
                        onChange={searchUpdate}
                    />
                </div>

                <div className='d-flex flex-column w-100 flex-grow-1'>
                    {
                        options.map((option, index) => {
                            return (
                                <div key={index} className='d-flex flex-row w-100' onClick={optionSelect} title={JSON.stringify(option)}>
                                    {React.createElement(Component, { ...props.childprops, [attribute]: option })}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </Backdrop >
    )
}

export { SearchFullScreen };