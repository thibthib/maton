const nedb = require('nedb');
const datastores = new Map();

const getDatastore = machineId => {
	let datastore = datastores.get(machineId);
	if (!datastore) {
		datastore = new nedb();
		datastores.set(machineId, datastore);
	}
	return datastore;
};

const insert = (machineId, data) => {
	const datastore = getDatastore(machineId);
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

const find = (machineId = datastores.keys().next().value, query) => {
	const datastore = getDatastore(machineId);
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

module.exports = {
	insert,
	find
};
