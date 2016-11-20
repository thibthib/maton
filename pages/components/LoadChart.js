import React from 'react';
import * as d3 from 'd3';
import Area from './Area.js';
import Line from './Line.js';
import Axis from './Axis.js';
import css from 'next/css';

const style = {
	width: 900,
	height: 500,
	bottomAxisHeight: 20,
	rightAxisWidth: 24
};

style.graphHeight = style.height-style.bottomAxisHeight;
style.graphWidth = style.width-style.rightAxisWidth;
style.bottomAxisCSS = css({
	transform: `translateY(${style.graphHeight}px)`
});
style.rightAxisCSS = css({
	transform: `translateX(${style.graphWidth}px)`
});
style.loadOneAreaCSS = css({
	fill: '#99CCE6'
});
style.loadOneLineCSS = css({
	stroke: '#3299CC',
	strokeWidth: 1
});
style.loadFiveLineCSS = css({
	stroke: '#8F7DB7',
	strokeWidth: 3
});
style.loadFifteenLineCSS = css({
	stroke: '#FECD2F',
	strokeWidth: 3
});



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

const getStateFromProps = props => {
	return {
		scales: {
			x: getXScale(style.graphWidth),
			y: getYScale(style.graphHeight, props.loadOne)
		}
	};
};

export default class LoadChart extends React.Component {
	constructor(props) {
		super(props);

		this.state = getStateFromProps(props);
		
		this.accessors = {
			x: value => this.state.scales.x(value.timestamp),
			y: value => this.state.scales.y(value.load)
		};
	}
	componentWillReceiveProps(nextProps) {
		if (this.props !== nextProps) {
			this.setState(getStateFromProps(nextProps));
		}
	}
	render() {
		return (
			<svg width={style.width} height={style.height}>
				<g>
					<Area data={this.props.loadOne} accessors={this.accessors} height={style.graphHeight} className={style.loadOneAreaCSS} />
					<Line data={this.props.loadOne} accessors={this.accessors} className={style.loadOneLineCSS} />
					<Line data={this.props.loadFive} accessors={this.accessors} className={style.loadFiveLineCSS} />
					<Line data={this.props.loadFifteen} accessors={this.accessors} className={style.loadFifteenLineCSS} />
				</g>
				<Axis generator={d3.axisBottom(this.state.scales.x)} className={style.bottomAxisCSS}/>
				<Axis generator={d3.axisRight(this.state.scales.y)} className={style.rightAxisCSS}/>
			</svg>
		);
	}
}
