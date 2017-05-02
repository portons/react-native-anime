import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View, TouchableWithoutFeedback } from 'react-native';

import Anime from './src';

export default class Root extends Component {
	animateLogin() {
		this.button
			.scaleY(2, { spring: true })
			.wait()
			.scaleX(2, { spring: true })
			.start();
	}

  render() {
    return (
      <View style={ styles.container }>
				<TouchableWithoutFeedback onPress={ () => this.animateLogin() }>
					<Anime.View ref={ ref => this.button = ref }
											style={{
												backgroundColor: 'blue',
												width: 100,
												height: 50,
												borderRadius: 5,
												justifyContent: 'center',
												alignItems: 'center'
											}}>
						<Anime.Text ref={ ref => this.text = ref }
												style={{ fontSize: 15, color: 'white' }}>
							Login
						</Anime.Text>
					</Anime.View>
				</TouchableWithoutFeedback>

				{/*<TouchableOpacity onPress={ () => this.moveBox() }>*/}
          {/*<View style={{ marginTop: 100,*/}
                         {/*width: 100,*/}
                         {/*height: 50,*/}
                         {/*borderRadius: 3,*/}
                         {/*backgroundColor: '#dedede',*/}
                         {/*justifyContent: 'center',*/}
                         {/*alignItems: 'center' }}>*/}
            {/*<Text>*/}
              {/*ANIMATE*/}
            {/*</Text>*/}
          {/*</View>*/}
				{/*</TouchableOpacity>*/}

				{/*<TouchableOpacity onPress={ () => this.stopBox() }>*/}
          {/*<View style={{ marginTop: 50,*/}
						{/*width: 100,*/}
						{/*height: 50,*/}
						{/*borderRadius: 3,*/}
						{/*backgroundColor: '#dedede',*/}
						{/*justifyContent: 'center',*/}
						{/*alignItems: 'center' }}>*/}
            {/*<Text>*/}
              {/*STOP ME*/}
            {/*</Text>*/}
          {/*</View>*/}
				{/*</TouchableOpacity>*/}

				{/*<TouchableOpacity onPress={ () => this.reset() }>*/}
					{/*<View style={{ marginTop: 50,*/}
						{/*width: 100,*/}
						{/*height: 50,*/}
						{/*borderRadius: 3,*/}
						{/*backgroundColor: '#dedede',*/}
						{/*justifyContent: 'center',*/}
						{/*alignItems: 'center' }}>*/}
						{/*<Text>*/}
							{/*RESET*/}
						{/*</Text>*/}
					{/*</View>*/}
				{/*</TouchableOpacity>*/}
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
    height: 50,
		backgroundColor: 'red',
		marginTop: 20
  }
});

AppRegistry.registerComponent('ChainAnimations', () => Root);
