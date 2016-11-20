const { EventEmitter } = require('events');
const probesEventsEmitter = new EventEmitter();
const { sockets } = require('../common/configuration.js');
const chalk = require('chalk');
const { getConsoleTimestamp } = require('../common/log.js');
const datastore = require('./datastore.js');

module.exports = io => {
	const mesuresIO = io.of(sockets.measures);
	mesuresIO.on('connection', socket => {
		const { id, cores } = socket.handshake.query;
		const machine = { id, cores };
		console.log(`${chalk.dim(getConsoleTimestamp())} 🛰 ${machine.id} ➡️ ${chalk.blue(' probe connection')}`);
		
		socket.on('new.load', data => {
			datastore.insert(machine, data).then(inserted => {
				console.log(`${chalk.dim(getConsoleTimestamp())} 🛰 ${machine.id} ➡️ ${chalk.green(' measure insert')}`);
				probesEventsEmitter.emit('measure.insertion', inserted);
			});
		});
	});
	
	return probesEventsEmitter;
};
