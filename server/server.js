const { mesureLoadEvent } = require('../common/events.js');
const { serverPort, mesuresNamespace } = require('../common/configuration.js');
const server = require('http').createServer();
const io = require('socket.io')(server);
const datastore = require('./datastore.js');

const mesuresIO = io.of(mesuresNamespace);
mesuresIO.on('connection', socket => {
	const { machineId } = socket.handshake.query;
	console.log(`🛰 Probe connection : ${machineId}`);
	
	socket.on(mesureLoadEvent, data => {
		datastore.insert(machineId, data).then(inserted => {
			console.log(inserted);
		});
	});
});

server.listen(serverPort);
