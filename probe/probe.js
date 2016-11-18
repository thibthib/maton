const { mesureLoadEvent } = require('../common/events.js');
const { mesuresSocket } = require('../common/configuration.js');
const io = require('socket.io-client');
const os = require('os');

const socket = io.connect(mesuresSocket, {
	query: `machineId=${os.hostname()}`
});

setInterval(() => {
	socket.emit(mesureLoadEvent, {
		load: os.loadavg(),
		timestamp: new Date()
	});
}, 5000);
