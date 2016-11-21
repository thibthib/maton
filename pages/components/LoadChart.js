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
	rightAxisWidth: 30,
	topPadding: 20
};

style.graphHeight = style.height-style.bottomAxisHeight-style.topPadding;
style.graphWidth = style.width-style.rightAxisWidth;
style.graphCSS = css({
	paddingTop: `${style.topPadding}px`
});
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
style.thresholdCSS = css({
	stroke: '#EE605E',
	strokeWidth: 1,
	strokeDasharray: 3
});
style.legend = css({
	fontWeight: 'bold'
});
style.legendItem = css({
	display: 'inline-block',
	padding: '0 16px'
});
style.loadOneLabel = css({
	color: '#3299CC'
});
style.loadFiveLabel = css({
	color: '#8F7DB7'
});
style.loadFifteenLabel = css({
	color: '#FECD2F'
});

const getStateFromProps = props => {
	const now = new Date();
	const fifteenMinutesAgo = new Date(now);
	fifteenMinutesAgo.setMinutes(now.getMinutes()-15);
	
	const maxValue = Math.max(
		d3.max(props.loadOne, d => d.load),
		d3.max(props.loadFive, d => d.load),
		d3.max(props.loadFifteen, d => d.load),
		1
	);
	
	return {
		scales: {
			x: d3.scaleTime().range([0, style.graphWidth]).domain([fifteenMinutesAgo, now]),
			y: d3.scaleLinear().range([style.graphHeight, 0]).domain([0, maxValue])
		},
		thresholdData: [
			{ load: 1, timestamp: fifteenMinutesAgo },
			{ load: 1, timestamp: now }
		]
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
			<div>
				<svg width={style.width} height={style.height} className={style.graphCSS}>
					<g>
						<Area data={this.props.loadOne} accessors={this.accessors} height={style.graphHeight} className={style.loadOneAreaCSS} />
						<Line data={this.props.loadOne} accessors={this.accessors} className={style.loadOneLineCSS} />
						<Line data={this.props.loadFive} accessors={this.accessors} className={style.loadFiveLineCSS} />
						<Line data={this.props.loadFifteen} accessors={this.accessors} className={style.loadFifteenLineCSS} />
						<Line data={this.state.thresholdData} accessors={this.accessors} className={style.thresholdCSS} />
					</g>
					<Axis generator={d3.axisBottom(this.state.scales.x)} className={style.bottomAxisCSS}/>
					<Axis generator={d3.axisRight(this.state.scales.y)} className={style.rightAxisCSS}/>
				</svg>
				<div className={style.legend}>
					<div className={style.legendItem}>
						<span className={style.loadOneLabel}>{'1 min average : '}</span>
						<span>{`${this.props.loadOne[this.props.loadOne.length-1].load.toFixed(2)}`}</span>
					</div>
					<div className={style.legendItem}>
						<span className={style.loadFiveLabel}>{'5 min average : '}</span>
						<span>{`${this.props.loadFive[this.props.loadFive.length-1].load.toFixed(2)}`}</span>
					</div>
					<div className={style.legendItem}>
						<span className={style.loadFifteenLabel}>{'15 min average : '}</span>
						<span>{`${this.props.loadFifteen[this.props.loadFifteen.length-1].load.toFixed(2)}`}</span>
					</div>
				</div>
			</div>
			
		);
	}
}
