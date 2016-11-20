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
			
			datastore.find(machine, { timestamp: {
				$gte: fifteenMinutesAgo.getTime()
			}}).then(results => {
				response.send({
					machine,
					measures: results
				});
				console.log(`${chalk.dim(getConsoleTimestamp())} 📦 ${chalk.bold(' API request')} ${chalk.dim(`${results.length} measures`)}`);
			});
		} else {
			response.status(404).send({ error: 'Unknown machine' });
		}
	});
};
