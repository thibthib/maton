const nedb = require('nedb');
const datastores = new Map();

const getDatastore = machine => {
	let datastore = datastores.get(machine);
	if (!datastore) {
		datastore = new nedb();
		datastores.set(machine, datastore);
	}
	return datastore;
};

const insert = (machine, data) => {
	const datastore = getDatastore(machine);
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

const getMachine = id => {
	const machines = Array.from(datastores.keys());
	if (typeof id === 'undefined') {
		return machines[0];
	}
	return machines.find(machine => machine.id === id);
};

const find = (machine, query) => {
	const datastore = getDatastore(machine);
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
	find,
	getMachine
};
