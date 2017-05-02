import { Animated } from 'react-native';

import { get, isBoolean, property } from 'lodash';

import {
	DEFAULT_DURATION,
	ROTATE,
	MOVE_Y,
	MOVE_X,
	SCALE,
	BACKGROUND_COLOR,
	BORDER_RADIUS,
	BORDER_WIDTH,
	WIDTH,
	HEIGHT,
	ZERO,
	ONE,
	FONT,
	COLOR,
	DEFAULT_VALUES,
	BORDER_COLOR,
	FONT_SIZE,
	OPACITY
} from './constants';

// Utils methods
const noEasing = (value) => value;

const defaultStyle = (animationConfig, styleName, type) => {
	const style = get(animationConfig, `defaultStyle.${styleName}`);

	return style || DEFAULT_VALUES[type];
};

const defaultTransformStyle = (animationConfig, styleName, type) => {
	const transform = get(animationConfig, `defaultStyle.transform`);

	if (!transform) return DEFAULT_VALUES[type];

	const style = transform.map(property(styleName));

	return style[0] || DEFAULT_VALUES[type];
};

const createTimingAnimation = (toValue, options, animatedValue) => {
	return Animated.timing(
		animatedValue,
		{
			toValue,
			duration: options.duration || DEFAULT_DURATION,
			delay: options.delay || 0,
			easing: options.easing || noEasing
		}
	);
};

const createSpringAnimation = (toValue, { spring }, animatedValue) => {
	return isBoolean(spring)
		? Animated.spring(animatedValue, { toValue })
		: Animated.spring(
			animatedValue, { toValue, ...spring }
		);
};

// Animation creators

export const moveX = (animationConfig, animatedValues, finalAnimationsValues) => {
	const defaultMoveXValue = defaultTransformStyle(animationConfig, 'translateX', ZERO);

	animatedValues[MOVE_X] = animatedValues[MOVE_X] || new Animated.Value(defaultMoveXValue);

	if (!finalAnimationsValues[MOVE_X]) {
		finalAnimationsValues[MOVE_X] = animationConfig.value + defaultMoveXValue;
	} else {
		finalAnimationsValues[MOVE_X] = finalAnimationsValues[MOVE_X] + animationConfig.value;
	}

	let animation;

	if (get(animationConfig, 'options.spring')) {
		animation = createSpringAnimation(finalAnimationsValues[MOVE_X], animationConfig.options, animatedValues[MOVE_X]);
	} else {
		animation = createTimingAnimation(finalAnimationsValues[MOVE_X], animationConfig.options, animatedValues[MOVE_X]);
	}

	return {
		animation,
		styling: {
			transform: true,
			style: { translateX: animatedValues[MOVE_X] }
		}
	};
};

export const moveY = (animationConfig, animatedValues, finalAnimationsValues) => {
	const defaultMoveYValue = defaultTransformStyle(animationConfig, 'translateY', ZERO);

	animatedValues[MOVE_Y] = animatedValues[MOVE_Y] || new Animated.Value(defaultMoveYValue);

	if (!finalAnimationsValues[MOVE_Y]) {
		finalAnimationsValues[MOVE_Y] = animationConfig.value + defaultMoveYValue;
	} else {
		finalAnimationsValues[MOVE_Y] = finalAnimationsValues[MOVE_Y] + animationConfig.value;
	}

	let animation;

	if (get(animationConfig, 'options.spring')) {
		animation = createSpringAnimation(finalAnimationsValues[MOVE_Y], animationConfig.options, animatedValues[MOVE_Y]);
	} else {
		animation = createTimingAnimation(finalAnimationsValues[MOVE_Y], animationConfig.options, animatedValues[MOVE_Y]);
	}

	return {
		animation,
		styling: {
			transform: true,
			style: { translateY: animatedValues[MOVE_Y] }
		}
	};
};

// TODO: Fix when default style provided. Uses interpolation :(
export const rotate = (animationConfig, animatedValues, finalAnimationsValues) => {
	animatedValues[ROTATE] = animatedValues[ROTATE] || new Animated.Value(0);

	let startingPoint;

	if (!finalAnimationsValues[ROTATE]) {
		finalAnimationsValues[ROTATE] = animationConfig.value;
		startingPoint = 0;
	} else {
		finalAnimationsValues[ROTATE] = finalAnimationsValues[ROTATE] + animationConfig.value;
		startingPoint = finalAnimationsValues[ROTATE] - animationConfig.value;
	}

	let animation;

	if (get(animationConfig, 'options.spring')) {
		animation = createSpringAnimation(finalAnimationsValues[ROTATE], animationConfig.options, animatedValues[ROTATE]);
	} else {
		animation = createTimingAnimation(finalAnimationsValues[ROTATE], animationConfig.options, animatedValues[ROTATE]);
	}

	const interpolation = animatedValues[ROTATE].interpolate({
		outputRange: startingPoint > finalAnimationsValues[ROTATE]
			? [`${finalAnimationsValues[ROTATE]}deg`, `${startingPoint}deg`]
			: [`${startingPoint}deg`, `${finalAnimationsValues[ROTATE]}deg`],
		inputRange: startingPoint > finalAnimationsValues[ROTATE]
			? [finalAnimationsValues[ROTATE], startingPoint]
			: [startingPoint, finalAnimationsValues[ROTATE]]
	});

	return {
		animation,
		styling: {
			transform: true,
			style: { rotate: interpolation }
		}
	};
};

