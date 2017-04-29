import { Animated } from 'react-native';
import { reduce, isEqual, last, forEach, get } from 'lodash';

import { DEFAULT_DURATION, ROTATE, MOVE_Y, MOVE_X, WAIT, DELAY, SCALE, BACKGROUND_COLOR, BORDER_RADIUS, PT_WIDTH,
				 PT_HEIGHT, PERCENTAGE_HEIGHT, PERCENTAGE_WIDTH } from './constants';

export const scenarioParser = ({ scenario, animatedValues }) => {
	const { sequenceAnimations, styles } = createAnimations(breakScenarioIntoSequences(scenario), animatedValues);

	return {
		animations: Animated.sequence(sequenceAnimations),
		animatedValues,
		styles
	}
};

const breakScenarioIntoSequences = (scenario) => reduce(scenario, (acc, animation, index) => {
	const lastAnimation = last(acc);

	switch (animation.type) {
		// WAIT animation breaks the main animation into sequences. Each sequence runs animations in parallel
		case WAIT:
			if (!isEqual(index, scenario.length - 1)) {
				acc.push([animation]);
				acc.push([]);
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

const createAnimations = (sequences, animatedValues) => {
	const sequenceAnimations = [];
	const styles = [ // transform is always first in array for convenience
		{
			transform: []
		}
	];

	forEach(sequences, (parallels) => {
		const currentPartAnimations = [];

		forEach(parallels, currentAnimation => {
			const { animation, styling } = parseAnimation({ animation: currentAnimation, animatedValues });

			currentPartAnimations.push(animation);

			if (styling) {
				if (styling.transform) {
					styles[0].transform.push(styling.style)
				} else {
					styles.push(styling.style)
				}
			}
		});

		sequenceAnimations.push(Animated.parallel(currentPartAnimations));
	});

	return {
		sequenceAnimations,
		styles
	}
};

const parseAnimation = ({ animation, animatedValues }) => {
	let animatedValue;

	switch (animation.type) {
		case ROTATE:
			if (!animatedValues[ROTATE]) {
				animatedValues[ROTATE] = new Animated.Value(0);
			}

			animatedValue = animatedValues[ROTATE];

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
			if (!animatedValues[BACKGROUND_COLOR]) {
				animatedValues[BACKGROUND_COLOR] = new Animated.Value(0);
			}

			animatedValue = animatedValues[BACKGROUND_COLOR];

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
			if (!animatedValues[MOVE_X]) {
				animatedValues[MOVE_X] = new Animated.Value(0);
			}

			animatedValue = animatedValues[MOVE_X];

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
			if (!animatedValues[MOVE_Y]) {
				animatedValues[MOVE_Y] = new Animated.Value(0);
			}

			animatedValue = animatedValues[MOVE_Y];

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
			if (!animatedValues[SCALE]) {
				animatedValues[SCALE] = new Animated.Value(1);
			}

			animatedValue = animatedValues[SCALE];

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
			if (!animatedValues[BORDER_RADIUS]) {
				animatedValues[BORDER_RADIUS] = new Animated.Value(0);
			}

			animatedValue = animatedValues[BORDER_RADIUS];

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
			if (!animatedValues[PT_HEIGHT]) {
				animatedValues[PT_HEIGHT] = new Animated.Value(0);
			}

			animatedValue = animatedValues[PT_HEIGHT];

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
			if (!animatedValues[PT_WIDTH]) {
				animatedValues[PT_WIDTH] = new Animated.Value(0);
			}

			animatedValue = animatedValues[PT_WIDTH];

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
			if (!animatedValues[PERCENTAGE_HEIGHT]) {
				animatedValues[PERCENTAGE_HEIGHT] = new Animated.Value(0);
			}

			animatedValue = animatedValues[PERCENTAGE_HEIGHT];

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
			if (!animatedValues[PERCENTAGE_WIDTH]) {
				animatedValues[PERCENTAGE_WIDTH] = new Animated.Value(0);
			}

			animatedValue = animatedValues[PERCENTAGE_WIDTH];

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