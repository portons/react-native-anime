import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View, TouchableOpacity, Text, Easing } from 'react-native';

import EasyAnimation from './src';

export default class Root extends Component {
  moveBox() {
  	this.box
			.opacity(0.5, { spring: { velocity: 50 } })
			.start();

  	this.text
			.fontSize(15, { spring: { velocity: 50 } })
			.start();

		this.image.rotate(70, { easing: Easing.bounce }).start();
  }

  stopBox() {
    this.box.stop();
  }

  reset() {
		this.box.reset();
		this.text.reset();
		this.image.reset();
	}

  render() {
    return (
      <View style={ styles.container }>
        <EasyAnimation.View ref={ ref => this.box = ref }
												 		style={{
															 width: 50,
															 height: 50,
															 backgroundColor: 'blue',
															 borderWidth: 2,
															 borderColor: 'red'
												 		}}>
          <View style={ styles.box }/>
        </EasyAnimation.View>

				<EasyAnimation.Text ref={ ref => this.text = ref }
														style={{ fontSize: 12, marginTop: 50, backgroundColor: '#dedede' }}>
					Lol
				</EasyAnimation.Text>

				<EasyAnimation.Image source={{ uri: "https://www.google.co.il/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" }}
														 ref={ ref => this.image = ref }
														 style={{ width: 100, height: 60, marginTop: 50 }}/>

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
