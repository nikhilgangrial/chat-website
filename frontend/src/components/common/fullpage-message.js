import {
	Grid,
	Typography,
} from '@mui/material'


function MailSent(props) {
	return (
		<Grid container sx={ {
			marginTop: 8,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
		} }>
			<Typography component="h1" variant="h5">
				{ props.heading }
			</Typography>
			<Grid item xs={ 11 } sm={ 6 } lg={ 4 } component="form" noValidate sx={ { mt: 3, maxWidth: '95%' } }>
				<Typography component="h3" variant="h6" sx={ { textAlign: "center" } }>
					{ props.message }
				</Typography>
			</Grid>
		</Grid>
	);
}

export { MailSent }
