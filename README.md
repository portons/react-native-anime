# React Native Anime
(Inspired by Cheetah for Swift: https://github.com/suguru/Cheetah)

Anime is an animation utility for React Native. It's built on top of the [Animated module](https://facebook.github.io/react-native/docs/animated.html), and provides a much simpler API for handling animations.

The library is still in early development. I also need to add a proper API documentation. Open issues if you find any bugs, and contributions are also welcomed!

# Features
* Animations with durations and delays
* Parallel/Serial executions
* Easings
* Springs

# Installation

```javascript
$ npm i react-native-anime
```

OR

```javascript
$ yarn add react-native-anime
```

# Code Example
1. Import Anime

```javascript
import Anime from 'react-native-anime';
```

2. Wrap your view with Anime component and save its reference
```javascript
render () {
    return (
        <Anime.View ref={ ref => this.box = ref }>
            <View style={ styles.box }/>
        </Anime.View>
    )
}
```

3. Use the reference to animate your component
```javascript
onClick() {
    this.box.moveX(100, { duration: 1500 }).start();
}

// You can also stop an animation with a .stop() method, and reset the component's styling with .reset()
stopAndReset() {
    this.box.stop();
    this.box.reset();
}
```

![simple-move](https://zippy.gfycat.com/DistantCluelessCowrie.gif)

# Properties

* translateX, translateY
* moveX, moveY (relative to current position)
* skewX, skewY
* scale
* rotate (rotateZ, rotateY, rotateX)
* borderRadius
* height
* width
* borderWidth
* fontSize
* opacity
* backgroundColor
* borderColor
* zIndex
* color
* perspective

# Parallel execution
Anime groups animation properties and executes them at once.

```javascript
    this.box
        .moveX(50)
        .moveY(50)
        .rotate(180)
        .start()
```

![parallel](https://zippy.gfycat.com/SecondGlitteringGannet.gif)

# Sequence execution
`wait` will wait until all animations placed before it completed. It can also receive milliseconds to wait to start next animation

```javascript
    this.box
        // first animation
        .moveX(50)
        .scale(1.5)
        // wait 1s before starting second animation
        .wait(1000)
        // second animation
        .moveX(-50)
        .scale(0.5)
        .start()
```

![sequence](https://zippy.gfycat.com/IlliterateFreeArchaeocete.gif)

# Duration, delay, [easing](https://github.com/facebook/react-native/blob/master/Libraries/Animated/src/Easing.js)
Just like with Animated, you can specify durations, delays and easings for your animations

```javascript
    import { Easing } from 'react-native';

    animate() {
        this.box
            .skewX(50, { duration: 2000, easing: Easing.bounce })
            .rotateY(-100, { delay: 2000 })
            .start();
    }
```

![duration](https://zippy.gfycat.com/JauntySmartIrukandjijellyfish.gif)

# Spring
You can also use Animated's spring animations, together with all its options (http://browniefed.com/react-native-animation-book/api/SPRING.html)

```javascript
    this.box
        .height(100, { spring: { friction: 1, velocity: 100 } })
        .borderRadius(100)
        .start()

    // or simply use `spring: true` for default spring behaviour
    this.box
        .moveX(50, { spring: true })
        .start()
```

![spring](https://zippy.gfycat.com/HonoredWastefulBeaver.gif)

# Also supports Image, Text and ScrollView
Like with Animated module, you can also animate Text, Image and ScrollView components

```javascript
    render() {
        return (
            <Anime.Image ref={ ref => this.image = ref }
                         source={{ require('pikachu.gif') }} />
        )
    }

    animate() {
        this.image
            .skewX(5, { spring: true })
            .skewY(5, { spring: true })
            .wait()
            .rotate(360*20, { duration: 2000 })
            .start()
    }
```

![image](https://thumbs.gfycat.com/LawfulSpiritedCornsnake-size_restricted.gif)

# Parallel animation of numerous components

```javascript
    render() {
        return (
            <View>
            	<Anime.View ref={ ref => this.box = ref }
            		    style={{ width: 50, height: 50, backgroundColor: 'blue' }}/>

            	<Anime.Text ref={ ref => this.text = ref }
            		    style={{ color: 'blue', fontSize: 12 }}>
            		Very easy
            	</Anime.Text>
            </View>
        )
    }

    animateComponents() {
        const box = this.box.rotate(90);
        const text = this.text.color('red');

        const parallel = new Anime.Parallel([box, text]);

        // Start parallel animation for both components, and reset them both when it ends
        parallel.start(() => parallel.reset())
    }
```

![numerous](https://zippy.gfycat.com/SlimyTinyFiddlercrab.gif)