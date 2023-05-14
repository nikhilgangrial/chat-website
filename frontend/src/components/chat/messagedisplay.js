import { Avatar, Box, Typography } from '@mui/material'
import { MessageType } from './messagesend';
import { MessageCard } from './messagecard';

function MessageBox(props) {

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
                <Box sx={{ border: 1, borderColor: 'divider', position: "absolute" }} className="d-flex flex-column-reverse align-items-end w-100 h-100 overflow-auto">
                    {props.chat ?
                        props.messages[props.chat.id] &&
                        [...props.messages[props.chat.id]]
                            .sort((a, b) => {
                                return b.sent_at.localeCompare(a.sent_at);
                            })
                            .map((message, index) => {
                                return <MessageCard key={index} message={message} />
                            })
                        : <Typography className="mx-1 text-center h-50 align-self-center verical-center" variant="h6" >No chat selected.</Typography>
                    }
                </Box>
            </div>

            <Box sx={{ border: 1, borderColor: 'divider' }} className='d-flex flex-column w-100 py-2 px-2'>
                {props.chat ?
                    <MessageType socket={props.socket} />
                    : <Typography className="mx-1" variant="h6" >Select Chat to Send Messages.</Typography>
                }
            </Box>
        </Box>
    )
}

export { MessageBox };