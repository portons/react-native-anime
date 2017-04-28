import { Animated } from 'react-native';
import { reduce, isEqual, last, forEach, get } from 'lodash';

import { DEFAULT_DURATION, ROTATE, MOVE_Y, MOVE_X, WAIT, DELAY } from './constants';

export const scenarioParser = (scenario) => {
	const scenarioParts = reduce(scenario, (acc, animation, index) => {
		const lastAnimation = last(acc);

		switch (animation.type) {
			// WAIT animation breaks the main animation into sequences. Each sequence runs animations in parallel
			case WAIT:
				// Creating new animation sequence, with Animated.delay as its first animation, to simulate waiting
				if (!isEqual(index, scenario.length - 1)) {
					acc.push([animation]);
				}

				break;

			// Pushes Animated.delay before the last added animation
			case DELAY:
				const arrayLen = lastAnimation.length;

				lastAnimation.splice(arrayLen - 1, 0, animation);
				break;

			default:
				lastAnimation.push(animation);
		}

		return acc;
	}, [[]]);

	const animations = [];
	const styles = [ // transform is always first in array for convenience
		{
			transform: []
		}
	];

	forEach(scenarioParts, (partAnimations) => {
		const currentPartAnimations = [];

		forEach(partAnimations, currentAnimation => {
			const { animation, styling } = parseAnimation({ animation: currentAnimation });

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

const parseAnimation = ({ animation }) => {
	let animatedValue;

	switch (animation.type) {
		case ROTATE:
			animatedValue = new Animated.Value(0);

			const rotateAnimation = Animated.timing(
				animatedValue,
				{ toValue: animation.value, duration: get(animation, 'options.duration') || DEFAULT_DURATION }
			);

			const interpolation = animatedValue.interpolate({
				inputRange: [0, animation.value],
				outputRange: ['0deg', `${animation.value}deg`]
			});

			return {
				animation: rotateAnimation,
				styling: {
					transform: true,
					style: { rotate: interpolation }
				}
			};

		case MOVE_X:
			animatedValue = new Animated.Value(0);

			const xAnimation = Animated.timing(
				animatedValue,
				{ toValue: animation.value, duration: get(animation, 'options.duration') || DEFAULT_DURATION }
			);

			return {
				animation: xAnimation,
				styling: {
					transform: true,
					style: { translateX: animatedValue }
				}
			};

		case MOVE_Y:
			animatedValue = new Animated.Value(0);

			const yAnimation = Animated.timing(
				animatedValue,
				{ toValue: animation.value, duration: get(animation, 'options.duration') || DEFAULT_DURATION }
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
				animation: Animated.delay(animation.duration)
			};
	}
};