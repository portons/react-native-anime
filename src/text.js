import React from 'react';
import { Animated } from 'react-native';

import Anime from './anime';

export default class Text extends Anime {
	render() {
		const { styles } = this.state;

		return (
			<Animated.Text { ...this.props }
										 style={ [this.props.style, styles] }
										 onLayout={ (event) => !this.dimensionsSet && this.setDimensions(event.nativeEvent.layout) }>
				{ this.props.children }
			</Animated.Text>
		)
	}
}