const nedb = require('nedb');
const datastores = new Map();

const getMachine = id => {
	const machines = Array.from(datastores.keys());
	if (typeof id === 'undefined') {
		return machines[0];
	}
	return machines.find(machine => machine.id === id);
};

const getDatastore = machine => {
	let datastore = datastores.get(machine);
	if (!datastore) {
		datastore = {
			measures: new nedb(),
			alerts: new nedb()
		};
		datastores.set(machine, datastore);
	}
	return datastore;
};

const insert = (datastore, data) => {
	return new Promise((resolve, reject) => {
		datastore.insert(data, (error, newDocs) => {
			if (error) {
				reject(error);
			} else {
				resolve(newDocs);
			}
		});
	});
};

const insertMeasure = (machine, data) => {
	const datastore = getDatastore(machine);
	return insert(datastore.measures, data);
};

const insertAlert = (machine, data) => {
	const datastore = getDatastore(machine);
	return insert(datastore.alerts, data);
};

const find = (datastore, query) => {
	return new Promise((resolve, reject) => {
		datastore.find(query).sort({ timestamp: 1 }).exec((error, docs) => {
			if (error) {
				reject(error);
			} else {
				resolve(docs);
			}
		});
	});
};

const findMeasures = (machine, query) => {
	const datastore = getDatastore(machine);
	return find(datastore.measures, query);
};

const findAlerts = (machine, query) => {
	const datastore = getDatastore(machine);
	return find(datastore.alerts, query);
};

module.exports = {
	insertMeasure,
	insertAlert,
	findMeasures,
	findAlerts,
	getMachine
};
