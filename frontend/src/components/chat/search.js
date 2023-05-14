import { TextField, IconButton } from '@mui/material';
import{ SearchOutlined } from '@mui/icons-material';

function Search(props) {

    return (
        <div className='p-2 w-100'>
            <TextField
                className='m-auto w-100 d-none d-md-flex'
                size={props.size ? props.size : "medium"}
                onChange={(event, value) => { props.onChange(event, value) } }
                id={props.id ? props.id : "search"}
                label="Search.."
            />

            <IconButton color='primary' component="label" className='d-block d-md-none'>
                <SearchOutlined/>
            </IconButton>
        </div>
    )
}

export { Search };