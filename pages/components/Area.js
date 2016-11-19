import * as d3 from 'd3';
import React from 'react';

const Area = props => {
	const path = d3.area()
	.x(props.accessors.x)
	.y0(props.height)
	.y1(props.accessors.y)(props.data);

	return <path d={path} fill={props.fill} className={props.className} />;
};

export default Area;
