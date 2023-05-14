import { Card, Typography, Avatar, IconButton, Item } from '@mui/material'
import { parseDate } from '../common/parseDate';

function ChatCard(props) {
    const handleSwitchChat = () => {
        props.setcurrentChat(props.chat);
    }

    return (
        <Card sx={{ backgroundColor: (props.currentChat && props.currentChat.id === props.chat.id) ? "action.focus" : "" }} variant='outlined' onClick={handleSwitchChat} className='d-flex w-100 py-2 hover'>
            <div className="d-flex flex-row px-2 w-100 align-items-center justify-content-center justify-content-md-start">

                <IconButton sx={{ p: 0, mr: 0.5 }} className='col-2'>
                    <Avatar alt={props.chat.name} src={props.chat.profile}>
                        {props.chat.name[0].toUpperCase()}
                    </Avatar>
                </IconButton>

                <div className='d-none d-md-flex flex-md-column col-10'>
                    <Typography className='mx-2 text-truncate'>{props.chat.name}</Typography>
                    <Typography className='d-flex justify-content-between align-items-baseline px-2'>

                        {props.chat.last_message ?
                            <>
                                <span style={{ opacity: 0.5 }} className='text-truncate'>
                                    {props.chat.last_message.message}
                                </span>
                                <span style={{ opacity: 0.5 }}>
                                    {parseDate(props.chat.last_message.sent_at).split(' ')[0]}
                                </span>
                            </>
                            : <span style={{ opacity: 0.5, fontSize: "small", lineHeight: "0.8" }}>Start Chat</span>

                        }
                    </Typography>
                </div>
            </div>
        </Card>
    )
}

export { ChatCard };