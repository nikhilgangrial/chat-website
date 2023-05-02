import './App.css';
import { useEffect, useState } from "react";
import { Routes, Route, redirect } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

import { Nav } from './components/nav/nav';

import { api } from './components/common/axios-short'

import { Login } from './components/auth/login';
import { Logout } from './components/auth/logout';
import { Signup } from './components/auth/signup';
import { ActivateAccount } from './components/auth/activate'
import { ForgotPassword } from './components/auth/forgot'
import { ResetPassword } from './components/auth/reset'
import { MailSent } from "./components/common/fullpage-message";

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
	const [islogin, setlogin] = useState(false)
	const [isuser, setuser] = useState(false)

	const notlogin = () => {
		localStorage.removeItem('user')
		localStorage.removeItem('token')
		if (islogin){
			setlogin(false)
		}
		if (isuser){
			setuser(false)
		}
	}

	// To get login status
	if (localStorage.getItem('token')) {
		api('/auth/users/me/', 'get', {}, true)
			.then((response) => {
				localStorage.setItem('user', JSON.stringify(response.data))
				if (!islogin){
					setlogin(true)
				}
				if (!isuser){
					setuser(true)
				}
			})
			.catch(() => {
				notlogin()
			})
	} else {
		notlogin()
	}

	useEffect(() => {
		// To get theme
		const autoTheme = () => {
			if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
				setTheme('dark')
			} else {
				setTheme('light')
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
				<Nav currentTheme={currentTheme} setTheme={setTheme} isuser={isuser} />
				<Routes>

					{/* Login */}
					<>
						<Route path="/auth/login" element={islogin ? redirect('/') : <Login setlogin={setlogin} />} />
					</>

					{/* Logout */}
					<>
						<Route path="/auth/logout" element={<Logout islogin={islogin} setlogin={setlogin} />} />
					</>

					{/* Signup and Signup complete */}
					<>
						<Route path="/auth/signup/completed" element={
							<MailSent heading="Activation Required"
								message="An activation link has been sent to your email.
                                  Please continue to activate account."
							/>
						} />
						{!islogin && <Route path="/auth/signup" element={<Signup setlogin={setlogin} />} />}
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
							<MailSent heading="Instructions Sent to Maol"
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

				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
