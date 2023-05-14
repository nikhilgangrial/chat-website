import { useState } from "react";

import { api } from "../common/axios-short";
import { ChatCard } from "./chatcard"
import { Search } from "./search";

import { Box, Typography, Button } from "@mui/material";

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
                <Typography sx={{ border: 1, borderColor: "divider" }} className="d-none d-md-block w-100 py-2 px-1 px-md-4" variant="h5" >Chats</Typography>

                <Search size="small" onChange={searchUpdate} />

                <div id="chats" className="d-flex flex-column overflow-auto flex-grow-1">
                    {chats ?
                        chats.map((chat) => {
                            return <ChatCard key={chat.id} chat={chat} currentChat={props.currentChat} setcurrentChat={props.setcurrentChat} />
                        }) : <Typography className="w-100 py-2 px-4" variant="h6" >No chats.</Typography>
                    }
                </div>
                <Button color="primary" fullWidth onClick={() => props.setchatPage(props.chatPage + 1) }>
                    Load More
                </Button>
            </div>
        </Box>
    )
}

export { SideChats }; 