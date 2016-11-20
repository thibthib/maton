const { EventEmitter } = require('events');
const dashboardEventsEmitter = new EventEmitter();
const { sockets } = require('../common/configuration.js');
const chalk = require('chalk');
const { getConsoleTimestamp } = require('../common/log.js');
const { displayLoad } = require('../common/events.js');

module.exports = io => {
	const dashboardIO = io.of(sockets.dashboard);
	dashboardIO.on('connection', () => {
		console.log(`${chalk.dim(getConsoleTimestamp())} ${chalk.blue('📈 dashboard connection')}`);
	});
	
	dashboardEventsEmitter.on(displayLoad, load => {
		dashboardIO.emit(displayLoad, load);
	});
	
	return dashboardEventsEmitter;
};
