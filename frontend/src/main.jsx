import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<App classname="container main"/>
	</React.StrictMode>
);

document.getElementById('root').style = "display: flex; flex-direction: column; justify-content: between; height: 100vh; width: 100vw; margin: 0; padding: 0;";

