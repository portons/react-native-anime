import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View, TouchableOpacity, Text } from 'react-native';

import ChainAnimations from './chain-animations';

export default class Root extends Component {
  moveBox() {
  	this.box
			.moveX(10, { duration: 2000 })
			.moveY(10, { duration: 1000, delay: 1000 })
			.backgroundColor('red', { duration: 2000, delay: 2000 })
			.start();

		//this.box
		//	.rotate(360 * 20, { duration: 2500 })
		//	.borderRadius(50, { duration: 2500 })
		//	.scale(1.5, { duration: 1500 })
		//	.height(150)
		//	.width(25)
		//	.wait(1000)
		//	.backgroundColor('red', { duration: 3000 })
		//	.width(150)
		//	.rotate(360 * 20, { duration: 2500 })
		//	.borderRadius(150, { duration: 2500 })
		//	.start();
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
