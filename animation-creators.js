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
	NUMBER,
	COLOR,
	DEFAULT_VALUES,
	BORDER_COLOR,
	FONT_SIZE,
	OPACITY
} from './constants';


// Utils methods
const noEasing = (value) => value;

const defaultStyle = (animation, styleName, type) => {
	const style = get(animation, `defaultStyle.${styleName}`);

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
export const rotate = (animation, animatedValues, finalAnimationsValues) => {
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

export const backgroundColor = (animation, animatedValues, finalAnimationsValues) => {
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
		outputRange: [defaultStyle(animation, 'backgroundColor', COLOR), animation.value]
	});

	return {
		animation: bgColorAnimation,
		styling: {
			style: { backgroundColor: bgColorInterpolation }
		}
	};
};

export const borderColor = (animation, animatedValues, finalAnimationsValues) => {
	animatedValues[BORDER_COLOR] = animatedValues[BORDER_COLOR] || new Animated.Value(0);

	if (!finalAnimationsValues[BORDER_COLOR]) {
		finalAnimationsValues[BORDER_COLOR] = animation.value;
	} else {
		finalAnimationsValues[BORDER_COLOR] = finalAnimationsValues[BORDER_COLOR] + animation.value;
	}

	let borderColor;

	if (get(animation, 'options.spring')) {
		borderColor = createSpringAnimation(100, animation.options, animatedValues[BORDER_COLOR]);
	} else {
		borderColor = createTimingAnimation(100, animation.options, animatedValues[BORDER_COLOR]);
	}

	const borderColorInterpolation = animatedValues[BORDER_COLOR].interpolate({
		inputRange: [0, 100],
		outputRange: [defaultStyle(animation, 'borderColor', COLOR), animation.value]
	});

	return {
		animation: borderColor,
		styling: {
			style: { borderColor: borderColorInterpolation }
		}
	};
};

export const moveX = (animation, animatedValues, finalAnimationsValues) => {
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

export const moveY = (animation, animatedValues, finalAnimationsValues) => {
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

export const scale = (animation, animatedValues) => {
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

export const borderRadius = (animation, animatedValues) => {
	animatedValues[BORDER_RADIUS] = animatedValues[BORDER_RADIUS] ||
		new Animated.Value(defaultStyle(animation, 'borderRadius', NUMBER));

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

export const borderWidth = (animation, animatedValues) => {
	animatedValues[BORDER_WIDTH] = animatedValues[BORDER_WIDTH] ||
		new Animated.Value(defaultStyle(animation, 'borderWidth', NUMBER));

	let borderWidthAnimation;

	if (get(animation, 'options.spring')) {
		borderWidthAnimation = createSpringAnimation(animation.value, animation.options, animatedValues[BORDER_WIDTH]);
	} else {
		borderWidthAnimation = createTimingAnimation(animation.value, animation.options, animatedValues[BORDER_WIDTH]);
	}

	return {
		animation: borderWidthAnimation,
		styling: {
			style: { borderWidth: animatedValues[BORDER_WIDTH] }
		}
	};
};

export const height = (animation, animatedValues, finalAnimationsValues) => {
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

export const fontSize = (animation, animatedValues, finalAnimationsValues) => {
	animatedValues[FONT_SIZE] = animatedValues[FONT_SIZE] ||
													 new Animated.Value(defaultStyle(animation, 'fontSize', NUMBER));

	if (!finalAnimationsValues[FONT_SIZE]) {
		finalAnimationsValues[FONT_SIZE] = animation.value;
	} else {
		finalAnimationsValues[FONT_SIZE] = finalAnimationsValues[FONT_SIZE] + animation.value;
	}

	let fontSizeAnimation;

	if (get(animation, 'options.spring')) {
		fontSizeAnimation = createSpringAnimation(animation.value, animation.options, animatedValues[FONT_SIZE]);
	} else {
		fontSizeAnimation = createTimingAnimation(animation.value, animation.options, animatedValues[FONT_SIZE]);
	}

	return {
		animation: fontSizeAnimation,
		styling: {
			style: { fontSize: animatedValues[FONT_SIZE] }
		}
	};
};

export const width = (animation, animatedValues, finalAnimationsValues) => {
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

export const opacity = (animation, animatedValues) => {
	animatedValues[OPACITY] = animatedValues[OPACITY] ||
														new Animated.Value(defaultStyle(animation, 'opacity', NUMBER));

	let opacityAnimation;

	if (get(animation, 'options.spring')) {
		opacityAnimation = createSpringAnimation(animation.value, animation.options, animatedValues[OPACITY]);
	} else {
		opacityAnimation = createTimingAnimation(animation.value, animation.options, animatedValues[OPACITY]);
	}

	return {
		animation: opacityAnimation,
		styling: {
			style: { opacity: animatedValues[OPACITY] }
		}
	};
};

export const wait = (animation) => ({ animation: Animated.delay(animation.duration) });