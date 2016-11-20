import React from 'react';
import LoadChart from './components/LoadChart.js';
import 'isomorphic-fetch';
import io from 'socket.io-client';
import { getURL, sockets, api } from '../common/configuration.js';
import { displayLoad } from '../common/events.js';

const getLoadsFromMeasure = measure => {
	const timestamp = new Date(measure.timestamp);
	return {
		loadOne: { load: measure.load[0], timestamp },
		loadFive: { load: measure.load[1], timestamp },
		loadFifteen: { load: measure.load[2], timestamp },
	};
};

export default class Dashboard extends React.Component {
	static getInitialProps() {
		return fetch(getURL(api.load))
		.then(response => response.json())
		.then(data => ({ machine: data.machine, data: data.measures }));
	}
	constructor(props) {
		super(props);
		
		this.state = props.data.reduce((state, measure) => {
			const loads = getLoadsFromMeasure(measure);
			state.loadOne.push(loads.loadOne);
			state.loadFive.push(loads.loadFive);
			state.loadFifteen.push(loads.loadFifteen);
			return state;
		}, {
			loadOne: [],
			loadFive: [],
			loadFifteen: []
		});
	}
	componentDidMount() {
		const socket = io.connect(getURL(sockets.dashboard));
		socket.on(displayLoad, data => {
			const loads = getLoadsFromMeasure(data);
			const loadMeasures = {
				loadOne: this.state.loadOne.concat(loads.loadOne),
				loadFive: this.state.loadFive.concat(loads.loadFive),
				loadFifteen: this.state.loadFifteen.concat(loads.loadFifteen)
			};
			this.setState(loadMeasures);
		});
	}
	render() {
		return (
			<div>
				<LoadChart
					loadOne={this.state.loadOne}
					loadFive={this.state.loadFive}
					loadFifteen={this.state.loadFifteen}
					cores={this.props.machine.cores}
				/>
			</div>
		);
	}
}
