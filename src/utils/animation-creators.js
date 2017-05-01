import { Animated } from 'react-native';

import { get, isBoolean } from 'lodash';

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

// TODO: Make colors work when more than 1 color animation
//export const backgroundColor = (animationConfig, animatedValues, finalAnimationsValues) => {
//	animatedValues[BACKGROUND_COLOR] = animatedValues[BACKGROUND_COLOR] || new Animated.Value(0);
//
//	if (!finalAnimationsValues[BACKGROUND_COLOR]) {
//		finalAnimationsValues[BACKGROUND_COLOR] = animationConfig.value;
//	} else {
//		finalAnimationsValues[BACKGROUND_COLOR] = finalAnimationsValues[BACKGROUND_COLOR] + animationConfig.value;
//	}
//
//	let animation;
//
//	if (get(animationConfig, 'options.spring')) {
//		animation = createSpringAnimation(100, animationConfig.options, animatedValues[BACKGROUND_COLOR]);
//	} else {
//		animation = createTimingAnimation(100, animationConfig.options, animatedValues[BACKGROUND_COLOR]);
//	}
//
//	const interpolation = animatedValues[BACKGROUND_COLOR].interpolate({
//		inputRange: [0, 100],
//		outputRange: [defaultStyle(animationConfig, 'backgroundColor', COLOR), animationConfig.value]
//	});
//
//	return {
//		animation,
//		styling: {
//			style: { backgroundColor: interpolation }
//		}
//	};
//};

//export const borderColor = (animationConfig, animatedValues, finalAnimationsValues) => {
//	animatedValues[BORDER_COLOR] = animatedValues[BORDER_COLOR] || new Animated.Value(0);
//
//	if (!finalAnimationsValues[BORDER_COLOR]) {
//		finalAnimationsValues[BORDER_COLOR] = animationConfig.value;
//	} else {
//		finalAnimationsValues[BORDER_COLOR] = finalAnimationsValues[BORDER_COLOR] + animationConfig.value;
//	}
//
//	let animation;
//
//	if (get(animationConfig, 'options.spring')) {
//		animation = createSpringAnimation(100, animationConfig.options, animatedValues[BORDER_COLOR]);
//	} else {
//		animation = createTimingAnimation(100, animationConfig.options, animatedValues[BORDER_COLOR]);
//	}
//
//	const interpolation = animatedValues[BORDER_COLOR].interpolate({
//		inputRange: [0, 100],
//		outputRange: [defaultStyle(animationConfig, 'borderColor', COLOR), animationConfig.value]
//	});
//
//	return {
//		animation,
//		styling: {
//			style: { borderColor: interpolation }
//		}
//	};
//};

//export const color = (animationConfig, animatedValues, finalAnimationsValues) => {
//	animatedValues[COLOR] = animatedValues[COLOR] || new Animated.Value(0);
//
//	if (!finalAnimationsValues[COLOR]) {
//		finalAnimationsValues[COLOR] = animationConfig.value;
//	} else {
//		finalAnimationsValues[COLOR] = finalAnimationsValues[COLOR] + animationConfig.value;
//	}
//
//	let animation;
//
//	if (get(animationConfig, 'options.spring')) {
//		animation = createSpringAnimation(100, animationConfig.options, animatedValues[COLOR]);
//	} else {
//		animation = createTimingAnimation(100, animationConfig.options, animatedValues[COLOR]);
//	}
//
//	const interpolation = animatedValues[COLOR].interpolate({
//		inputRange: [0, 100],
//		outputRange: [defaultStyle(animationConfig, 'color', COLOR), animationConfig.value]
//	});
//
//	return {
//		animation,
//		styling: {
//			style: { color: interpolation }
//		}
//	};
//};

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

export const moveX = (animationConfig, animatedValues, finalAnimationsValues) => {
	animatedValues[MOVE_X] = animatedValues[MOVE_X] || new Animated.Value(0);

	if (!finalAnimationsValues[MOVE_X]) {
		finalAnimationsValues[MOVE_X] = animationConfig.value;
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
	animatedValues[MOVE_Y] = animatedValues[MOVE_Y] || new Animated.Value(0);

	if (!finalAnimationsValues[MOVE_Y]) {
		finalAnimationsValues[MOVE_Y] = animationConfig.value;
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

export const scale = (animationConfig, animatedValues) => {
	animatedValues[SCALE] = animatedValues[SCALE] || new Animated.Value(1);

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