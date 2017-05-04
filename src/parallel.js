import { Animated } from 'react-native';

const parallel = (componentsReferences) => ({
	start: () => Animated.parallel(
		componentsReferences.map(component => {
			const { animations, styles, animatedValues } = component._getAnimation();

			component._prepareForAnimation(styles, animatedValues);

			return animations.start(({ finished }) => {
				if (finished) {
					componentsReferences.forEach(component => component._animationEnd());
				}
			});
		})
	)
});

export default parallel;