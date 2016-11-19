const { mesureLoadEvent } = require('../common/events.js');
const { serverPort, mesuresNamespace } = require('../common/configuration.js');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const datastore = require('./datastore.js');
const chalk = require('chalk');

const getConsoleTimestamp = () => {
	const now = new Date();
	return `${now.getHours() < 10 ? '0' : '' }${now.getHours()}:${now.getMinutes() < 10 ? '0' : '' }${now.getMinutes()}`;
};

const mesuresIO = io.of(mesuresNamespace);
mesuresIO.on('connection', socket => {
	const { machineId } = socket.handshake.query;
	console.log(`${chalk.dim(getConsoleTimestamp())} 🛰 ${machineId} ➡️ ${chalk.blue(' probe connection')}`);
	
	socket.on(mesureLoadEvent, data => {
		datastore.insert(machineId, data).then(() => {
			console.log(`${chalk.dim(getConsoleTimestamp())} 🛰 ${machineId} ➡️ ${chalk.green(' measure insert')}`);
		});
	});
});

server.listen(serverPort);
