import { Card, Typography, Avatar, IconButton, Item } from '@mui/material'


function ChatCard(props) {
    const handleSwitchChat = () => {
        props.setcurrentChat(props.chat);
    }

    return (
        <Card sx={{ backgroundColor: (props.currentChat && props.currentChat.id === props.chat.id) ? "action.focus": ""  }} variant='outlined' onClick={handleSwitchChat} className='d-flex w-100 py-2 hover'>
            <div className="d-flex flex-row px-2 w-100 align-items-center justify-content-center justify-content-md-start">

                <IconButton sx={{ p: 0, mr: 0.5 }}>
                    <Avatar alt={props.chat.name} src={props.chat.profile}>
                        {props.chat.name[0].toUpperCase()}
                    </Avatar>
                </IconButton>

                <div className='d-none d-md-flex flex-md-column'>
                    <Typography className='mx-2'>{props.chat.name}</Typography>
                    <Typography className='mx-2'>
                        
                            {props.chat.last_message ? 
                                <span style={{opacity: 0.5, fontSize: "small", lineHeight: "0.8"}} >
                                        `${props.message.last_message.time}: ${props.chat.last_message.message}`
                                </span>
                                : <span style={{opacity: 0.5, fontSize: "small", lineHeight: "0.8"}}>Start Chat</span>

                            }
                    </Typography>
                </div>
            </div>
        </Card>
    )
}

export { ChatCard };