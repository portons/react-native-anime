import { Animated } from 'react-native';
import { reduce, isEqual, last, forEach, get } from 'lodash';

import { DEFAULT_DURATION, ROTATE, MOVE_Y, MOVE_X, WAIT, DELAY, SCALE, BACKGROUND_COLOR, BORDER_RADIUS, PT_WIDTH,
				 PT_HEIGHT, PERCENTAGE_HEIGHT, PERCENTAGE_WIDTH } from './constants';

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

			const rotationInterpolation = animatedValue.interpolate({
				inputRange: [0, animation.value],
				outputRange: ['0deg', `${animation.value}deg`]
			});

			return {
				animation: rotateAnimation,
				styling: {
					transform: true,
					style: { rotate: rotationInterpolation }
				}
			};

		case BACKGROUND_COLOR:
			animatedValue = new Animated.Value(0);

			const bgColorAnimation = Animated.timing(
				animatedValue,
				{ toValue: 100, duration: get(animation, 'options.duration') || DEFAULT_DURATION }
			);

			const bgColorInterpolation = animatedValue.interpolate({
				inputRange: [0, 100],
				outputRange: [get(animation, 'options.from') || 'white', animation.value]
			});

			return {
				animation: bgColorAnimation,
				styling: {
					style: { backgroundColor: bgColorInterpolation }
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

		case SCALE:
			animatedValue = new Animated.Value(1);

			const scaleAnimation = Animated.timing(
				animatedValue,
				{ toValue: animation.value, duration: get(animation, 'options.duration') || DEFAULT_DURATION }
			);

			return {
				animation: scaleAnimation,
				styling: {
					transform: true,
					style: { scale: animatedValue }
				}
			};

		case BORDER_RADIUS:
			animatedValue = new Animated.Value(1);

			const borderRadiusAnimation = Animated.timing(
				animatedValue,
				{ toValue: animation.value, duration: get(animation, 'options.duration') || DEFAULT_DURATION }
			);

			return {
				animation: borderRadiusAnimation,
				styling: {
					style: { borderRadius: animatedValue }
				}
			};

		case PT_HEIGHT:
			animatedValue = new Animated.Value(0);

			const ptHeightAnimation = Animated.timing(
				animatedValue,
				{ toValue: animation.value, duration: get(animation, 'options.duration') || DEFAULT_DURATION }
			);

			return {
				animation: ptHeightAnimation,
				styling: {
					style: { height: animatedValue }
				}
			};

		case PT_WIDTH:
			animatedValue = new Animated.Value(0);

			const ptWidthAnimation = Animated.timing(
				animatedValue,
				{ toValue: animation.value, duration: get(animation, 'options.duration') || DEFAULT_DURATION }
			);

			return {
				animation: ptWidthAnimation,
				styling: {
					style: { width: animatedValue }
				}
			};

		case PERCENTAGE_HEIGHT:
			animatedValue = new Animated.Value(0);

			const percentageHeightAnimation = Animated.timing(
				animatedValue,
				{ toValue: 100, duration: get(animation, 'options.duration') || DEFAULT_DURATION }
			);

			const percentageHeightInterpolation = animatedValue.interpolate({
				inputRange: [0, 100],
				outputRange: ['0%', `${animation.value}%`]
			});

			return {
				animation: percentageHeightAnimation,
				styling: {
					style: { height: percentageHeightInterpolation }
				}
			};

		case PERCENTAGE_WIDTH:
			animatedValue = new Animated.Value(0);

			const percentageWidthAnimation = Animated.timing(
				animatedValue,
				{ toValue: 100, duration: get(animation, 'options.duration') || DEFAULT_DURATION }
			);

			const percentageWidthInterpolation = animatedValue.interpolate({
				inputRange: [0, 100],
				outputRange: ['0%', `${animation.value}%`]
			});

			return {
				animation: percentageWidthAnimation,
				styling: {
					style: { width: percentageWidthInterpolation }
				}
			};

		case WAIT:
		case DELAY:
			return {
				animation: Animated.delay(animation.duration)
			};
	}
};