// TODO: Fix scale when more than 1 animation
export const scale = (animationConfig, animatedValues) => {
	animatedValues[SCALE] = animatedValues[SCALE] ||
													new Animated.Value(defaultTransformStyle(animationConfig, 'scale', ONE));

	let animation;

	if (get(animationConfig, 'options.spring')) {
		animation = createSpringAnimation(animationConfig.value, animationConfig.options, animatedValues[SCALE]);
	} else {
		animation = createTimingAnimation(animationConfig.value, animationConfig.options, animatedValues[SCALE]);
	}

	return {
		animation,
		styling: {
			transform: true,
			style: { scale: animatedValues[SCALE] }
		}
	};
};

export const borderRadius = (animationConfig, animatedValues) => {
	animatedValues[BORDER_RADIUS] = animatedValues[BORDER_RADIUS] ||
		new Animated.Value(defaultStyle(animationConfig, 'borderRadius', ZERO));

	let animation;

	if (get(animationConfig, 'options.spring')) {
		animation = createSpringAnimation(animationConfig.value, animationConfig.options, animatedValues[BORDER_RADIUS]);
	} else {
		animation = createTimingAnimation(animationConfig.value, animationConfig.options, animatedValues[BORDER_RADIUS]);
	}

	return {
		animation,
		styling: {
			style: { borderRadius: animatedValues[BORDER_RADIUS] }
		}
	};
};

export const borderWidth = (animationConfig, animatedValues) => {
	animatedValues[BORDER_WIDTH] = animatedValues[BORDER_WIDTH] ||
		new Animated.Value(defaultStyle(animationConfig, 'borderWidth', ZERO));

	let animation;

	if (get(animationConfig, 'options.spring')) {
		animation = createSpringAnimation(animationConfig.value, animationConfig.options, animatedValues[BORDER_WIDTH]);
	} else {
		animation = createTimingAnimation(animationConfig.value, animationConfig.options, animatedValues[BORDER_WIDTH]);
	}

	return {
		animation,
		styling: {
			style: { borderWidth: animatedValues[BORDER_WIDTH] }
		}
	};
};

export const height = (animationConfig, animatedValues, finalAnimationsValues) => {
	animatedValues[HEIGHT] = animatedValues[HEIGHT] || new Animated.Value(animationConfig.height);

	if (!finalAnimationsValues[HEIGHT]) {
		finalAnimationsValues[HEIGHT] = animationConfig.value;
	} else {
		finalAnimationsValues[HEIGHT] = finalAnimationsValues[HEIGHT] + animationConfig.value;
	}

	let animation;

	if (get(animationConfig, 'options.spring')) {
		animation = createSpringAnimation(animationConfig.value, animationConfig.options, animatedValues[HEIGHT]);
	} else {
		animation = createTimingAnimation(animationConfig.value, animationConfig.options, animatedValues[HEIGHT]);
	}

	return {
		animation,
		styling: {
			style: { height: animatedValues[HEIGHT] }
		}
	};
};

export const fontSize = (animationConfig, animatedValues, finalAnimationsValues) => {
	animatedValues[FONT_SIZE] = animatedValues[FONT_SIZE] ||
													 		new Animated.Value(defaultStyle(animationConfig, 'fontSize', FONT));

	if (!finalAnimationsValues[FONT_SIZE]) {
		finalAnimationsValues[FONT_SIZE] = animationConfig.value;
	} else {
		finalAnimationsValues[FONT_SIZE] = finalAnimationsValues[FONT_SIZE] + animationConfig.value;
	}

	let animation;

	if (get(animationConfig, 'options.spring')) {
		animation = createSpringAnimation(animationConfig.value, animationConfig.options, animatedValues[FONT_SIZE]);
	} else {
		animation = createTimingAnimation(animationConfig.value, animationConfig.options, animatedValues[FONT_SIZE]);
	}

	return {
		animation,
		styling: {
			style: { fontSize: animatedValues[FONT_SIZE] }
		}
	};
};

