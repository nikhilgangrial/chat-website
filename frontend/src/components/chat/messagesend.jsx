import React, { useRef, useState } from "react";

import { TextField, Menu, MenuItem, IconButton } from "@mui/material";
import { Mood, Send } from "@mui/icons-material";

import EmojiPicker from "emoji-picker-react";

import "./picker.css";

function MessageType(props) {
    const [anchorEl, setanchorEl] = useState(null);
    const [theme, setheme] = useState(localStorage.getItem('theme'));

    const messagebox = useRef(null);

    const emojiSelect = (emojiObject, event) => {
        document.getElementById('message-text-field').value += emojiObject.emoji;
        messagebox.current.focus();
        setanchorEl(null);
    }

    const sendMessage = async () => {
        const message = document.getElementById('message-text-field');
        if (message.value.trim() === "") return;

        props.socket.send(JSON.stringify({ action: "create", message: message.value.trim() }))
        message.value = "";
    }

    return (
        <div className='d-flex align-items-baseline'>
            <Menu
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => { setanchorEl(null); setheme(localStorage.getItem('theme')) }}
                className="no-margin"
            >
                <MenuItem>
                    <EmojiPicker className="no-margin" theme={theme} emojiStyle="native" onEmojiClick={emojiSelect} />
                </MenuItem>
            </Menu>

            <IconButton onClick={(e) => { setanchorEl(e.currentTarget) }}>
                <Mood />
            </IconButton>

            <TextField  
                multiline
                size="small"
                id="message-text-field"
                maxRows={5}
                ref={messagebox}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                placeholder="Type a message..."
                fullWidth
            />

            <IconButton onClick={sendMessage}>
                <Send />
            </IconButton>
        </div>
    )
}

export { MessageType };