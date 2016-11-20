import React from 'react';
import * as d3 from 'd3';

export default class Axis extends React.Component {
	componentDidMount() {
		this.renderAxis();
	}
	componentDidUpdate() {
		this.renderAxis();
	}
	renderAxis() {
		d3.select(this.axis).call(this.props.generator);
	}
	render() {
		return <g className={this.props.className} ref={node => { this.axis = node; }}></g>;
	}
}