export const width = (animationConfig, animatedValues, finalAnimationsValues) => {
	animatedValues[WIDTH] = animatedValues[WIDTH] || new Animated.Value(animationConfig.width);

	if (!finalAnimationsValues[WIDTH]) {
		finalAnimationsValues[WIDTH] = animationConfig.value;
	} else {
		finalAnimationsValues[WIDTH] = finalAnimationsValues[WIDTH] + animationConfig.value;
	}

	let animation;

	if (get(animationConfig, 'options.spring')) {
		animation = createSpringAnimation(animationConfig.value, animationConfig.options, animatedValues[WIDTH]);
	} else {
		animation = createTimingAnimation(animationConfig.value, animationConfig.options, animatedValues[WIDTH]);
	}

	return {
		animation,
		styling: {
			style: { width: animatedValues[WIDTH] }
		}
	};
};

export const opacity = (animationConfig, animatedValues) => {
	animatedValues[OPACITY] = animatedValues[OPACITY] ||
														new Animated.Value(defaultStyle(animationConfig, 'opacity', ONE));

	let animation;

	if (get(animationConfig, 'options.spring')) {
		animation = createSpringAnimation(animationConfig.value, animationConfig.options, animatedValues[OPACITY]);
	} else {
		animation = createTimingAnimation(animationConfig.value, animationConfig.options, animatedValues[OPACITY]);
	}

	return {
		animation,
		styling: {
			style: { opacity: animatedValues[OPACITY] }
		}
	};
};

export const wait = (animation) => ({ animation: Animated.delay(animation.duration) });

// COLOR INTERPOLATIONS: MUCH MORE DIFFICULT THAT REGULAR ANIMATIONS

/*
 * The problem with colors animations is that we have to interpolate. We can't just make Animated.Value('blue') and then
 * change it with Animated.timing(toValue: 'red'). We have to interpolate it based on a numeric Animated value. But, if there
 * are numerous color changes on same scenario, then we also have to update the interpolation for each new animation,
 * and not simply create a new one. That's the reason for all the 'complicated' logic.
 */
export const backgroundColor = (animationConfig, animatedValues, finalAnimationsValues) => {
	// Check for previously initiated backgroundColor Animated value.
	// 'backgroundAnimatedValue' holds the Animated.Value we're changing, and 'lastAnimationValues'	holds the data for
	// the interpolation, for last used color, and for the last numValue we use to animate to with our Animated value.
	const backgroundAnimatedValue = animatedValues[BACKGROUND_COLOR];
	const lastAnimationValues = finalAnimationsValues[BACKGROUND_COLOR];

	// Initiate the backgroundColor Animated value
	animatedValues[BACKGROUND_COLOR] = backgroundAnimatedValue || new Animated.Value(0);

	// The value should run from last Animated.Value._value to += 100, or,
	// if it's the first bgColor animation, from 0 to 100
	const toValue = lastAnimationValues ? lastAnimationValues.numValue : 100;

	let animation;

	if (get(animationConfig, 'options.spring')) {
		animation = createSpringAnimation(toValue, animationConfig.options, animatedValues[BACKGROUND_COLOR]);
	} else {
		animation = createTimingAnimation(toValue, animationConfig.options, animatedValues[BACKGROUND_COLOR]);
	}

	let interpolation;
	let newInputRange;
	let newOutputRange;

	// If there's an 'interpolation', then it's not the first animation of the background color. In this case, we have
	// to adjust this specific animation to take into consideration all the previous bgColor animations to make it continuous.
	if (lastAnimationValues) {
		const { inputRange, outputRange } = lastAnimationValues.interpolation;
		newInputRange = [...inputRange, toValue];
		newOutputRange = [...outputRange, animationConfig.value];

		interpolation = animatedValues[BACKGROUND_COLOR].interpolate({
			inputRange: newInputRange,
			outputRange: newOutputRange
		});
	} else {
		newInputRange  = [0, 100];
		newOutputRange = [defaultStyle(animationConfig, 'backgroundColor', COLOR), animationConfig.value];

		interpolation = animatedValues[BACKGROUND_COLOR].interpolate({
			inputRange: newInputRange,
			outputRange: newOutputRange
		});
	}

	// Update the last used background color, the numeric value on which we interpolate, and the interpolation ranges
	if (finalAnimationsValues[BACKGROUND_COLOR]) {
		finalAnimationsValues[BACKGROUND_COLOR] = {
			color: animationConfig.value,
			numValue: finalAnimationsValues[BACKGROUND_COLOR].numValue + 100,
			interpolation: {
				inputRange: newInputRange,
				outputRange: newOutputRange
			}
		}
	} else {
		finalAnimationsValues[BACKGROUND_COLOR] = {
			color: animationConfig.value,
			numValue: 200,
			interpolation: {
				inputRange: newInputRange,
				outputRange: newOutputRange
			}
		}
	}

	return {
		animation,
		styling: {
			style: { backgroundColor: interpolation }
		}
	};
};

