import { Avatar, Box, Typography } from '@mui/material'
import { MessageType } from './messagesend';

function MessageBox(props) {

    const sendMessage = async () => {
        const message = document.getElementById('message').value;
        props.socket.send(JSON.stringify({ action: "create", message: message }))
    }

    return (
        <Box sx={{ border: 1, borderColor: 'divider' }} className='d-flex flex-column col-md-9 col-10 justify-content-between'>
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
                    End controls
                </div>
            </Box>
            <Box sx={{ border: 1, borderColor: 'divider' }} className='d-flex flex-column justify-content-end w-100 p-2 flex-grow-1' style={{ overflowY: "scroll" }}>
                { props.chat ?
                    <div>
                        Messages
                    </div>
                    : <Typography className="mx-1 text-center h-50" variant="h6" >No chat selected.</Typography>
                }
            </Box>

            <Box sx={{ border: 1, borderColor: 'divider' }} className='d-flex flex-column w-100 py-2 px-2'>
                { props.chat ?
                    <MessageType socket={props.socket}/>
                    : <Typography className="mx-1" variant="h6" >Select Chat to Send Messages.</Typography>
                }
            </Box>
        </Box>
    )
}

export { MessageBox };