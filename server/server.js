const configuration = require('../common/configuration.js');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const addAPIEndPoints = require('./api.js');
const getMeasuresStore = require('./measures.js');
const getDashboards = require('./dashboards.js');
const getAlerter = require('./alerter.js');

addAPIEndPoints(app);

const dashboards = getDashboards(io);

const alerter = getAlerter(io);
alerter.on('alert.start', alert => {
	dashboards.emit('alert.start', alert);
});
alerter.on('alert.end', alert => {
	dashboards.emit('alert.end', alert);
});

const measuresStore = getMeasuresStore(io);
measuresStore.on('measure.insertion', ({ machine, newMeasure }) => {
	dashboards.emit('new.measure', newMeasure);
	alerter.emit('new.measure', machine);
});

server.listen(configuration.serverPort);
