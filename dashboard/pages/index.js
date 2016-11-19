import React from 'react';
import Chart from '../components/Chart.js';
import 'isomorphic-fetch';

export default class App extends React.Component {
	static getInitialProps() {
		return fetch('http://localhost:8888/load')
		.then(response => response.json())
		.then(data => ({ data }));
	}
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div>
				<Chart data={this.props.data} height={500} width={900}/>
			</div>
		);
	}
}
