import { useState, useEffect } from 'react';

import { Box } from '@mui/system';

import { api } from '../common/axios-short';

import { SideChats } from './sidechats';
import { MessageBox } from './messagedisplay';

function Chat(props) {

    const [socket, setsocket] = useState(new WebSocket('ws://127.0.0.1:8000/ws/chat/'));
    const [chats, setchats] = useState({});
    const [messages, setmessages] = useState({});
    const [currentChat, setcurrentChat] = useState(null);
    
    useEffect(() => {
        api('/api/chat/', 'get', {}, true)
            .then( (e) => {
                const chats  = {};
                e.data.results.forEach(chat => {
                    chats[chat.id] = chat;
                })
                console.log(chats);
                setchats(chats);
            })
            .catch( (e) => {
                console.log(e);
            })

        socket.onopen = () => {
            console.log("WebSocket connection established.");
    
            const authToken = localStorage.getItem('token');
            socket.send(JSON.stringify({ action: "authenticate", token: authToken }));
        };
    
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);
        }
    }, [])
   
    useEffect ( () => {
        if (currentChat) {
            socket.send(JSON.stringify({ action: "chatregister", chat: currentChat.id }));
        }
    }, [currentChat])

    return (
        <Box className='d-flex col-12 px-md-4 my-0 my-md-3 flex-grow-1'>
            <SideChats chats={chats} setchats={setchats} setcurrentChat={setcurrentChat} currentChat={currentChat}/>
            <MessageBox chat={currentChat} socket={socket}/>
        </Box>
    )
}

export { Chat };