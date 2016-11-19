import React from 'react';
import * as d3 from 'd3';
import io from 'socket.io-client';
import { getURL, sockets } from '../../common/configuration.js';
import { displayLoad } from '../../common/events.js';
import Area from './Area.js';
import Line from './Line.js';

const getXScale = (width) => {
	const now = new Date();
	const fiveMinutesAgo = new Date(now);
	fiveMinutesAgo.setMinutes(now.getMinutes()-5);
	
	return d3.scaleTime()
	.range([0, width])
	.domain([fiveMinutesAgo, now]);
};

const getYScale = (height, data) => {
	return d3.scaleLinear()
	.range([height, 0])
	.domain([0, d3.max(data, d => d.load)]);
};

const calculateScales = (loadMeasures, width, height) => {
	return {
		x: getXScale(width),
		y: getYScale(height, loadMeasures.loadOne)
	};
};

const getLoadsFromMeasure = measure => {
	const timestamp = new Date(measure.timestamp);
	return {
		loadOne: { load: measure.load[0], timestamp },
		loadFive: { load: measure.load[1], timestamp },
		loadFifteen: { load: measure.load[2], timestamp },
	};
};

export default class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		const loadMeasures = props.data.reduce((state, measure) => {
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
		this.state = Object.assign({
			scales: calculateScales(loadMeasures, props.width, props.height)
		}, loadMeasures);
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
			this.setState(Object.assign({
				scales: calculateScales(loadMeasures, this.props.width, this.props.height)
			}, loadMeasures));
		});
	}
	render() {
		const accessors = {
			x: value => this.state.scales.x(value.timestamp),
			y: value => this.state.scales.y(value.load)
		};
		
		return (
			<svg width={this.props.width} height={this.props.height}>
				<Area data={this.state.loadOne} accessors={accessors} height={this.props.height} fill={'blue'} />
				<Line data={this.state.loadOne} accessors={accessors} stroke={'turquoise'} strokeWidth={2} />
				<Line data={this.state.loadFive} accessors={accessors} stroke={'red'} strokeWidth={2} />
				<Line data={this.state.loadFifteen} accessors={accessors} stroke={'grey'} strokeWidth={2} />
			</svg>
		);
	}
}
