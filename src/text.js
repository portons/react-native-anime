import React from 'react';
import { Animated } from 'react-native';
import { assign } from 'lodash';

import { scenarioParser } from './utils/parsers';
import {
	ROTATE,
	MOVE_X,
	MOVE_Y,
	WAIT,
	SCALE,
	BACKGROUND_COLOR,
	BORDER_RADIUS,
	BORDER_WIDTH,
	WIDTH,
	HEIGHT,
	BORDER_COLOR,
	FONT_SIZE,
	OPACITY
} from './utils/constants';

export default class Text extends React.Component {
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

		this.scenario.push({ type: BACKGROUND_COLOR, value, options, defaultStyle: this.props.style });

		return this;
	}

	borderRadius(value, options = {}) {
		if (this.state.animating) {
			return this;
		}

		this.scenario.push({ type: BORDER_RADIUS, value, options, defaultStyle: this.props.style });

		return this;
	}

	borderWidth(value, options = {}) {
		if (this.state.animating) {
			return this;
		}

		this.scenario.push({ type: BORDER_WIDTH, value, options, defaultStyle: this.props.style });

		return this;
	}

	opacity(value, options = {}) {
		if (this.state.animating) {
			return this;
		}

		this.scenario.push({ type: OPACITY, value, options, defaultStyle: this.props.style });

		return this;
	}

	borderColor(value, options = {}) {
		if (this.state.animating) {
			return this;
		}

		this.scenario.push({ type: BORDER_COLOR, value, options, defaultStyle: this.props.style });

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

	fontSize(value, options = {}) {
		if (this.state.animating) {
			return this;
		}

		this.scenario.push({ type: FONT_SIZE, value, options, defaultStyle: this.props.style });

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

	reset() {
		this.scenario = [];
		this.dimensionsSet = false;

		this.setState({
			styles: {},
			animatedValues: null,
			animating: false
		});
	}

	render() {
		const { styles } = this.state;

		return (
			<Animated.Text style={ [this.props.style, styles] }
										 onLayout={ (event) => !this.dimensionsSet && this.setDimensions(event.nativeEvent.layout) }>
				{ this.props.children }
			</Animated.Text>
		)
	}
}