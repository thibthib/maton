const { EventEmitter } = require('events');
const measuresStoreEmitter = new EventEmitter();
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
			datastore.insertMeasure(machine, data).then(newMeasure => {
				console.log(`${chalk.dim(getConsoleTimestamp())} 🛰 ${machine.id} ➡️ ${chalk.green(' measure insert')}`);
				measuresStoreEmitter.emit('measure.insertion', { machine, newMeasure });
			});
		});
	});
	
	return measuresStoreEmitter;
};
