import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View, TouchableWithoutFeedback, Easing, Dimensions } from 'react-native';

import Anime from './src';

export default class Root extends Component {
	animateButton() {
		const button = this.button
			.skewX(20)
			.wait()
			.skewX(0);

		const text = this.text
			.skewX(-20)
			.wait()
			.skewX(0);

		Anime.parallel([button, text]).start();
	}

  render() {
    return (
      <Anime.View style={ styles.container }
									ref={ ref => this.container = ref }>
				<TouchableWithoutFeedback onPress={ () => this.animateButton() }>
					<Anime.View ref={ ref => this.button = ref }
											style={{
												width: 150,
												height: 50,
												borderRadius: 50,
												borderWidth: 2,
												borderColor: '#1ECD97',
												justifyContent: 'center',
												alignItems: 'center'
											}}>
						<Anime.Text ref={ ref => this.text = ref }
												style={{ color: '#1ECD97', position: 'absolute' }}>
							LOGIN
						</Anime.Text>
					</Anime.View>
				</TouchableWithoutFeedback>
      </Anime.View>
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
    height: 50,
		backgroundColor: 'red',
		marginTop: 20
  }
});

AppRegistry.registerComponent('ChainAnimations', () => Root);
