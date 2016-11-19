const serverURL = process.env.NODE_ENV === 'production' ? 'http://maton-server.now.sh' : 'http://localhost';
const serverPort = process.env.NODE_ENV === 'production' ? 80 : 8888;
const getURL = namespace => `${serverURL}:${serverPort}/${namespace}`;

module.exports = {
	serverURL,
	serverPort,
	sockets: {
		measures: 'measures',
		dashboard: 'dashboard'
	},
	api: {
		load: 'load'
	},
	getURL
};
