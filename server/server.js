const configuration = require('../common/configuration.js');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const addAPIEndPoints = require('./api.js');
const getMeasuresStore = require('./measures.js');
const getDashboards = require('./dashboards.js');

addAPIEndPoints(app);

const dashboards = getDashboards(io);
const measuresStore = getMeasuresStore(io);

measuresStore.on('measure.insertion', inserted => {
	dashboards.emit('new.measure', inserted);
});

server.listen(configuration.serverPort);
