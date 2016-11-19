import React from 'react';
import Chart from './components/Chart.js';
import { getURL, api } from '../common/configuration.js';
import 'isomorphic-fetch';

export default class App extends React.Component {
	static getInitialProps() {
		return fetch(getURL(api.load))
		.then(response => response.json())
		.then(data => ({ machine: data.machine, data: data.measures }));
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
