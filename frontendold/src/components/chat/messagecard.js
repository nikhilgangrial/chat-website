import { Avatar, Card, Typography } from '@mui/material';
import { HOST } from '../common/constants'
import { parseDate } from '../common/parseDate';


function MessageCard(props) {

    return (
        <Card variant="outlined" className='d-flex flex-row hover align-items-top p-1 flex-shrink-0 col-12'>
            <div className='m-2'>
                <Avatar
                    alt={props.message.author.username}
                    src={props.message.author.profile && props.message.author.profile[0] === 'h' ? props.message.author.profile : HOST + props.message.author.profile}
                >
                    {props.message.author.username[0].toUpperCase()}
                </Avatar>
            </div>

            <div className='d-flex flex-column w-auto flex-shrink-1'>
                <div className='d-flex align-items-baseline'>
                    <Typography variant='label' className='mx-2'>
                        {props.message.author.username}
                    </Typography>
                    <i className='mx-1' style={{ opacity: 0.75, fontSize: 'small' }}>
                        {parseDate(props.message.sent_at)}
                    </i>
                </div>
                <div
                    style={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        overflow: 'hidden',
                    }}
                    className='d-flex col-12 px-2'
                >
                    {props.message.message.trim()}
                </div>
            </div>
        </Card>

    )
}

export { MessageCard };