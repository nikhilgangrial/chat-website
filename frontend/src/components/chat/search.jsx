import { TextField, Typography, Fab } from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';

function Search(props) {

    return (
        <>
            <div className='p-md-2 w-100'>
                <TextField
                    className='m-auto w-100 d-none d-md-flex'
                    size={props.size ? props.size : "medium"}
                    onChange={(event, value) => { props.onChange(event, value) }}
                    id={props.id ? props.id : "search"}
                    label="Search.."
                />
            </div>
            <Typography className="d-flex d-md-none justify-content-center justify-content-md-between align-items-baseline w-100 py-2 px-1 px-md-3" variant="h5" >
                <Fab
                    onClick={props.smallOnClick}
                    color="primary"
                    size="small"
                    variant='outlined'
                >
                    <SearchOutlined/>
                </Fab>
            </Typography>
        </>
    )
}

export { Search };