import React, { useEffect, useRef, useState } from "react";

import { TextField, Menu, MenuItem, InputAdornment, IconButton } from "@mui/material";
import { Mood, Send } from "@mui/icons-material";

import EmojiPicker from "emoji-picker-react";

import "./picker.css";

function MessageType(props) {
    const [anchorEl, setanchorEl] = useState(null);

    const messagebox = useRef(null);

    const emojiSelect = (emojiObject, event) => {
        document.getElementById('message-text-field').value += emojiObject.emoji;
        messagebox.current.focus();
        setanchorEl(null);
    }

    useEffect(() => {
        document.getElementById('message-text-field').classList.add('py-2');
    }, [])

    const sendMessage = async () => {
        const message = document.getElementById('message-text-field');
        if (message.value === "") return;

        props.socket.send(JSON.stringify({ action: "create", message: message.value }))
        message.value = "";
    }

    return (
        <div className='d-flex'>
            <Menu
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => { setanchorEl(null) }}
                className="p-0 m-0"
            >
                <MenuItem>
                    <EmojiPicker theme={localStorage.getItem('theme')} emojiStyle="native" onEmojiClick={emojiSelect} />
                </MenuItem>
            </Menu>

            <TextField
                type="textarea"
                multiline
                size="small"
                id="message-text-field"
                ref={messagebox}
                onKeyDown={(e) => { console.log(e.key); if (e.key === 'Enter') { e.preventDefault(); sendMessage() } }}
                placeholder="Type a message..."
                fullWidth
                InputProps={{
                    startAdornment:
                        <InputAdornment position="start" className="m-0">
                            <IconButton onClick={(e) => { setanchorEl(e.currentTarget) }}>
                                <Mood />
                            </IconButton>
                        </InputAdornment>,
                    endAdornment:
                        <InputAdornment position="end" className="mx-2">
                            <IconButton onClick={ sendMessage }>
                                <Send />
                            </IconButton>
                        </InputAdornment>,
                }}
            />
        </div>
    )
}

export { MessageType };