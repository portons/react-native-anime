# React Native Easy Animations
(Inspired by Cheetah for Swift: https://github.com/suguru/Cheetah)

RNEasyAnimations is an animation utility. It can animate many of the style properties the Animated library works with.

# Features
* Animation with duration and delay
* Parallel/Serial executions
* Easings
* Springs

# Code Example
```javascript
import EasyAnimations from 'react-native-easy-animations';

// Wrap your view with EasyAnimations component and save its reference
render () {
    return (
        <EasyAnimations.View ref={ ref => this.easy = ref }>
            <View style={ styles.box }/>
        </EasyAnimations.View>
    )
}

// Use the ref to animate your component
onClick() {
    this.easy.moveX(10, { duration: 1000 }).start()
}
```

# Properties

* moveX (move in X plane)
* moveY (move in Y plane)
* scale
* rotate
* borderRadius
* height
* width
* borderWidth
* fontSize
* opacity

# Parallel execution
EasyAnimations groups animation properties and execute them at once.

```javascript
    this.easy
        .moveX(50)
        .moveY(50)
        .rotate(180)
        .start()
```

# Sequence execution
`wait` will wait until all animations placed before it completed. It can also receive seconds to wait to start next animation.

```javascript
    this.easy
        .moveX(50)
        .wait(1000)
        .moveX(-50)
        .start()
```

# Duration, delay, easing
Just like when using Animated, you can specify durations, delays, easings for your animations

```javascript
    import { Easing } from 'react-native';

    animate() {
        this.easy
        .moveX(50, { duration: 2000, easing: Easing.elastic })
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
Like with Animated module, you can also animate a Text or an Image component

```javascript
    import EasyAnimations from 'react-native-easy-animations';

    render() {
        return (
            <EasyAnimations.Text>
                Very easy
            </EasyAnimations.Text>
        )
    }
```
