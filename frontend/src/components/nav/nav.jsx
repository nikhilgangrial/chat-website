import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

import {
	AppBar,
	Container,
	Drawer,
	Toolbar,
	Typography,
	Box,
	Grid,
	IconButton,
	Menu,
	MenuItem,
	Avatar,
	Button,
	Tooltip,
} from '@mui/material';

import {
	Menu as MenuIcon,
	Forum,
	LightMode as LightModeIcon,
	DarkMode as DarkModeIcon,
} from '@mui/icons-material';


const pages = {
	'About': '/about',
	'Chat': '/chat',
}

const settings = {
	'Profile': '/',
	'Logout': '/auth/logout'
};

function Nav(props) {
	const [anchorElNav, setAnchorElNav] = React.useState(false);
	const [anchorElUser, setAnchorElUser] = React.useState(null);

	const navigate = useNavigate();

	const handleOpenUserMenu = (event) => {
		console.log(event.currentTarget.key);
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const changeTheme = () => {
		if (props.currentTheme === 'light') {
			localStorage.setItem('theme', 'dark');
			props.setTheme('dark');
		} else {
			localStorage.setItem('theme', 'light');
			props.setTheme('light');
		}
	}

	return (
		<AppBar className='d-flex' sx={{position: "inherit"}}>
			<Container maxWidth="xl">
				<Toolbar disableGutters style={{ position: "relative" }}>
					{/* For >= Medium displays */}
					{/* Logo */}
					<>
					<Forum sx={ { display: { xs: 'none', md: 'flex' }, mr: 1 } }/>
					<Typography variant="h6" noWrap component={ RouterLink } to="/"
								sx={ {
									mr: 2,
									display: { xs: 'none', md: 'flex' },
									fontFamily: 'monospace',
									fontWeight: 700,
									color: 'inherit',
									textDecoration: 'none',
								} }
					>
						Chatopia
					</Typography>
					</>

					{/* For extra-small display */}
					{/* Menu */}
					<>
					<Box sx={ { flexGrow: 1, display: { xs: 'flex', md: 'none' } } }>
						<IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar"
									aria-haspopup="true" onClick={ (event) => setAnchorElNav(true) } color="inherit">
							<MenuIcon/>
						</IconButton>
						<Drawer anchor="left" open={ anchorElNav } onClose={ () => { setAnchorElNav(false) } }>
							{
								Object.keys(pages).map((page) =>
									<MenuItem key={ page } onClick={ () => {
											navigate(pages[page])
											setAnchorElNav(false)
										}} sx={ { mt: 1, mx: 2 } }
									>
										<Typography textAlign="center">{ page }</Typography>
									</MenuItem>
								)
							}

						</Drawer>
					</Box>
					</>

					{/* For extra-small display */}
					{/* Logo */}
					<>
					<Grid container item xs={6}
						  style={{
							  position: "absolute",
							  left: 0,
							  right: 0,
							  margin: "auto",
							  alignItems: "center",
							  width: "fit-content",
						  }}>
						<Forum sx={ { display: { xs: 'flex', md: 'none' }, mr: 1 } }/>
						<Typography variant="h5" noWrap component={ RouterLink } to="/"
									sx={ {
										mr: 2,
										display: { xs: 'flex', md: 'none' },
										flexGrow: 0,
										fontFamily: 'monospace',
										fontWeight: 700,
										color: 'inherit',
										textDecoration: 'none',
									} }
						>
							Chatopia
						</Typography>
					</Grid>
					</>

					{/* For >= Medium displays */}
					{/* Menu/Nav buttons */}
					<>
					<Box sx={ { flexGrow: 1, display: { xs: 'none', md: 'flex' } } }>
						{ Object.keys(pages).map((page) => (
							<Button key={ page } onClick={ () => { navigate(pages[page]) } }
								sx={ { my: 2, color: 'white', display: 'block' } }>
								{ page }
							</Button>
						)) }
					</Box>
					</>

					{/* Right Side controls */}
					<>
					<Box sx={ { flexGrow: 0 } }>
						{/* Switch theme */}
						<>
						<Tooltip title="Switch theme">
							<IconButton onClick={ changeTheme } sx={ { p: 0 , mr: 1 } }>
								{ props.currentTheme === "light" && <LightModeIcon style={{color: "white"}}/> }
								{ props.currentTheme === "dark" && <DarkModeIcon/> }
							</IconButton>
						</Tooltip>
						</>

						{ props.user && 
							<Tooltip title="Open settings">
								<IconButton onClick={ handleOpenUserMenu } sx={ { p: 0, mr: 0.5 } }>
									<Avatar alt={props.user.username} src={props.user.profile}>
										{ props.user.username[0].toUpperCase() }
									</Avatar>
								</IconButton>
							</Tooltip>
						}
						{ !props.user && <Button color="inherit" onClick={ () => { navigate('/auth/login') }	}>Login</Button> }

						{/* Profile Logout Menu */}
						<>
						<Menu sx={ { mt: '45px' } } id="menu-appbar" anchorEl={ anchorElUser }
							  anchorOrigin={ { vertical: 'top', horizontal: 'right', } }
								keepMounted transformOrigin={ { vertical: 'top', horizontal: 'right', } }
								open={ Boolean(anchorElUser) }
								onClose={ handleCloseUserMenu }
						>
							{ props.user && Object.keys(settings).map((setting) => (
								<MenuItem key={ setting } onClick={ () => { handleCloseUserMenu(); navigate(settings[setting]) }}>
									<Typography textAlign="center">{ setting }</Typography>
								</MenuItem>
							)) }
						</Menu>
						</>
					</Box>
					</>
				</Toolbar>
			</Container>
		</AppBar>
	)
}

export { Nav }
