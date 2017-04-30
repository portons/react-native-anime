import { Animated } from 'react-native';
import { reduce, isEqual, last, forEach, get } from 'lodash';

import { DEFAULT_DURATION, ROTATE, MOVE_Y, MOVE_X, WAIT, DELAY, SCALE, BACKGROUND_COLOR, BORDER_RADIUS, WIDTH, HEIGHT } from './constants';

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
	const finalAnimationsValues = {};
	const sequenceAnimations = [];
	const styles = [ // transform is always first in array for convenience
		{
			transform: []
		}
	];

	forEach(sequences, (parallels) => {
		const currentPartAnimations = [];

		forEach(parallels, currentAnimation => {
			const { animation, styling } = parseAnimation({
				animation: currentAnimation,
				animatedValues,
				finalAnimationsValues
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

		sequenceAnimations.push(Animated.parallel(currentPartAnimations));
	});

	return {
		sequenceAnimations,
		styles
	}
};

const parseAnimation = ({ animation, animatedValues, finalAnimationsValues }) => {
	switch (animation.type) {
		case ROTATE:
			return rotate(animation, animatedValues, finalAnimationsValues);

		case BACKGROUND_COLOR:
			return backgroundColor(animation, animatedValues, finalAnimationsValues);

		case MOVE_X:
			return moveX(animation, animatedValues, finalAnimationsValues);

		case MOVE_Y:
			return moveY(animation, animatedValues, finalAnimationsValues);

		case SCALE:
			return scale(animation, animatedValues);

		case BORDER_RADIUS:
			return borderRadius(animation, animatedValues);

		case HEIGHT:
			return height(animation, animatedValues, finalAnimationsValues);

		case WIDTH:
			return width(animation, animatedValues, finalAnimationsValues);

		case WAIT:
		case DELAY:
			return { animation: Animated.delay(animation.duration) };
	}
};

const rotate = (animation, animatedValues, finalAnimationsValues) => {
	animatedValues[ROTATE] = animatedValues[ROTATE] || new Animated.Value(0);

	let startingPoint;

	if (!finalAnimationsValues[ROTATE]) {
		finalAnimationsValues[ROTATE] = animation.value;
		startingPoint = 0;
	} else {
		finalAnimationsValues[ROTATE] = finalAnimationsValues[ROTATE] + animation.value;
		startingPoint = finalAnimationsValues[ROTATE] - animation.value;
	}

	const rotateAnimation = Animated.timing(
		animatedValues[ROTATE],
		{ toValue: finalAnimationsValues[ROTATE], duration: get(animation, 'options.duration') || DEFAULT_DURATION }
	);

	const rotationInterpolation = animatedValues[ROTATE].interpolate({
		outputRange: startingPoint > finalAnimationsValues[ROTATE]
			? [`${finalAnimationsValues[ROTATE]}deg`, `${startingPoint}deg`]
			: [`${startingPoint}deg`, `${finalAnimationsValues[ROTATE]}deg`],
		inputRange: startingPoint > finalAnimationsValues[ROTATE]
			? [finalAnimationsValues[ROTATE], startingPoint]
			: [startingPoint, finalAnimationsValues[ROTATE]]
	});

	return {
		animation: rotateAnimation,
		styling: {
			transform: true,
			style: { rotate: rotationInterpolation }
		}
	};
};

const backgroundColor = (animation, animatedValues, finalAnimationsValues) => {
	animatedValues[BACKGROUND_COLOR] = animatedValues[BACKGROUND_COLOR] || new Animated.Value(0);

	if (!finalAnimationsValues[BACKGROUND_COLOR]) {
		finalAnimationsValues[BACKGROUND_COLOR] = animation.value;
	} else {
		finalAnimationsValues[BACKGROUND_COLOR] = finalAnimationsValues[BACKGROUND_COLOR] + animation.value;
	}

	const bgColorAnimation = Animated.timing(
		animatedValues[BACKGROUND_COLOR],
		{ toValue: 100, duration: get(animation, 'options.duration') || DEFAULT_DURATION }
	);

	const bgColorInterpolation = animatedValues[BACKGROUND_COLOR].interpolate({
		inputRange: [0, 100],
		outputRange: [animation.startingColor, animation.value]
	});

	return {
		animation: bgColorAnimation,
		styling: {
			style: { backgroundColor: bgColorInterpolation }
		}
	};
};

const moveX = (animation, animatedValues, finalAnimationsValues) => {
	animatedValues[MOVE_X] = animatedValues[MOVE_X] || new Animated.Value(0);

	if (!finalAnimationsValues[MOVE_X]) {
		finalAnimationsValues[MOVE_X] = animation.value;
	} else {
		finalAnimationsValues[MOVE_X] = finalAnimationsValues[MOVE_X] + animation.value;
	}

	const xAnimation = Animated.timing(
		animatedValues[MOVE_X],
		{ toValue: finalAnimationsValues[MOVE_X], duration: get(animation, 'options.duration') || DEFAULT_DURATION }
	);

	return {
		animation: xAnimation,
		styling: {
			transform: true,
			style: { translateX: animatedValues[MOVE_X] }
		}
	};
};

const moveY = (animation, animatedValues, finalAnimationsValues) => {
	animatedValues[MOVE_Y] = animatedValues[MOVE_Y] || new Animated.Value(0);

	if (!finalAnimationsValues[MOVE_Y]) {
		finalAnimationsValues[MOVE_Y] = animation.value;
	} else {
		finalAnimationsValues[MOVE_Y] = finalAnimationsValues[MOVE_Y] + animation.value;
	}

	const yAnimation = Animated.timing(
		animatedValues[MOVE_Y],
		{ toValue: finalAnimationsValues[MOVE_Y], duration: get(animation, 'options.duration') || DEFAULT_DURATION }
	);

	return {
		animation: yAnimation,
		styling: {
			transform: true,
			style: { translateY: animatedValues[MOVE_Y] }
		}
	};
};

const scale = (animation, animatedValues) => {
	animatedValues[SCALE] = animatedValues[SCALE] || new Animated.Value(1);

	const scaleAnimation = Animated.timing(
		animatedValues[SCALE],
		{ toValue: animation.value, duration: get(animation, 'options.duration') || DEFAULT_DURATION }
	);

	return {
		animation: scaleAnimation,
		styling: {
			transform: true,
			style: { scale: animatedValues[SCALE] }
		}
	};
};

const borderRadius = (animation, animatedValues) => {
	animatedValues[BORDER_RADIUS] = animatedValues[BORDER_RADIUS] || new Animated.Value(0);

	const borderRadiusAnimation = Animated.timing(
		animatedValues[BORDER_RADIUS],
		{ toValue: animation.value, duration: get(animation, 'options.duration') || DEFAULT_DURATION }
	);

	return {
		animation: borderRadiusAnimation,
		styling: {
			style: { borderRadius: animatedValues[BORDER_RADIUS] }
		}
	};
};

const height = (animation, animatedValues, finalAnimationsValues) => {
	animatedValues[HEIGHT] = animatedValues[HEIGHT] || new Animated.Value(animation.height);

	if (!finalAnimationsValues[HEIGHT]) {
		finalAnimationsValues[HEIGHT] = animation.value;
	} else {
		finalAnimationsValues[HEIGHT] = finalAnimationsValues[HEIGHT] + animation.value;
	}

	const heightAnimation = Animated.timing(
		animatedValues[HEIGHT],
		{ toValue: animation.value, duration: get(animation, 'options.duration') || DEFAULT_DURATION }
	);

	return {
		animation: heightAnimation,
		styling: {
			style: { height: animatedValues[HEIGHT] }
		}
	};
};

const width = (animation, animatedValues, finalAnimationsValues) => {
	animatedValues[WIDTH] = animatedValues[WIDTH] || new Animated.Value(animation.width);

	if (!finalAnimationsValues[WIDTH]) {
		finalAnimationsValues[WIDTH] = animation.value;
	} else {
		finalAnimationsValues[WIDTH] = finalAnimationsValues[WIDTH] + animation.value;
	}

	const widthAnimation = Animated.timing(
		animatedValues[WIDTH],
		{ toValue: animation.value, duration: get(animation, 'options.duration') || DEFAULT_DURATION }
	);

	return {
		animation: widthAnimation,
		styling: {
			style: { width: animatedValues[WIDTH] }
		}
	};
};