import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View, TouchableOpacity, Text } from 'react-native';

import Anime from './src';

export default class Root extends Component {
  moveBox() {
  	this.box
			.moveX(50, { duration: 1000, delay: 1000 })
			.color('red', { duration: 2000 })
			.wait(1000)
			.color('blue', { duration: 2000 })
			.moveX(-50, { spring: true })
			.start();
  }

  stopBox() {
    this.box.stop();
  }

  reset() {
		this.box.reset();
	}

  render() {
    return (
      <View style={ styles.container }>
        <Anime.Text ref={ ref => this.box = ref }
												 		style={{ width: 50, height: 50 }}>
          LOL
        </Anime.Text>

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

				<TouchableOpacity onPress={ () => this.reset() }>
					<View style={{ marginTop: 50,
						width: 100,
						height: 50,
						borderRadius: 3,
						backgroundColor: '#dedede',
						justifyContent: 'center',
						alignItems: 'center' }}>
						<Text>
							RESET
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
    backgroundColor: 'white',
  },
  box: {
    width: 50,
    height: 50
  }
});

AppRegistry.registerComponent('ChainAnimations', () => Root);
