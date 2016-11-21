const { api } = require('../common/configuration.js');
const datastore = require('./datastore.js');
const chalk = require('chalk');
const { getConsoleTimestamp } = require('../common/log.js');

module.exports = app => {
	app.get(`/${api.load}`, (request, response) => {
		response.header('Access-Control-Allow-Origin', '*');
		response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
		
		const machine = datastore.getMachine(request.query.machineId);
		if (typeof machine !== 'undefined') {
			const fifteenMinutesAgo = new Date();
			fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes()-15);
			
			const measures = datastore.findMeasures(machine, { timestamp: {
				$gte: fifteenMinutesAgo.getTime()
			}});
			const alerts = datastore.findAlerts(machine, {});
			
			Promise.all([measures, alerts]).then(([measures, alerts]) => {
				response.send({
					machine,
					measures,
					alerts
				});
				console.log(`${chalk.dim(getConsoleTimestamp())} 📦 ${chalk.bold(' API request')} ${chalk.dim(`${measures.length} measures | ${alerts.length} alerts`)}`);
			});
		} else {
			response.status(404).send({ error: 'Unknown machine' });
		}
	});
};
