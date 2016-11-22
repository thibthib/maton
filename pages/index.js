import React from 'react';
import LoadChart from './components/LoadChart.js';
import 'isomorphic-fetch';
import io from 'socket.io-client';
import { getURL, sockets, api } from '../common/configuration.js';
import css, { merge } from 'next/css';
import { getConsoleTimestamp } from '../common/log.js';

const getLoadsFromMeasure = (measure, cores) => {
	const timestamp = new Date(measure.timestamp);
	return {
		loadOne: { load: measure.load[0]/cores, timestamp },
		loadFive: { load: measure.load[1]/cores, timestamp },
		loadFifteen: { load: measure.load[2]/cores, timestamp },
	};
};

const getLoadArrays = (measures, cores, arrays = [[], [], []]) => {
	return measures.reduce((arrays, measure) => {
		const loads = getLoadsFromMeasure(measure, cores);
		arrays[0].push(loads.loadOne);
		arrays[1].push(loads.loadFive);
		arrays[2].push(loads.loadFifteen);
		return arrays;
	}, arrays);
};

const style = {
	chart: css({
		display: 'inline-block'
	}),
	alerts: css({
		display: 'inline-block',
		width: '300px',
		verticalAlign: 'top',
		padding: '16px'
	}),
	alert: css({
		padding: '4px 8px',
		border: '1px solid black',
		borderRadius: '4px',
		marginBottom: '4px'
	})
};
style.alertStart = merge(style.alert, css({
	borderColor: '#EE605E',
	backgroundColor: '#F09393',
	color: '#A32828'
}));
style.alertEnd = merge(style.alert, css({
	borderColor: '#99CCE6',
	backgroundColor: '#C4E4F4',
	color: '#266687'
}));

export default class Dashboard extends React.Component {
	static getInitialProps() {
		return fetch(getURL(api.load))
		.then(response => response.json())
		.then(data => ({ machine: data.machine, measures: data.measures, alerts: data.alerts }));
	}
	constructor(props) {
		super(props);
		
		const loadArrays = getLoadArrays(props.measures, props.machine.cores);
		
		this.state = {
			loadOne: loadArrays[0],
			loadFive: loadArrays[1],
			loadFifteen: loadArrays[2],
			alerts: props.alerts
		};
	}
	componentDidMount() {
		const socket = io.connect(getURL(sockets.dashboard));
		socket.on('new.measure', data => {
			const newLoadArrays = getLoadArrays([data], this.props.machine.cores, [
				this.state.loadOne.slice(0),
				this.state.loadFive.slice(0),
				this.state.loadFifteen.slice(0)
			]);
			this.setState({
				loadOne: newLoadArrays[0],
				loadFive: newLoadArrays[1],
				loadFifteen: newLoadArrays[2]
			});
		});
		socket.on('alert.start', alert => {
			const newAlertArray = this.state.alerts.concat(Object.assign(alert, { type: 'start' }));
			this.setState({ alerts: newAlertArray });
		});
		socket.on('alert.end', alert => {
			const newAlertArray = this.state.alerts.concat(Object.assign(alert, { type: 'end' }));
			this.setState({ alerts: newAlertArray });
		});
	}
	render() {
		return (
			<div>
				<div className={style.chart}>
					<LoadChart
						loadOne={this.state.loadOne}
						loadFive={this.state.loadFive}
						loadFifteen={this.state.loadFifteen}
					/>
				</div>
				<div className={style.alerts}>
					{this.state.alerts.map((alert, index) => 
						<div className={alert.type === 'start' ? style.alertStart : style.alertEnd} key={index}>
							{`${getConsoleTimestamp(alert.timestamp)} ${alert.message}`}
						</div>
					)}
				</div>
			</div>
		);
	}
}
