import { Animated } from 'react-native';
import { reduce, isEqual, last, forEach, get, isBoolean } from 'lodash';

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
 * Breaks scenario into a sequence of parallel animations, when wait() animation is the divider between them
 *
 * For example, if given the following scenario: '.rotate(10).moveX(10).wait(100).moveY(10)', it will return:
 * [[rotateConfig, moveXConfig], [delay], [moveYConfig]]
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

const createTimingAnimation = (toValue, options, animatedValue) => Animated.timing(
	animatedValue,
	{
		toValue,
		duration: options.duration || DEFAULT_DURATION,
		delay: options.delay || 0
	}
);

const createSpringAnimation = (toValue, { spring }, animatedValue) => {
	return isBoolean(spring)
		? Animated.spring(animatedValue, { toValue })
		: Animated.spring(
			animatedValue, { toValue, ...spring }
		);
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

	let rotateAnimation;

	if (get(animation, 'options.spring')) {
		rotateAnimation = createSpringAnimation(finalAnimationsValues[ROTATE], animation.options, animatedValues[ROTATE]);
	} else {
		rotateAnimation = createTimingAnimation(finalAnimationsValues[ROTATE], animation.options, animatedValues[ROTATE]);
	}

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

	let bgColorAnimation;

	if (get(animation, 'options.spring')) {
		bgColorAnimation = createSpringAnimation(100, animation.options, animatedValues[BACKGROUND_COLOR]);
	} else {
		bgColorAnimation = createTimingAnimation(100, animation.options, animatedValues[BACKGROUND_COLOR]);
	}

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

	let xAnimation;

	if (get(animation, 'options.spring')) {
		xAnimation = createSpringAnimation(finalAnimationsValues[MOVE_X], animation.options, animatedValues[MOVE_X]);
	} else {
		xAnimation = createTimingAnimation(finalAnimationsValues[MOVE_X], animation.options, animatedValues[MOVE_X]);
	}

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

	let yAnimation;

	if (get(animation, 'options.spring')) {
		yAnimation = createSpringAnimation(finalAnimationsValues[MOVE_Y], animation.options, animatedValues[MOVE_Y]);
	} else {
		yAnimation = createTimingAnimation(finalAnimationsValues[MOVE_Y], animation.options, animatedValues[MOVE_Y]);
	}

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

	let scaleAnimation;

	if (get(animation, 'options.spring')) {
		scaleAnimation = createSpringAnimation(animation.value, animation.options, animatedValues[SCALE]);
	} else {
		scaleAnimation = createTimingAnimation(animation.value, animation.options, animatedValues[SCALE]);
	}

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

	let borderRadiusAnimation;

	if (get(animation, 'options.spring')) {
		borderRadiusAnimation = createSpringAnimation(animation.value, animation.options, animatedValues[BORDER_RADIUS]);
	} else {
		borderRadiusAnimation = createTimingAnimation(animation.value, animation.options, animatedValues[BORDER_RADIUS]);
	}

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

	let heightAnimation;

	if (get(animation, 'options.spring')) {
		heightAnimation = createSpringAnimation(animation.value, animation.options, animatedValues[HEIGHT]);
	} else {
		heightAnimation = createTimingAnimation(animation.value, animation.options, animatedValues[HEIGHT]);
	}

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

	let widthAnimation;

	if (get(animation, 'options.spring')) {
		widthAnimation = createSpringAnimation(animation.value, animation.options, animatedValues[WIDTH]);
	} else {
		widthAnimation = createTimingAnimation(animation.value, animation.options, animatedValues[WIDTH]);
	}

	return {
		animation: widthAnimation,
		styling: {
			style: { width: animatedValues[WIDTH] }
		}
	};
};

const wait = (animation) => ({ animation: Animated.delay(animation.duration) });