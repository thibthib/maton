const { EventEmitter } = require('events');
const dashboardEventsEmitter = new EventEmitter();
const { sockets } = require('../common/configuration.js');
const chalk = require('chalk');
const { getConsoleTimestamp } = require('../common/log.js');

module.exports = io => {
	const dashboardIO = io.of(sockets.dashboard);
	dashboardIO.on('connection', () => {
		console.log(`${chalk.dim(getConsoleTimestamp())} ${chalk.blue('📈 dashboard connection')}`);
	});
	
	dashboardEventsEmitter.on('new.measure', load => {
		dashboardIO.emit('new.measure', load);
	});
	
	return dashboardEventsEmitter;
};
