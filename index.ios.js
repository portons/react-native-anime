import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View, TouchableOpacity, Text } from 'react-native';

import ChainAnimations from './chain-animations';

export default class Root extends Component {
  moveBox() {
		this.box
			.moveX(10, { duration: 1000 })
			.wait(1000)
			.moveX(-10, { duration: 1000 })
			.backgroundColor('red', { duration: 1000, from: 'blue' })
      .rotate(180, { duration: 1000 })
			.start();
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
