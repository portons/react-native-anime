import React from 'react';
import { Animated } from 'react-native';
import { assign } from 'lodash';

import { scenarioParser } from './utils';
import { ROTATE, MOVE_X, MOVE_Y, WAIT, DELAY, SCALE, BACKGROUND_COLOR, BORDER_RADIUS, WIDTH, HEIGHT } from './constants';

export default class ChainAnimations extends React.Component {
	constructor() {
	  super();

	  this.state = {
	  	styles: {},
			animatedValues: null,
			animating: false
		};

	  this.scenario = [];
	  this.dimensionsSet = false;
	}

	moveX(value, options = {}) {
		if (this.state.animating) {
			return this;
		}

		this.scenario.push({ type: MOVE_X, value, options });

		return this;
	}

	moveY(value, options = {}) {
		if (this.state.animating) {
			return this;
		}

		this.scenario.push({ type: MOVE_Y, value, options });

		return this;
	}

	rotate(value, options = {}) {
		if (this.state.animating) {
			return this;
		}

		this.scenario.push({ type: ROTATE, value, options });

		return this;
	}

	scale(value, options = {}) {
		if (this.state.animating) {
			return this;
		}

		this.scenario.push({ type: SCALE, value, options });

		return this;
	}

	backgroundColor(value, options = {}) {
		if (this.state.animating) {
			return this;
		}

		this.scenario.push({ type: BACKGROUND_COLOR, value, options, startingColor: this.props.style.backgroundColor});

		return this;
	}

	borderRadius(value, options = {}) {
		if (this.state.animating) {
			return this;
		}

		this.scenario.push({ type: BORDER_RADIUS, value, options });

		return this;
	}

	width(value, options = {}) {
		if (this.state.animating) {
			return this;
		}

		this.scenario.push({ type: WIDTH, value, options, width: this.viewWidth });

		return this;
	}

	height(value, options = {}) {
		if (this.state.animating) {
			return this;
		}


		this.scenario.push({ type: HEIGHT, value, options, height: this.viewHeight });

		return this;
	}

	delay(duration) {
		if (this.state.animating) {
			return this;
		}

		this.scenario.push({ type: DELAY, duration });

		return this;
	}

	wait(duration) {
		if (this.state.animating) {
			return this;
		}

		this.scenario.push({ type: WAIT, duration });

		return this;
	}

	start() {
		if (this.state.animating) {
			return;
		}

		const { animations, styles, animatedValues } = scenarioParser({
			scenario: this.scenario,
			animatedValues: assign({}, this.state.animatedValues)
		});

		this.setState({ styles, animatedValues, animating: true }, () => {
			this.currentAnimation = animations;

			this.currentAnimation.start(() => {
				this.scenario = [];
				this.setState({ animating: false });
			});
		});
	}

	stop() {
		if (this.state.animating) {
			this.currentAnimation.stop();
			this.scenario = [];
			this.setState({ animating: false });
			this.currentAnimation = null;
		}
	}

	setDimensions({ height, width }) {
		this.viewHeight = height;
		this.viewWidth = width;
		this.dimensionsSet = true;
	}

	render() {
		const { styles } = this.state;

	  return (
	    <Animated.View style={ [this.props.style, styles] }
			               onLayout={ (event) => !this.dimensionsSet && this.setDimensions(event.nativeEvent.layout) }>
				{ this.props.children }
			</Animated.View>
	  )
	}
}