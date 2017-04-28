import React from 'react';
import { Animated } from 'react-native';

class ChainAnimations extends React.Component {
	componentWillMount() {
		this.animation = new Animated.Value(0);
	}

	render() {
	  return (
	    <Animated.View>
				{ this.props.children }
			</Animated.View>
	  )
	}
}