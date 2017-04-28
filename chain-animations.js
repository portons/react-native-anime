import React from 'react';
import { Animated } from 'react-native';

import { assign } from 'lodash';

const ANIMATION_TYPES = {
	ROTATE: 'rotate'
};

export default class ChainAnimations extends React.Component {
	constructor() {
	  super();

	  this.state = {
	    animationValues: null
	  }
	}

	componentWillMount() {
		this.animations = [];
		this.animationValues = [];
	}

	rotate(degree, duration = 500) {
		this.animations.push({
			type: 'rotate',
			value: degree,
			duration
		});

		return this;
	}

	generateAnimations() {
		return this.animations.map(({ type, value, duration }) => {
			switch (type) {
				case ANIMATION_TYPES.ROTATE:
					this.rotation = new Animated.Value(0);

					this.rotationInterpolation = this.rotation.interpolate({
						inputRange: [0, value],
						outputRange: ['0deg', `${value}deg`]
					});

					this.animationValues.push({
						type,
						value: this.rotationInterpolation
					});

					return Animated.timing(
						this.rotation,
						{ toValue: value, duration }
					)
			}
		});
	}

	start() {
		const animations = this.generateAnimations();

		this.setState({ animationValues: this.animationValues }, () => {
			console.log('Starting animation');
			Animated.sequence(animations).start(() => this.setState({ animationValues: null }));
		});
	}

	getStyling() {
		console.log('Getting styling');
		if (!this.state.animationValues) {
			return {};
		}

		const styling = {};

		this.state.animationValues.forEach(({ type, value }) => {
			switch (type) {
				case ANIMATION_TYPES.ROTATE:
					assign(styling, { transform: [{ rotate: value }] });
			}
		});

		return styling;
	};

	render() {
		console.log('Rendering');
		const style = this.getStyling();

	  return (
	    <Animated.View style={ style }>
				{ this.props.children }
			</Animated.View>
	  )
	}
}