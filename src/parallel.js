import { Animated } from 'react-native';

export default class Parallel {
	componentsReferences = [];
	animation = null;

	constructor(componentsReferences) {
		this.componentsReferences = componentsReferences;
	}

	start(onAnimationEnd) {
		this.animation = Animated.parallel(
			this.componentsReferences.map(component => {
				const { animations, styles, animatedValues } = component._getAnimation();

				component._prepareForAnimation(styles, animatedValues);

				return animations;
			})
		);

		this.animation.start(({ finished }) => {
			if (finished) {
				onAnimationEnd && onAnimationEnd();

				this.componentsReferences.forEach(component => component._animationEnd());
			}
		});
	}

	stop = () => this.animation && this.animation.stop();

	reset = () => this.componentsReferences.forEach(component => component.reset());
}