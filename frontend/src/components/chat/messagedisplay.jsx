import { useEffect, useRef, useState } from 'react';

import { Avatar, Box, Typography, Button } from '@mui/material'
import { MessageType } from './messagesend';
import { MessageCard } from './messagecard';

function MessageBox(props) {

    const msgbox = useRef(null);
    const [loading, setLoading] = useState(false);

    const loadMessages = () => {
        setLoading(true);
        props.setmessagePages({ ...props.messagePages, [props.chat.id]: props.messagePages[props.chat.id] + 1 });
        setTimeout(() => { setLoading(false) }, 200);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (loading || props.messagePages[props.chat.id] === -1) return;

            const { scrollTop, clientHeight, scrollHeight } = msgbox.current;

            // Check if the scroll is at the bottom of the container
            if (-scrollTop + clientHeight >= scrollHeight) {
                loadMessages();
            }
        };

        msgbox.current.addEventListener('scroll', handleScroll);

        return () => {
            msgbox.current.removeEventListener('scroll', handleScroll);
        };
    }, [loading, props.chat, props.messagePages]);


    return (
        <Box sx={{ border: 1, borderColor: 'divider' }} className='d-flex flex-column col-md-9 col-10 h-100 justify-content-between'>
            <Box sx={{ border: 1, borderColor: 'divider' }} className='d-flex direction-row w-100 py-2 px-2 px-md-4 justify-content-between align-items-center'>
                {props.chat ?
                    <div className="d-flex flex-row align-items-center">
                        <Avatar alt={props.chat.name} src={props.chat.profile}>
                            {props.chat.name[0].toUpperCase()}
                        </Avatar>
                        <Typography className="mx-2" variant="h5" >{props.chat.name}</Typography>
                    </div>
                    : <Typography className="mx-1" variant="h5" >Messages</Typography>
                }
                <div>
                    {/* End controls */}
                </div>
            </Box>
            <div className='flex-grow-1' style={{ position: "relative" }}>
                <Box sx={{ border: 1, borderColor: 'divider', position: "absolute" }} ref={msgbox} className="d-flex flex-column-reverse align-items-end w-100 h-100 overflow-auto">
                    {
                        props.chat ?
                            props.messages[props.chat.id] ?
                                [...props.messages[props.chat.id]]
                                    .sort((a, b) => {
                                        return b.sent_at.localeCompare(a.sent_at);
                                    })
                                    .map((message, index) => {
                                        return <MessageCard key={message.id} message={message} />
                                    })
                                : <Typography className="mx-1 text-center h-50 align-self-center verical-center" variant="h6" >No messages Yet.</Typography>
                            : <Typography className="mx-1 text-center h-50 align-self-center verical-center" variant="h6" >No chat selected.</Typography>
                    }
                </Box>
            </div>

            <Box sx={{ border: 1, borderColor: 'divider' }} className='d-flex flex-column col-12 py-2 px-2'>
                {props.chat ?
                    <MessageType socket={props.socket} />
                    : <Typography className="mx-1" variant="h6" >Select Chat to Send Messages.</Typography>
                }
            </Box>
        </Box>
    )
}

export { MessageBox };