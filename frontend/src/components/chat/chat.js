import { useState, useEffect } from 'react';

import { Box } from '@mui/system';

import { api } from '../common/axios-short';

import { SideChats } from './sidechats';
import { MessageBox } from './messagedisplay';

function Chat(props) {

    const [socket, setsocket] = useState(new WebSocket('ws://127.0.0.1:8000/ws/chat/'));
    const [chats, setchats] = useState({});
    const [chatPage, setchatPage] = useState(1);
    const [messages, setmessages] = useState({});
    const [messagePages, setmessagePages] = useState({});
    const [currentChat, setcurrentChat] = useState(null);

    useEffect(() => {
        api(`/api/chat/?page=${chatPage}`, 'get', {}, true)
            .then((e) => {
                const temp_chats = {};
                e.data.results.forEach(chat => {
                    temp_chats[chat.id] = chat;
                })
                setchats({ ...chats, ...temp_chats });
            })
            .catch((e) => {
                setchatPage(Math.max(chatPage - 1));
            })
    }, [chatPage])


    useEffect(() => {
        socket.onopen = () => {
            console.log("WebSocket connection established.");

            const authToken = localStorage.getItem('token');
            socket.send(JSON.stringify({ action: "authenticate", token: authToken }));
        };
    }, [])

    const addMessages = (newMessages) => {
        if (!newMessages) return;
        
        const chatid = newMessages[0].chat;
        
        if (!messages[chatid]) {
            setmessages({ ...messages, [chatid]: new Set(newMessages) });
            return;
        }

        const isDuplicateMessage = (newMessage) => {
            return [...messages[chatid]].some(message => message.id === newMessage.id);
        }

        const uniqueMessages = newMessages.filter(
            newMessage => !isDuplicateMessage(newMessage)
        );
        setmessages({ ...messages, [chatid]: new Set([...messages[chatid], ...uniqueMessages]) });
    }

    socket.onmessage = (event) => {
        const response = JSON.parse(event.data);

        if (response.type === "authenticate") {
            if (response.status === "success") {
                console.log("Authentication successful.");
            } else {
                console.log("Authentication failed.");
            }
        }
        else if (response.type === "chatregister") {
            console.log("Chat registered. " + currentChat.id);
            setmessagePages({ ...messagePages, [currentChat.id]: 1 });
        }
        else if (response.type === "create") {
            if (!(response.message.chat in chats)) {
                new Promise((resolve, reject) => {
                    api(`/api/chat/${response.message.chat}/`, 'get', {}, true)
                        .then((e) => {
                            resolve(e.data);
                        })
                        .catch((e) => {
                            reject(e);
                        })
                })
                    .then((response) => {
                        setchats({ ...chats, [response.id]: { ...response } });
                    })
                    .catch((e) => {
                        console.log(e);
                    })
            } else {
                addMessages([response.message]);
                setchats({ ...chats, [response.message.chat]: { ...chats[response.message.chat], last_message: response.message } });
            }
        }
    }

    useEffect(() => {
        if (!currentChat || messagePages[currentChat.id] === undefined) return;
        const chatid = currentChat.id;
        api(`/api/message/${currentChat.id}/?page=${messagePages[chatid]}`, 'get', {}, true)
            .then((e) => {
                if (e.data.results.length > 0) {
                    if (messages[chatid] === undefined) {
                        setmessages({ ...messages, [chatid]: new Set(e.data.results) });
                    } else {
                        addMessages(e.data.results);
                    }
                }
            })
            .catch((e) => {
                setmessagePages({...messagePages, [chatid]: Math.max(messagePages[chatid] - 1, 1)})
            })
    }, [messagePages])

    useEffect(() => {
        if (currentChat) {
            socket.send(JSON.stringify({ action: "chatregister", chat: currentChat.id }));
        }
    }, [currentChat])

    return (
        <Box className='d-flex col-12 px-md-4 my-0 my-md-3 flex-grow-1'>
            <SideChats
                chats={chats} setchats={setchats}
                currentChat={currentChat} setcurrentChat={setcurrentChat}
                chatPage={chatPage} setchatPage={setchatPage}
            />
            <MessageBox
                chat={currentChat}
                socket={socket}
                user={props.user}
                messages={messages}
                messagePages={messagePages} setmessagePages={setmessagePages}
            />
        </Box>
    )
}

export { Chat };