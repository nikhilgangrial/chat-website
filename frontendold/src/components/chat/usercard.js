import { Card, Typography, Avatar, IconButton } from '@mui/material'


function UserCard(props) {

    return (
        <Card variant='outlined' onClick={props.onClick} className='d-flex w-100 py-2 hover'>
            <div className="d-flex flex-row px-2 w-100 align-items-center justify-content-center justify-content-md-start">
                <div className='d-flex col-2 justify-content-center'>
                    <Avatar className="hover" alt={props.user.username} src={props.user.profile}>
                        {props.user.username[0].toUpperCase()}
                    </Avatar>
                </div>

                <div className="d-flex flex-column col-10">
                    <Typography className='mx-2 text-truncate'>{props.user.username}</Typography>
                    <Typography className='d-flex justify-content-between align-items-baseline px-2'>

                        <>
                            <a href={'mailto:' + props.user.email} style={{ opacity: 0.5 }} className='text-truncate'>
                                {props.user.emial}
                            </a>
                        </>

                    </Typography>
                </div>
            </div>
        </Card>
    )
}

export { UserCard };