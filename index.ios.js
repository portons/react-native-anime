import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View } from 'react-native';

import ChainAnimations from './chain-animations';

export default class Root extends Component {
  componentDidMount() {
		this.box
			.rotate(360).duration(2000)
			.wait(3000)
			.moveX(50).duration(1000)
      .moveY(-30).duration(2000)
			.start();
  }

  render() {
    return (
      <View style={ styles.container }>
        <ChainAnimations ref={ ref => this.box = ref }>
          <View style={ styles.box }/>
        </ChainAnimations>
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
    height: 50,
    backgroundColor: 'blue'
  }
});

AppRegistry.registerComponent('ChainAnimations', () => Root);
