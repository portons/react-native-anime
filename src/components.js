import React from 'react';
import { Animated } from 'react-native';

import Anime from './anime';

// base components from Animated lib
// see https://github.com/facebook/react-native/blob/master/Libraries/Animated/src/Animated.js#L22-L33
const animatables = ['View', 'Text', 'Image', 'ScrollView'];

export default animatables
  // create an Anime component for each of these animatables
  .map(name => {
    const AnimatedRoot = Animated[name];

    class Component extends Anime {
      render() {
        const props = {
          ...this.props,
          style: [this.props.style, this.state.styles],
          onLayout: event =>
            !this.dimensionsSet &&
            this._setDimensions(event.nativeEvent.layout),
        };

        return this.props.children
          ? <AnimatedRoot {...props}>
              {this.props.children}
            </AnimatedRoot>
          : <AnimatedRoot {...props} />;
      }
    }

    return { [name]: Component };
  })
  // transform the list in an object of the shape { View: comp, Text: comp, ... }
  .reduce(
    (components, component) => ({
      ...components,
      ...component,
    }),
    {}
  );
