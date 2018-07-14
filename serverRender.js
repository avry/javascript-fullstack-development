import React from 'react';
import ReactDOMServer from 'react-dom/server';

import App from './src/components/App';

//we are going to fetch data from the api
import axios from 'axios';
import config from './config';

console.log('this is indeed running')

const serverRender = () =>
	axios.get(`${config.serverUrl}/api/contests`)
		.then(resp => {
			return ReactDOMServer.renderToString(
				<App initialContests={resp.data.contests} />
			);
		});

export default serverRender;