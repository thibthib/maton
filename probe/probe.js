const { getURL, sockets } = require('../common/configuration.js');
const io = require('socket.io-client');
const os = require('os');

const socket = io.connect(getURL(sockets.measures), {
	query: `id=${os.hostname()}&cores=${os.cpus().length}`
});

setInterval(() => {
	socket.emit('new.load', {
		load: os.loadavg(),
		timestamp: new Date().getTime()
	});
}, 5000);
