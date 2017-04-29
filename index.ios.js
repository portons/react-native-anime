import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View, TouchableOpacity, Text } from 'react-native';

import ChainAnimations from './chain-animations';

export default class Root extends Component {
  moveBox() {
		this.box
			.rotate(360, { duration: 2000 })
			.scale(0.5, { duration: 2000 })
			.ptHeight(300, { duration: 2000 })
			.percentageWidth(50, { duration: 2000 })
			.borderRadius(50, { duration: 2000 })
			.wait(3000)
			.moveX(50, { duration: 2000 })
			.scale(2, { duration: 2000 })
			.moveY(-30, { duration: 5000 })
			.backgroundColor('red', { duration: 2000, from: 'blue' })
			.start();
  }

  render() {
    return (
      <View style={ styles.container }>
        <ChainAnimations ref={ ref => this.box = ref }>
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
