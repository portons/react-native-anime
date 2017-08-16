/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Anime from 'react-native-anime';

import {
  heartBeatButton,
  disappearingButtonTitle,
} from './animation-functions';

export default class demo extends React.Component {
  onPress = () => {
    const button = heartBeatButton(this.button);
    const text = disappearingButtonTitle(this.text);

    new Anime.Parallel([button, text]).start(
      () => this.props.onPress && this.props.onPress()
    );
  };

  render = () =>
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={this.onPress}>
        <Anime.View style={styles.button} ref={ref => (this.button = ref)}>
          <Anime.Text style={styles.text} ref={ref => (this.text = ref)}>
            DEMO ME YO!
          </Anime.Text>
        </Anime.View>
      </TouchableWithoutFeedback>
    </View>;
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#222',
  },
  button: {
    padding: 20,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: '#228dcb',
    backgroundColor: '#228dcb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
    color: '#fafafa',
  },
});

AppRegistry.registerComponent('demo', () => demo);
