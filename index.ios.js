import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View, TouchableOpacity, Text } from 'react-native';

import ChainAnimations from './chain-animations';

export default class Root extends Component {
  moveBox() {
		this.box
			.rotate(360 * 200, { duration: 2500 })
			.borderRadius(50, { duration: 2500 })
			.scale(1.5, { duration: 1500 })
			.start();

		//this.box
		//	.rotate(360 * 200, { duration: 2500 })
		//	.borderRadius(50, { duration: 2500 })
		//	.scale(1.5, { duration: 1500 })
     // .start();

		//componentWillMount() {
		//	this.rotation = new Animated.Value(0);
		//	this.radius = new Animated.Value(0);
		//	this.scale = new Animated.Value(0);
		//
		//	const rotate = Animated.timing(this.rotation, { toValue: 360 * 200, duration: 2500 });
		//	const radius = Animated.timing(this.radius, { toValue: 50, duration: 2500 });
		//	const scale = Animated.timing(this.scale, { toValue: 1.5, duration: 1500 });
		//
		//	Animated.parallel([
		//		rotate,
		//		radius,
		//		scale
		//	])
		//}
		//
		//render() {
		//	<Animated.View style={ [styles.container, {
		//		borderRadius: this.borderRadius,
		//		transform: [
		//		{ rotate: this.rotation },
		//		{ scale: this.scale }
		//		] }] }/>
		//}
  }

  stopBox() {
    this.box.stop();
  }

  render() {
    return (
      <View style={ styles.container }>
        <ChainAnimations ref={ ref => this.box = ref }
												 style={{ width: 50, height: 50, backgroundColor: 'blue' }}>
          <View style={ styles.box }/>
        </ChainAnimations>

        <TouchableOpacity onPress={ () => this.moveBox() }>
          <View style={{ marginTop: 50,
                         width: 100,
                         height: 50,
                         borderRadius: 3,
                         backgroundColor: '#dedede',
                         justifyContent: 'center',
                         alignItems: 'center' }}>
            <Text>
              CLICK ME
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={ () => this.stopBox() }>
          <View style={{ marginTop: 50,
						width: 100,
						height: 50,
						borderRadius: 3,
						backgroundColor: '#dedede',
						justifyContent: 'center',
						alignItems: 'center' }}>
            <Text>
              STOP ME
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  box: {
    width: 50,
    height: 50
  }
});

AppRegistry.registerComponent('ChainAnimations', () => Root);
