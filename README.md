# React Native Anime
(Inspired by Cheetah for Swift: https://github.com/suguru/Cheetah)

React Native Anime is an animation utility. It can animate many of the style properties the Animated library works with.

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

2. Wrap your view with Anime component and save its reference
```javascript
render () {
    return (
        <Anime.View ref={ ref => this.easy = ref }>
            <View style={ styles.box }/>
        </Anime.View>
    )
}
```

3. Use the reference to animate your component
```javascript
onClick() {
    this.easy.moveX(10, { duration: 1000 }).start()
}
```

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
        .backgroundColor('red', { spring: { friction: 1, velocity: 100 } })
        .start()
        
    // or simply use `spring: true` for default spring behaviour
    this.easy
        .moveX(50, { spring: true })
        .start()
```

# Also supports Image, Text and ScrollView
Like with Animated module, you can also animate Text, Image and ScrollView components

```javascript
    render() {
        return (
            <Anime.Text ref={ ref => this.text = ref }
                        style={{ color: 'blue', fontSize: 12 }}>
                Very easy
            </Anime.Text>
        )
    }

    animate() {
        this.text
            .color('red', { spring: { friction: 1, velocity: 100 } })
            .fontSize(20, { spring: { friction: 1, velocity: 100 } })
    }
```

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
        const text = this.text.fontColor('red');

        const parallel = new Anime.Parallel([box, text])
            .start(() => parallel.reset());
    }
```