import { useState, useRef, useEffect } from "react";

import { api } from "../common/axios-short";

import { ChatCard } from "./chatcard";

import { Search } from "./search";

import { Box, Typography, Button, Fab } from "@mui/material";
import { Add } from "@mui/icons-material";

import { SearchFullScreen } from "./searchfullscreen";


function SideChats(props) {

    const [visiblechats, setvisiblechats] = useState(null)
    const [addChat, setaddChat] = useState(false)
    const [searchChat, setsearchChat] = useState(false)
    const chatbox = useRef(null);
    const [loading, setLoading] = useState(false);

    const loadChats = () => {
        setLoading(true);
        props.setchatPage(props.chatPage + 1);
        setTimeout(() => { setLoading(false) }, 200);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (loading) return;

            const { scrollTop, clientHeight, scrollHeight } = chatbox.current;

            // Check if the scroll is at the bottom of the container
            if (scrollTop + clientHeight >= scrollHeight) {
                loadChats();
            }
        };

        chatbox.current.addEventListener('scroll', handleScroll);

    }, [loading, props.chatPage]);


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
            <Typography sx={{ border: 1, borderColor: "divider" }} className="d-flex justify-content-center justify-content-md-between align-items-baseline w-100 py-2 px-1 px-md-3" variant="h5" >
                <span className="d-none d-md-block">Chats</span>
                <Fab
                    onClick={() => setaddChat(true)}
                    color="primary"
                    size="small"
                >
                    <Add />
                </Fab>
            </Typography>

            <SearchFullScreen
                open={searchChat}
                component={'ChatCard'}
                title={'Search Chats'}
                url={'/api/chat/'}
                attribute={'chat'}
                onClose={() => setsearchChat(false)}
                childprops={{ currentChat: props.currentChat, setcurrentChat: props.setcurrentChat, isfull: true }}
            />

            <SearchFullScreen
                open={addChat}
                component={'UserCard'}
                title={'Add Chat'}
                url={'/auth/users/list/'}
                attribute={'user'}
                onClose={() => setaddChat(false)}
                onSelect={async (user) => {
                    if (!user) { return }

                    await api(`/api/chat/`, 'post', { members: [user.id] }, true)
                        .then(async (e) => {
                            console.log(e.data);
                            await props.setchats({ ...props.chats, [e.data.id]: e.data });
                            await props.setcurrentChat(props.chats[e.data.id]);
                        })
                        .catch(async (e) => {
                            const err = e.response.data.non_field_errors;
                            if (err && err[0] === "A chat with the same members already exists.") {
                                await props.setchats({ ...props.chats, [e.response.data.chat.id]: e.response.data.chat });
                                await props.setcurrentChat(props.chats[e.response.data.chat.id]);
                            }
                        })
                }}
            />


            <Search size="small" onChange={searchUpdate} smallOnClick={() => setsearchChat(true)} />

            <div id="chats" className="d-flex col-12 flex-grow-1 position-relative">
                <div id="chats" ref={chatbox} className="d-flex position-absolute flex-column overflow-auto h-100 col-12 ">
                    {chats ?
                        chats.map((chat) => {
                            return <ChatCard key={chat.id} chat={chat} currentChat={props.currentChat} setcurrentChat={props.setcurrentChat} />
                        }) : <Typography className="w-100 py-2 px-4" variant="h6" >No chats.</Typography>
                    }
                    {!visiblechats &&
                        <Button color="primary" fullWidth onClick={() => props.setchatPage(props.chatPage + 1)}>
                            Load More
                        </Button>
                    }
                </div>
            </div>
        </Box >
    )
}

export { SideChats }; 