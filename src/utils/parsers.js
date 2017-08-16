import { Animated } from 'react-native';

import { reduce, isEqual, last, forEach, findIndex, has } from 'lodash';

import {
  ROTATE_Z,
  ROTATE_X,
  ROTATE_Y,
  SKEW_X,
  SKEW_Y,
  MOVE_Y,
  MOVE_X,
  TRANSLATE_Y,
  TRANSLATE_X,
  WAIT,
  SCALE,
  SCALE_X,
  SCALE_Y,
  Z_INDEX,
  PERSPECTIVE,
  BACKGROUND_COLOR,
  BORDER_RADIUS,
  BORDER_WIDTH,
  WIDTH,
  HEIGHT,
  BORDER_COLOR,
  FONT_SIZE,
  OPACITY,
  COLOR,
} from './constants';

import {
  rotateZ,
  rotateY,
  rotateX,
  skewX,
  skewY,
  backgroundColor,
  borderColor,
  moveX,
  moveY,
  translateX,
  translateY,
  scale,
  scaleX,
  scaleY,
  zIndex,
  perspective,
  borderRadius,
  borderWidth,
  height,
  width,
  fontSize,
  wait,
  opacity,
  color,
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
  const { sequenceAnimations, styles } = createAnimations(
    breakScenarioIntoSequences(scenario),
    animatedValues
  );

  return {
    animations: Animated.sequence(sequenceAnimations),
    animatedValues,
    styles,
  };
};

/*
 * Breaks scenario into a sequence of parallel animations, when wait() animation is the divider between them
 *
 * For example, if given the following scenario: '.rotate(10).moveX(10).wait(100).moveY(10)', it will return:
 * [[rotateConfig, moveXConfig], [delay], [moveYConfig]]
 *
 * @param scenario - a list of animations configs used to build the whole animation
 */
const breakScenarioIntoSequences = scenario =>
  reduce(
    scenario,
    (acc, animation, index) => {
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
    },
    [[]]
  );

const createAnimations = (sequences, animatedValues) => {
  const finalAnimationsValues = {};
  const sequenceAnimations = [];
  const styles = [
    // transform is always first in array for convenience
    {
      transform: [],
    },
  ];

  forEach(sequences, parallels => {
    const currentPartAnimations = [];

    forEach(parallels, currentAnimation => {
      const { animation, styling } = parseAnimation({
        animationConfig: currentAnimation,
        animatedValues,
        finalAnimationsValues,
      });

      currentPartAnimations.push(animation);

      if (styling) {
        if (styling.transform) {
          const sameStyleIndex = findIndex(styles[0].transform, style =>
            has(style, currentAnimation.type)
          );

          sameStyleIndex === -1
            ? styles[0].transform.push(styling.style)
            : (styles[0].transform[sameStyleIndex] = styling.style);
        } else {
          const sameStyleIndex = findIndex(styles, style =>
            has(style, currentAnimation.type)
          );

          sameStyleIndex === -1
            ? styles.push(styling.style)
            : (styles[sameStyleIndex] = styling.style);
        }
      }
    });

    sequenceAnimations.push(Animated.parallel(currentPartAnimations));
  });

  return {
    sequenceAnimations,
    styles,
  };
};

const parseAnimation = ({
  animationConfig,
  animatedValues,
  finalAnimationsValues,
}) => {
  switch (animationConfig.type) {
    case ROTATE_Z:
      return rotateZ(animationConfig, animatedValues, finalAnimationsValues);

    case ROTATE_X:
      return rotateX(animationConfig, animatedValues, finalAnimationsValues);

    case ROTATE_Y:
      return rotateY(animationConfig, animatedValues, finalAnimationsValues);

    case SKEW_X:
      return skewX(animationConfig, animatedValues, finalAnimationsValues);

    case SKEW_Y:
      return skewY(animationConfig, animatedValues, finalAnimationsValues);

    case BACKGROUND_COLOR:
      return backgroundColor(
        animationConfig,
        animatedValues,
        finalAnimationsValues
      );

    case BORDER_COLOR:
      return borderColor(
        animationConfig,
        animatedValues,
        finalAnimationsValues
      );

    case COLOR:
      return color(animationConfig, animatedValues, finalAnimationsValues);

    case MOVE_X:
      return moveX(animationConfig, animatedValues, finalAnimationsValues);

    case MOVE_Y:
      return moveY(animationConfig, animatedValues, finalAnimationsValues);

    case TRANSLATE_X:
      return translateX(animationConfig, animatedValues);

    case TRANSLATE_Y:
      return translateY(animationConfig, animatedValues);

    case SCALE:
      return scale(animationConfig, animatedValues);

    case SCALE_X:
      return scaleX(animationConfig, animatedValues);

    case SCALE_Y:
      return scaleY(animationConfig, animatedValues);

    case Z_INDEX:
      return zIndex(animationConfig, animatedValues);

    case PERSPECTIVE:
      return perspective(animationConfig, animatedValues);

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
