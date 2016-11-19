const { mesureLoadEvent, displayLoad } = require('../common/events.js');
const configuration = require('../common/configuration.js');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const datastore = require('./datastore.js');
const chalk = require('chalk');

const getConsoleTimestamp = () => {
	const now = new Date();
	return `${now.getHours() < 10 ? '0' : '' }${now.getHours()}:${now.getMinutes() < 10 ? '0' : '' }${now.getMinutes()}`;
};

const dashboardIO = io.of(configuration.sockets.dashboard);
dashboardIO.on('connection', () => {
	console.log(`${chalk.dim(getConsoleTimestamp())} ${chalk.blue('📈 dashboard connection')}`);
});

const mesuresIO = io.of(configuration.sockets.measures);
mesuresIO.on('connection', socket => {
	const { id, cores } = socket.handshake.query;
	const machine = { id, cores };
	console.log(`${chalk.dim(getConsoleTimestamp())} 🛰 ${machine.id} ➡️ ${chalk.blue(' probe connection')}`);
	
	socket.on(mesureLoadEvent, data => {
		datastore.insert(machine, data).then(inserted => {
			console.log(`${chalk.dim(getConsoleTimestamp())} 🛰 ${machine.id} ➡️ ${chalk.green(' measure insert')}`);
			dashboardIO.emit(displayLoad, inserted);
		});
	});
});

app.get(`/${configuration.api.load}`, (request, response) => {
	response.header('Access-Control-Allow-Origin', '*');
	response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	
	const machine = datastore.getMachine(request.query.machineId);
	if (typeof machine !== 'undefined') {
		const fiveMinutesAgo = new Date();
		fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes()-5);
		
		datastore.find(machine, { timestamp: {
			$gte: fiveMinutesAgo.getTime()
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

server.listen(configuration.serverPort);
