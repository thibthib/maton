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
		
		return datastore.find(machine, { timestamp: {
			$gte: thresoldAgo.getTime()
		}}).then(results => {
			const averageLoad = results.reduce((sum, result) => {
				return sum+result.load[0];
			}, 0) / results.length / machine.cores;
			
			const currentAlert = currentAlerts.get(machine);
			if (typeof currentAlert === 'undefined') {
				if (averageLoad > LoadThreshold) {
					const alertStartMessage = `Alert start | High load ➡️ ${averageLoad.toFixed(2)}`;
					currentAlerts.set(machine, alertStartMessage);
					aleterEmitter.emit('alert.start', {
						machine,
						alertStartMessage
					});
					console.log(`${chalk.dim(getConsoleTimestamp())} ${chalk.red(alertStartMessage)} on machine ${machine.id}`);
				}
			} else {
				if (averageLoad <= LoadThreshold) {
					const alertEndMessage = `${getConsoleTimestamp()} Alert end | Load back to normal ➡️ ${averageLoad.toFixed(2)}`;
					currentAlerts.delete(machine);
					aleterEmitter.emit('alert.end', {
						machine,
						alertEndMessage
					});
					console.log(`${chalk.dim(getConsoleTimestamp())} ${chalk.blue(alertEndMessage)} on machine ${machine.id}`);
				}
			}
		});
	});
	
	return aleterEmitter;
};
