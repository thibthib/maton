import React from 'react';
import * as d3 from 'd3';
import io from 'socket.io-client';
const { getURL, sockets } = require('../../common/configuration.js');
const { displayLoad } = require('../../common/events.js');

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

const getArea = (height, data, scales) => {
	return d3.area()
	.x(d => scales.x(d.timestamp))
	.y0(height)
	.y1(d => scales.y(d.load))(data);
};

const getMeasureFromData = measure => ({
	load: measure.load[0],
	timestamp: new Date(measure.timestamp)
});

const calculateState = (loadOneMeasures, width, height) => {
	return {
		loadOne: loadOneMeasures,
		scales: {
			x: getXScale(width, loadOneMeasures),
			y: getYScale(height, loadOneMeasures),
		}
	};
};

export default class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		const loadOneMeasures = props.data.map(getMeasureFromData);
		this.state = calculateState(loadOneMeasures, props.width, props.height);
	}
	willReceiveProps(nextProps) {
		if (this.props !== nextProps) {
			const loadOneMeasures = nextProps.data.map(getMeasureFromData);
			this.setState(calculateState(loadOneMeasures, nextProps.width, nextProps.height));
		}
	}
	componentDidMount() {
		const socket = io.connect(getURL(sockets.dashboard));
		socket.on(displayLoad, data => {
			const measure = getMeasureFromData(data);
			const loadOne = this.state.loadOne.concat(measure);
			this.setState(calculateState(loadOne, this.props.width, this.props.height));
		});
	}
	render() {
		const path = getArea(this.props.height, this.state.loadOne, this.state.scales);
		return (
			<svg width={this.props.width} height={this.props.height}>
				<path
					d={path}
					fill={'blue'}
				/>
			</svg>
		);
	}
}
