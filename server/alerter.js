const { EventEmitter } = require('events');
const aleterEmitter = new EventEmitter();
const datastore = require('./datastore.js');
const currentAlerts = new Map();
const { getConsoleTimestamp } = require('../common/log.js');

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
				return result.load[0];
			}, 0) / machine.cores / results.length;
			
			const currentAlert = currentAlerts.get(machine);
			if (typeof currentAlert === 'undefined') {
				if (averageLoad > LoadThreshold) {
					const alertStartMessage = `${getConsoleTimestamp()} Alert start | High load ➡️ ${averageLoad}`;
					currentAlerts.set(machine, alertStartMessage);
					aleterEmitter.emit('alert.start', {
						machine,
						alertStartMessage
					});
					console.log(`${alertStartMessage} on machine ${machine.id}`);
				}
			} else {
				if (averageLoad <= LoadThreshold) {
					const alertEndMessage = `${getConsoleTimestamp()} Alert end | Load back to normal ➡️ ${averageLoad}`;
					currentAlerts.delete(machine);
					aleterEmitter.emit('alert.end', {
						machine,
						alertEndMessage
					});
					console.log(`${alertEndMessage} on machine ${machine.id}`);
				}
			}
		});
	});
	
	return aleterEmitter;
};
