 import express from 'express';
import config from './config';
import apiRouter from './api';
import sassMiddleware from 'node-sass-middleware';
import path from 'path';
import serverRender from './serverRender';
import bodyParser from 'body-parser';

const server = express();
server.use(bodyParser.json());

//setting up the server to use our node sass middleware
server.use(sassMiddleware({
	src: path.join(__dirname, 'sass'),
	dest: path.join(__dirname, 'public')
}));

//setting up ejs to work with express
server.set('view engine', 'ejs'); 

//this handles the home contest list and the contest details pages
server.get(['/', '/contest/:contestId'], (req, res) => {
	serverRender(req.params.contestId)
		.then(({initialMarkup, initialData}) => {
			//.render used for ejs files. .ejs extension not req	
			res.render('index', {
				initialMarkup,
				initialData
			});
		})
		.catch(error => {
			console.error(error)
			res.status(404).send('Bad Request');
		}); 
});


//this handles all api requests for JSON data
server.use('/api', apiRouter); 


// server.get('/about.html', (req, res) => {
// 	fs.readFile('./about.html', (err, data) => {
// 		res.send(data.toString());
// 	});
// });
//the above lines can be replaced with
server.use(express.static('public'));
//.use is how we put a middleware in the express middleware stack
// public is where we want our static assets to be hosted ON the file sys


server.listen(config.port, config.host, () => {
	console.info("express listening on port ", config.port);
	console.info("express listening on host ", config.host);
});

