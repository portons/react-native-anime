import { Animated } from 'react-native';
import { reduce, isEqual, last, forEach, get } from 'lodash';

import {
	DEFAULT_DURATION,
	ROTATE,
	MOVE_Y,
	MOVE_X,
	WAIT,
	SCALE,
	BACKGROUND_COLOR,
	BORDER_RADIUS,
	WIDTH,
	HEIGHT
} from './constants';

/*
 * Parses the whole scenario, and returns: final Animated object, updated styles, updated Animated values
 *
 * @param scenario - a list of animation configs which are used to build the whole animation sequence
 * @param animatedValues - an object consisting of 'type: animated.value' pairs. If the component was already animated,
 * we use these values to 'continue' the animations from their last state and not start over from original state
 *
 * @return ({
 *  - animations: the final Animated object, which is a sequence of parallel animations
 *  - animatedValues: updated collection of animated values with new values for new types of animations
 *  - styles: a list of styles connected to their Animated values
 * })
 */
export const scenarioParser = ({ scenario, animatedValues }) => {
	// Break the main scenario into sequence of parallel animations, and then build the final animation using previously used Animated values
	const { sequenceAnimations, styles } = createAnimations(breakScenarioIntoSequences(scenario), animatedValues);

	return {
		animations: Animated.sequence(sequenceAnimations),
		animatedValues,
		styles
	}
};

/*
 * Breaks a scenario into a sequence of parallel animations, when the wait() animation is the divider between them
 * For example, if given the following scenario: '.rotate(10).moveX(10).wait(100).moveY(10)', it will build:
 * Animated.sequence([
 * 	Animated.parallel([
 * 		Animated.timing(rotateAnimatedValue, { toValue: 10 }),
 * 		Animated.timing(translateXAnimatedValue, { toValue: 10 })
 * 	]),
 * 	Animated.parallel([
 * 		Animated.delay(100)
 * 	]),
 * 	Animated.parallel([
 * 		Animated.timing(translateYAnimatedValue, { toValue: 10 })
 * 	])
 * ])
 *
 * @param scenario - a list of animations configs used to build the whole animation
 */
const breakScenarioIntoSequences = (scenario) => reduce(scenario, (acc, animation, index) => {
	const lastAnimation = last(acc);

	switch (animation.type) {
		case WAIT:
			if (!isEqual(index, scenario.length - 1)) {
				acc.push([animation]);
				acc.push([]);
			}

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
			return wait(animation);
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

const wait = (animation) => ({ animation: Animated.delay(animation.duration) });