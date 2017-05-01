import React from 'react';
import { Animated } from 'react-native';

import EasyAnimations from './easy-animations';

export default class View extends EasyAnimations {
	render() {
		const { styles } = this.state;

		return (
			<Animated.Image { ...this.props }
											style={ [this.props.style, styles] }
										 	onLayout={ (event) => !this.dimensionsSet && this.setDimensions(event.nativeEvent.layout) } />
		)
	}
}