import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View, TouchableOpacity, Text, Easing } from 'react-native';

import EasyAnimation from './src';

export default class Root extends Component {
  moveBox() {
  	this.box
			.color('red', { easing: Easing.bounce })
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
        <EasyAnimation.Text ref={ ref => this.box = ref }
														onAnimationStart={ () => console.log('started') }
														onAnimationEnd={ () => console.log('ended') }
												 		style={{ width: 50, height: 50, backgroundColor: 'blue', color: 'white' }}>
          {/*<View style={ styles.box } />*/}
          Lol
        </EasyAnimation.Text>

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
