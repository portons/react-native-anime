import React from 'react';
import { assign } from 'lodash';
import { Animated } from 'react-native';

import { scenarioParser } from './utils';
import { ROTATE, MOVE_X, MOVE_Y, WAIT, DELAY, DURATION } from './constants';

export default class ChainAnimations extends React.Component {
	constructor() {
	  super();

	  this.state = {
	  	styles: {}
		};

	  this.scenario = [];
	}

	componentWillMount() {}

	moveX(distance) {
		this.scenario.push({ type: MOVE_X, distance });

		return this;
	}

	moveY(distance) {
		this.scenario.push({ type: MOVE_Y, distance });

		return this;
	}

	rotate(degrees) {
		this.scenario.push({ type: ROTATE, degrees });

		return this;
	}

	duration(duration) {
		this.scenario.push({ type: DURATION, duration });

		return this;
	}

	delay(duration) {
		this.scenario.push({ type: DELAY, duration });

		return this;
	}

	wait(duration) {
		this.scenario.push({ type: WAIT, duration });

		return this;
	}

	start() {
		const { animations, styles } = scenarioParser(this.scenario);

		this.setState({ styles }, () => {
			animations.start(() => {
				this.setState({ styles: {} });
			})
		});
	}

	render() {
	  return (
	    <Animated.View style={ this.state.styles }>
				{ this.props.children }
			</Animated.View>
	  )
	}
}