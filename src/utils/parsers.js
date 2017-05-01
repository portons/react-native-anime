import { Animated } from 'react-native';

import { reduce, isEqual, last, forEach } from 'lodash';

import {
	ROTATE,
	MOVE_Y,
	MOVE_X,
	WAIT,
	SCALE,
	BACKGROUND_COLOR,
	BORDER_RADIUS,
	BORDER_WIDTH,
	WIDTH,
	HEIGHT,
	BORDER_COLOR,
	FONT_SIZE,
	OPACITY
} from './constants';

import {
	rotate,
	backgroundColor,
	borderColor,
	moveX,
	moveY,
	scale,
	borderRadius,
	borderWidth,
	height,
	width,
	fontSize,
	wait,
	opacity
} from './animation-creators';
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
				animationConfig: currentAnimation,
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

const parseAnimation = ({ animationConfig, animatedValues, finalAnimationsValues }) => {
	switch (animationConfig.type) {
		case ROTATE:
			return rotate(animationConfig, animatedValues, finalAnimationsValues);

		case BACKGROUND_COLOR:
			return backgroundColor(animationConfig, animatedValues, finalAnimationsValues);

		case BORDER_COLOR:
			return borderColor(animationConfig, animatedValues, finalAnimationsValues);

		case MOVE_X:
			return moveX(animationConfig, animatedValues, finalAnimationsValues);

		case MOVE_Y:
			return moveY(animationConfig, animatedValues, finalAnimationsValues);

		case SCALE:
			return scale(animationConfig, animatedValues);

		case BORDER_RADIUS:
			return borderRadius(animationConfig, animatedValues);

		case BORDER_WIDTH:
			return borderWidth(animationConfig, animatedValues);

		case OPACITY:
			return opacity(animationConfig, animatedValues);

		case HEIGHT:
			return height(animationConfig, animatedValues, finalAnimationsValues);

		case FONT_SIZE:
			return fontSize(animationConfig, animatedValues, finalAnimationsValues);

		case WIDTH:
			return width(animationConfig, animatedValues, finalAnimationsValues);

		case WAIT:
			return wait(animationConfig);
	}
};