/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Anime from 'react-native-anime';

export default class demo extends React.Component {
  render() {
    return (
      <Anime.View style={styles.container} ref={c => (this.container = c)}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>

        <TouchableOpacity
          onPress={() => {
            console.log('hello');
            this.container.moveY(100, { duration: 500 }).start();
          }}
        >
          <Text>Move it</Text>
        </TouchableOpacity>
      </Anime.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

AppRegistry.registerComponent('demo', () => demo);
