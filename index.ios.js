import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View, TouchableOpacity, Text } from 'react-native';

import Anime from './src';

export default class Root extends Component {
  moveBox() {
  	this.box
			.backgroundColor('red')
			.scale(2)
			.borderRadius(50)
			.wait(0)
			.backgroundColor('blue')
			.scale(1)
			.borderRadius(0)
			.infinite()
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
        <Anime.View ref={ ref => this.box = ref }
										style={{ backgroundColor: 'blue', width: 50, height: 50 }}>
          <View style={ styles.box }/>
        </Anime.View>

        <TouchableOpacity onPress={ () => this.moveBox() }>
          <View style={{ marginTop: 100,
                         width: 100,
                         height: 50,
                         borderRadius: 3,
                         backgroundColor: '#dedede',
                         justifyContent: 'center',
                         alignItems: 'center' }}>
            <Text>
              ANIMATE
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
