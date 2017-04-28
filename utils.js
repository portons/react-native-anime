import { Animated } from 'react-native';
import { reduce, isEqual, last, forEach } from 'lodash';

import { DEFAULT_DURATION, ROTATE, MOVE_Y, MOVE_X, WAIT, DELAY, DURATION, DEFAULT_SCENARIO_PART } from './constants';

export const scenarioParser = (scenario) => {
	const scenarioParts = reduce(scenario, (acc, animation, index) => {
		const lastAnimation = last(acc);

		switch (animation.type) {
			case WAIT:
				if (!isEqual(index, scenario.length - 1)) {
					acc.push({
						animatedValue: new Animated.Value(0),
						duration: animation.duration || DEFAULT_DURATION,
						animations: [animation]
					});
				}

				break;

			case DURATION:
				lastAnimation.duration = animation.duration;
				break;

			case DELAY:
				const arrayLen = lastAnimation.animations.length;

				lastAnimation.animations.splice(arrayLen - 1, 0, animation);
				break;

			default:
				lastAnimation.animations.push(animation);
		}

		return acc;
	}, [DEFAULT_SCENARIO_PART]);

	const animations = [];
	const styles = [
		{
			transform: []
		}
	];

	forEach(scenarioParts, (partAnimations) => {
		const animatedValue = partAnimations.animatedValue;
		const currentPartAnimations = [];

		forEach(partAnimations.animations, currentAnimation => {
			const { animation, styling } = parseAnimation({
				currentAnimation,
				animatedValue,
				duration: partAnimations.duration
			});

			currentPartAnimations.push(animation);

			if (styling) {
				if (styling.transform) {
					styles[0].transform.push(styling.style)
				} else {
					styles.push(styling.style)
				}
			}
		});

		animations.push(Animated.parallel(currentPartAnimations));
	});

	return {
		animations: Animated.sequence(animations),
		styles
	}
};

const parseAnimation = ({ currentAnimation, animatedValue, duration }) => {
	switch (currentAnimation.type) {
		case ROTATE:
			const rotateAnimation = Animated.timing(
				animatedValue,
				{ toValue: currentAnimation.degrees, duration }
			);

			const interpolation = animatedValue.interpolate({
				inputRange: [0, currentAnimation.degrees],
				outputRange: ['0deg', `${currentAnimation.degrees}deg`]
			});

			return {
				animation: rotateAnimation,
				styling: {
					transform: true,
					style: { rotate: interpolation }
				}
			};

		case MOVE_X:
			const xAnimation = Animated.timing(
				animatedValue,
				{ toValue: currentAnimation.distance, duration }
			);

			return {
				animation: xAnimation,
				styling: {
					transform: true,
					style: { translateX: animatedValue }
				}
			};

		case MOVE_Y:
			const yAnimation = Animated.timing(
				animatedValue,
				{ toValue: currentAnimation.distance, duration }
			);

			return {
				animation: yAnimation,
				styling: {
					transform: true,
					style: { translateY: animatedValue }
				}
			};

		case WAIT:
		case DELAY:
			return {
				animation: Animated.delay(currentAnimation.duration)
			};
	}
};