const { EventEmitter } = require('events');
const aleterEmitter = new EventEmitter();
const datastore = require('./datastore.js');
const currentAlerts = new Map();
const { getConsoleTimestamp } = require('../common/log.js');
const chalk = require('chalk');

const LoadThreshold = 1;
const DurationThresold = 2;

module.exports = () => {
	aleterEmitter.on('new.measure', machine => {
		const thresoldAgo = new Date();
		thresoldAgo.setMinutes(thresoldAgo.getMinutes()-(DurationThresold-1));
		
		return datastore.findMeasures(machine, { timestamp: {
			$gte: thresoldAgo.getTime()
		}}).then(results => {
			const averageLoad = results.reduce((sum, result) => {
				return sum+result.load[0];
			}, 0) / results.length / machine.cores;
			
			const currentAlert = currentAlerts.get(machine);
			if (typeof currentAlert === 'undefined') {
				if (averageLoad > LoadThreshold) {
					const message = `High load > ${averageLoad.toFixed(2)}`;
					const alert = {
						machine,
						message,
						type: 'start',
						timestamp: new Date().getTime()
					};
					currentAlerts.set(machine, alert);
					datastore.insertAlert(machine, alert);
					aleterEmitter.emit('alert.start', alert);
					console.log(`${chalk.dim(getConsoleTimestamp())} ${chalk.red(message)} on machine ${machine.id}`);
				}
			} else {
				if (averageLoad <= LoadThreshold) {
					const message = `Load back to normal > ${averageLoad.toFixed(2)}`;
					const alert = {
						machine,
						message,
						type: 'stop',
						timestamp: new Date().getTime()
					};
					currentAlerts.delete(machine);
					datastore.insertAlert(machine, alert);
					aleterEmitter.emit('alert.end', alert);
					console.log(`${chalk.dim(getConsoleTimestamp())} ${chalk.blue(message)} on machine ${machine.id}`);
				}
			}
		});
	});
	
	return aleterEmitter;
};
