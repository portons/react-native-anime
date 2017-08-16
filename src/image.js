import React from 'react';
import { Animated } from 'react-native';

import Anime from './anime';

export default class View extends Anime {
  render() {
    const { styles } = this.state;

    return (
      <Animated.Image
        {...this.props}
        style={[this.props.style, styles]}
        onLayout={event =>
          !this.dimensionsSet && this._setDimensions(event.nativeEvent.layout)}
      />
    );
  }
}
