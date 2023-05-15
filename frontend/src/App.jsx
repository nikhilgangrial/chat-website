import './App.css';
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

import { Nav } from './components/nav/nav';

import { api } from './components/common/axios-short'

import { Dashbord } from './components/auth/dashbord';
import { Login } from './components/auth/login';
import { Logout } from './components/auth/logout';
import { Signup } from './components/auth/signup';
import { ActivateAccount } from './components/auth/activate'
import { ForgotPassword } from './components/auth/forgot'
import { ResetPassword } from './components/auth/reset'
import { MailSent } from "./components/common/fullpage-message";
import { Chat } from "./components/chat/chat"

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
	palette: {
		mode: 'dark',
	},
});
const lightTheme = createTheme({
	palette: {
		mode: 'light',
	},
});

const themes = {
	light: lightTheme,
	dark: darkTheme
}

function App() {

	const [currentTheme, setTheme] = useState('light')

	const [userupdated, setuserupdated] = useState(false)
	const [user, setuser] = useState(null)
	const [entries, setentries] = useState({})

	const callback = (e) => {
		setentries({ ...entries, ...e })
	}

	useEffect(() => {
		console.log('userupdated')
		setuser(JSON.parse(localStorage.getItem('user')))
		setuserupdated(false)
		if (entries.dashboard_form) {
			entries.dashboard_form.reset()
		}
	}, [userupdated])


	useEffect(() => {

		if (localStorage.getItem('user')) {
			api('/auth/users/me/', 'get', {}, true)
				.then((response) => {
					localStorage.setItem('user', JSON.stringify(response.data))
					setuserupdated(true)
				})
				.catch(() => {
					localStorage.removeItem('user')
					localStorage.removeItem('token')
				})
		} else {
			localStorage.removeItem('user')
			localStorage.removeItem('token')
		}

		// To get theme
		const autoTheme = () => {
			if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
				setTheme('dark')
				setTheme(localStorage.setItem('theme', 'dark'));
			} else {
				setTheme('light')
				setTheme(localStorage.setItem('theme', 'light'));
			}
		}

		if (!localStorage.getItem('theme')) {
			autoTheme()
		} else {
			try {
				setTheme(localStorage.getItem('theme'));
			} catch (e) {
				autoTheme()
			}
		}
	}, [])

	return (
		<ThemeProvider theme={themes[currentTheme]}>
			<CssBaseline />
			<BrowserRouter>
				<Nav currentTheme={currentTheme} setTheme={setTheme} user={user} />
				<Routes>
					{/* Auth */}
					<>

						{/* Login */}
						<>
							<Route path="/auth/login" element={user ? <Dashbord setuserupdated={setuserupdated} user={user} callback={callback} /> : <Login setuserupdated={setuserupdated} />} />
						</>

						{/* Home */}
						<>
							<Route path="/" element={user ? <Dashbord setuserupdated={setuserupdated} user={user} callback={callback} /> : <Login setuserupdated={setuserupdated} />} />
						</>

						{/* Logout */}
						<>
							<Route path="/auth/logout" element={<Logout userupdated={userupdated} setuserupdated={setuserupdated} />} />
						</>

						{/* Signup and Signup complete */}
						<>
							<Route path="/auth/signup/completed" element={
								<MailSent heading="Activation Required"
									message="An activation link has been sent to your email.
                                  Please continue to activate account."
								/>
							} />
							{!user && <Route path="/auth/signup" element={<Signup setuserupdated={setuserupdated} />} />}
						</>

						{/* Activate and Activate complete */}
						<>
							<Route path="/auth/activate/completed" element={
								<MailSent heading="Account Activated"
									message="Your account has been activated you can close this tab
								  and continue to sign in."
								/>
							} />
							<Route path="/auth/activate/:uid/:token" element={<ActivateAccount />} />
						</>

						{/* Forgot and Forgot complete */}
						<>
							<Route path="/auth/forgot/completed" element={
								<MailSent heading="Instructions Sent to Mail"
									message="A password reset has been sent to your email.
                                  Please continue to reset password account"
								/>
							} />
							<Route path="/auth/forgot" element={<ForgotPassword />} />
						</>

						{/* Reset Password and Reset Password complete */}
						<>
							<Route path="/auth/password/reset/completed" element={
								<MailSent heading="Password Changed"
									message="Your account's password has been changed successfully.
                                  You can close this tab and continue to login."
								/>
							} />
							<Route path="/auth/password/reset/:uid/:token" element={<ResetPassword />} />
						</>
					</>

					{/* Chat */}
					<>
						<>
							{user && <Route path='/chat' element={<Chat user={user} />} />}
						</>
					</>
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
