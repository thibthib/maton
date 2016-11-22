const proxyquire = require('proxyquire');
const { describe, it } = require('mocha');

const highLoad = [
	{ load: [0.8, 0.8, 0.8] },
	{ load: [1.2, 1.2, 1.2] },
	{ load: [1.1, 1.1, 1.1] },
	{ load: [1.1, 1.1, 1.1] }
];

const notHighLoad = highLoad.concat([
	{ load: [1, 1, 1] },
	{ load: [0.9, 0.9, 0.9] },
	{ load: [0.8, 0.8, 0.8] },
	{ load: [0.5, 0.5, 0.5] }
]);

const machineTest = { cores: 1, id: 'test' };

describe('alerter', function() {
	let datastore = {};
	let alerter = proxyquire('../alerter.js', { './datastore.js': datastore })();
	
	it('should raise high load alert', function(done) {
		// given
		datastore.findMeasures = () => Promise.resolve(highLoad);
		alerter.on('alert.start', () => {
			done();
		});

		// when
		alerter.emit('new.measure', machineTest);
	});
	
	it('should end high load alert', function(done) {
		// given
		datastore.findMeasures = () => Promise.resolve(notHighLoad);
		alerter.on('alert.end', () => {
			done();
		});

		// when
		alerter.emit('new.measure', machineTest);
	});
});
