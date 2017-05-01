# React Native Anime
(Inspired by Cheetah for Swift: https://github.com/suguru/Cheetah)

React Native Anime is an animation utility. It can animate many of the style properties the Animated library works with. It's purpose is to make the animations much easier and accessible.

# Features
* Animations with durations and delays
* Parallel/Serial executions
* Easings
* Springs

# Code Example
1. Import Anime

```javascript
import Anime from 'react-native-anime';
```

2. Wrap your view with EasyAnimations component and save its reference
```javascript
render () {
    return (
        <Anime.View ref={ ref => this.easy = ref }>
            <View style={ styles.box }/>
        </Anime.View>
    )
}
```

3. Use the ref to animate your component
```javascript
onClick() {
    this.easy.moveX(10, { duration: 1000 }).start()
}
```

# Properties

* moveX (translateX, relative to current position)
* moveY (translateY, relative to current position)
* scale
* rotate
* borderRadius
* height
* width
* borderWidth
* fontSize
* opacity
* backgroundColor
* borderColor
* color

# Parallel execution
Anime groups animation properties and execute them at once.

```javascript
    this.easy
        .moveX(50)
        .moveY(50)
        .rotate(180)
        .start()
```

# Sequence execution
`wait` will wait until all animations placed before it completed. It can also receive milliseconds to wait to start next animation

```javascript
    this.easy
        .moveX(50)
        .wait(1000)
        .moveX(-50)
        .start()
```

# Duration, delay, easing
Just like with Animated, you can specify durations, delays and easings for your animations

```javascript
    import { Easing } from 'react-native';

    animate() {
        this.easy
        .moveX(50, { duration: 2000, easing: Easing.bounce })
        .moveY(-50, { delay: 1000 })
        .start()
    }
```

# Spring
You can also use Animated's spring animations, together with all its options

```javascript
    this.easy
        .moveX(50, { spring: { friction: 1, velocity: 100 } })
        .start()
        
    // or simply use `spring: true` for default spring behaviour
    this.easy
        .moveX(50, { spring: true })
        .start()
```

# Also supports Image, Text and ScrollView
Like with Animated module, you can also animate Text, Image and ScrollView components

```javascript
    import Anime from 'react-native-anime';

    render() {
        return (
            <Anime.Text>
                Very easy
            </Anime.Text>
        )
    }
```
