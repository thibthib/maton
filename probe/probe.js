const { mesureLoadEvent } = require('../common/events.js');
const { getURL, sockets } = require('../common/configuration.js');
const io = require('socket.io-client');
const os = require('os');

const socket = io.connect(getURL(sockets.measures), {
	query: `machineId=${os.hostname()}`
});

setInterval(() => {
	socket.emit(mesureLoadEvent, {
		load: os.loadavg(),
		timestamp: new Date().getTime()
	});
}, 5000);
