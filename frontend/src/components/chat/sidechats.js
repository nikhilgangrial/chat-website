import { useState } from "react";

import { api } from "../common/axios-short";
import { ChatCard } from "./chatcard"
import { Search } from "./search";

import { Box, Typography, Button, Fab, IconButton } from "@mui/material";
import { Add } from "@mui/icons-material";

function SideChats(props) {

    const [visiblechats, setvisiblechats] = useState(null)

    const searchUpdate = async (e, value) => {
        if (!value) {
            value = e.target.value;
            console.log(e.target.value)
        }

        if (value.length > 0) {

            await api(`/api/chat/?search=${value}`, 'get', {}, true)
                .then((e) => {
                    console.log(e.data.results);
                    const chats = {};
                    e.data.results.forEach(chat => {
                        chats[chat.id] = chat;
                    })

                    setvisiblechats(chats);
                    props.setchats({ ...props.chats, ...chats });
                })
                .catch((e) => {
                    console.log(e);
                })
        } else {
            setvisiblechats(null);
        }
    }

    const chats = [];
    if (visiblechats) {
        Object.keys(visiblechats).forEach(chat => {
            chats.push(visiblechats[chat]);
        })
    } else {
        Object.keys(props.chats).forEach(chat => {
            chats.push(props.chats[chat]);
        })
    }

    chats.sort((a, b) => {
        return b.last_message.sent_at.localeCompare(a.last_message.sent_at);
    });


    return (
        <Box sx={{ border: 1, borderColor: "divider" }} className='d-flex flex-column col-md-3 col-2'>
            <div className='w-100'>
                <Typography sx={{ border: 1, borderColor: "divider" }} className="d-flex justify-content-center justify-content-md-between align-items-baseline w-100 py-2 px-1 px-md-3" variant="h5" >
                    <span className="d-none d-md-block">Chats</span>
                    <Fab
                        color="primary"
                        size="small"
                    >
                        <Add />
                    </Fab>
                </Typography>

                <Search size="small" onChange={searchUpdate} />

                <div id="chats" className="d-flex flex-column overflow-auto flex-grow-1">
                    {chats ?
                        chats.map((chat) => {
                            return <ChatCard key={chat.id} chat={chat} currentChat={props.currentChat} setcurrentChat={props.setcurrentChat} />
                        }) : <Typography className="w-100 py-2 px-4" variant="h6" >No chats.</Typography>
                    }
                </div>
                {!visiblechats &&
                    <Button color="primary" fullWidth onClick={() => props.setchatPage(props.chatPage + 1)}>
                        Load More
                    </Button>
                }
            </div>
        </Box>
    )
}

export { SideChats }; 