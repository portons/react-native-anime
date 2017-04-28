import { Animated } from 'react-native';

export const ROTATE = 'rotate';
export const MOVE_X = 'moveX';
export const MOVE_Y = 'moveY';
export const WAIT = 'wait';
export const DELAY = 'delay';
export const DURATION = 'duration';

export const DEFAULT_DURATION = 500;

export const DEFAULT_SCENARIO_PART = {
	animatedValue: new Animated.Value(0),
	duration: DEFAULT_DURATION,
	animations: []
};