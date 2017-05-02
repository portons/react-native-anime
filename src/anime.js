import React from 'react';
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
	OPACITY,
	FONT_SIZE,
	COLOR
} from './utils/constants';

export default class Anime extends React.Component {
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

		this.scenario.push({ type: MOVE_X, value, options, defaultStyle: this.props.style });

		return this;
	}

	moveY(value, options = {}) {
		if (this.state.animating) {
			return this;
		}

		this.scenario.push({ type: MOVE_Y, value, options, defaultStyle: this.props.style });

		return this;
	}

	rotate(value, options = {}) {
		if (this.state.animating) {
			return this;
		}

		this.scenario.push({ type: ROTATE, value, options, defaultStyle: this.props.style });

		return this;
	}

	scale(value, options = {}) {
		if (this.state.animating) {
			return this;
		}

		this.scenario.push({ type: SCALE, value, options, defaultStyle: this.props.style });

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

	fontSize(value, options = {}) {
		if (this.state.animating) {
			return this;
		}

		this.scenario.push({ type: FONT_SIZE, value, options, defaultStyle: this.props.style });

		return this;
	}

	color(value, options = {}) {
		if (this.state.animating) {
			return this;
		}

		this.scenario.push({ type: COLOR, value, options, defaultStyle: this.props.style });

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

	wait(duration) {
		if (this.state.animating) {
			return this;
		}

		this.scenario.push({ type: WAIT, duration });

		return this;
	}

	start(onAnimationEnd) {
		if (this.state.animating) {
			return;
		}

		const { animations, styles, animatedValues } = scenarioParser({
			scenario: this.scenario,
			animatedValues: assign({}, this.state.animatedValues)
		});

		this.currentAnimation = animations;
		this.onAnimationEnd = onAnimationEnd;

		this.setState({ styles, animatedValues, animating: true }, () => {
			this.currentAnimation.start(({ finished }) => {
				if (!finished) {
					return;
				}

				this.onAnimationEnd && this.onAnimationEnd();

				this.scenario = [];
				this.currentAnimation = null;
				this.onAnimationEnd = null;
				this.setState({ animating: false });
			});
		});
	}

	repeat(count, onAnimationEnd) {
		const { animations, styles, animatedValues } = scenarioParser({
			scenario: this.scenario,
			animatedValues: assign({}, this.state.animatedValues)
		});

		this.currentAnimation = animations;
		this.onAnimationEnd = onAnimationEnd;

		this.setState({ styles, animatedValues, animating: true }, () => {
			this.currentAnimation.start(({ finished }) => {
				if (!finished) {
					return;
				}

				if (count === 1) {
					this.onAnimationEnd && this.onAnimationEnd();

					this.scenario = [];
					this.currentAnimation = null;
					this.onAnimationEnd = null;
					this.setState({ animating: false });
				} else {
					this.repeat(count - 1);
				}
			});
		});
	}

	infinite() {
		const { animations, styles, animatedValues } = scenarioParser({
			scenario: this.scenario,
			animatedValues: assign({}, this.state.animatedValues)
		});

		this.currentAnimation = animations;

		this.setState({ styles, animatedValues, animating: true }, () => {
			this.currentAnimation.start(({ finished }) => {
				if (!finished) {
					return;
				}

				return this.infinite();
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

		this.setState({
			styles: {},
			animatedValues: null,
			animating: false
		});
	}
}