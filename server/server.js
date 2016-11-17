const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { mesureLoadEvent } = require('../common/events.js');
const { serverPort, mesuresNamespace } = require('../common/configuration.js');

const mesuresIO = io.of(mesuresNamespace);
mesuresIO.on('connection', socket => {
	console.log('🛰 Probe connection 🛰');
	socket.on(mesureLoadEvent, function (data) {
		console.log(data);
	});
});

server.listen(serverPort);
