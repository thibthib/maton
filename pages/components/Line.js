import * as d3 from 'd3';
import React from 'react';

const Line = props => {
	const path = d3.line()
	.x(props.accessors.x)
	.y(props.accessors.y)(props.data);

	return <path d={path} fill={'none'} stroke={props.stroke} strokeWidth={props.strokeWidth} className={props.className} />;
};

export default Line;