export const borderColor = (animationConfig, animatedValues, finalAnimationsValues) => {
	const backgroundAnimatedValue = animatedValues[BORDER_COLOR];
	const lastAnimationValues = finalAnimationsValues[BORDER_COLOR];

	animatedValues[BORDER_COLOR] = backgroundAnimatedValue || new Animated.Value(0);

	const toValue = lastAnimationValues ? lastAnimationValues.numValue : 100;

	let animation;

	if (get(animationConfig, 'options.spring')) {
		animation = createSpringAnimation(toValue, animationConfig.options, animatedValues[BORDER_COLOR]);
	} else {
		animation = createTimingAnimation(toValue, animationConfig.options, animatedValues[BORDER_COLOR]);
	}

	let interpolation;
	let newInputRange;
	let newOutputRange;

	if (lastAnimationValues) {
		const { inputRange, outputRange } = lastAnimationValues.interpolation;
		newInputRange = [...inputRange, toValue];
		newOutputRange = [...outputRange, animationConfig.value];

		interpolation = animatedValues[BORDER_COLOR].interpolate({
			inputRange: newInputRange,
			outputRange: newOutputRange
		});
	} else {
		newInputRange  = [0, 100];
		newOutputRange = [defaultStyle(animationConfig, 'borderColor', COLOR), animationConfig.value];

		interpolation = animatedValues[BORDER_COLOR].interpolate({
			inputRange: newInputRange,
			outputRange: newOutputRange
		});
	}

	// Update the last used background color, the numeric value on which we interpolate, and the interpolation ranges
	if (finalAnimationsValues[BORDER_COLOR]) {
		finalAnimationsValues[BORDER_COLOR] = {
			color: animationConfig.value,
			numValue: finalAnimationsValues[BORDER_COLOR].numValue + 100,
			interpolation: {
				inputRange: newInputRange,
				outputRange: newOutputRange
			}
		}
	} else {
		finalAnimationsValues[BORDER_COLOR] = {
			color: animationConfig.value,
			numValue: 200,
			interpolation: {
				inputRange: newInputRange,
				outputRange: newOutputRange
			}
		}
	}

	return {
		animation,
		styling: {
			style: { borderColor: interpolation }
		}
	};
};

export const color = (animationConfig, animatedValues, finalAnimationsValues) => {
	const backgroundAnimatedValue = animatedValues[COLOR];
	const lastAnimationValues = finalAnimationsValues[COLOR];

	animatedValues[COLOR] = backgroundAnimatedValue || new Animated.Value(0);

	const toValue = lastAnimationValues ? lastAnimationValues.numValue : 100;

	let animation;

	if (get(animationConfig, 'options.spring')) {
		animation = createSpringAnimation(toValue, animationConfig.options, animatedValues[COLOR]);
	} else {
		animation = createTimingAnimation(toValue, animationConfig.options, animatedValues[COLOR]);
	}

	let interpolation;
	let newInputRange;
	let newOutputRange;

	if (lastAnimationValues) {
		const { inputRange, outputRange } = lastAnimationValues.interpolation;
		newInputRange = [...inputRange, toValue];
		newOutputRange = [...outputRange, animationConfig.value];

		interpolation = animatedValues[COLOR].interpolate({
			inputRange: newInputRange,
			outputRange: newOutputRange
		});
	} else {
		newInputRange  = [0, 100];
		newOutputRange = [defaultStyle(animationConfig, 'color', COLOR), animationConfig.value];

		interpolation = animatedValues[COLOR].interpolate({
			inputRange: newInputRange,
			outputRange: newOutputRange
		});
	}

	// Update the last used background color, the numeric value on which we interpolate, and the interpolation ranges
	if (finalAnimationsValues[COLOR]) {
		finalAnimationsValues[COLOR] = {
			color: animationConfig.value,
			numValue: finalAnimationsValues[COLOR].numValue + 100,
			interpolation: {
				inputRange: newInputRange,
				outputRange: newOutputRange
			}
		}
	} else {
		finalAnimationsValues[COLOR] = {
			color: animationConfig.value,
			numValue: 200,
			interpolation: {
				inputRange: newInputRange,
				outputRange: newOutputRange
			}
		}
	}

	return {
		animation,
		styling: {
			style: { color: interpolation }
		}
	};
};