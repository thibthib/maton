const { mesureLoadEvent, displayLoad } = require('../common/events.js');
const configuration = require('../common/configuration.js');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const datastore = require('./datastore.js');
const chalk = require('chalk');
const { getConsoleTimestamp } = require('../common/log.js');
const addAPIEndPoints = require('./api.js');

addAPIEndPoints(app);

const dashboardIO = io.of(configuration.sockets.dashboard);
dashboardIO.on('connection', () => {
	console.log(`${chalk.dim(getConsoleTimestamp())} ${chalk.blue('📈 dashboard connection')}`);
});

const mesuresIO = io.of(configuration.sockets.measures);
mesuresIO.on('connection', socket => {
	const { id, cores } = socket.handshake.query;
	const machine = { id, cores };
	console.log(`${chalk.dim(getConsoleTimestamp())} 🛰 ${machine.id} ➡️ ${chalk.blue(' probe connection')}`);
	
	socket.on(mesureLoadEvent, data => {
		datastore.insert(machine, data).then(inserted => {
			console.log(`${chalk.dim(getConsoleTimestamp())} 🛰 ${machine.id} ➡️ ${chalk.green(' measure insert')}`);
			dashboardIO.emit(displayLoad, inserted);
		});
	});
});

server.listen(configuration.serverPort);
