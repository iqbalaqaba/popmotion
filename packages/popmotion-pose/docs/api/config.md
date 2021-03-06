---
title: Config
description: Configure a poser
---

# Config options

### `initialPose?: string | string[]`

The name of the initial pose (or poses if provided as an array).

### `draggable?: true | 'x' | 'y'`

If `true`, will make the element draggable on both axis. Setting to either `'x'` or `'y'` will restrict movement to that axis.

If defined, will allow the use of a special `dragEnd` pose

### `dragBounds?: { [key: string]: number }`

An object that defines `top`, `right`, `bottom` and/or `left` drag boundaries in pixels.

Currently, these boundaries are enforced by a hard clamp.

### `onDragStart/onDragEnd: (e: MouseEvent | TouchEvent) => any`

Lifecycle callbacks for drag events.

### `passive: { [key: string]: PassiveValue }`

```typescript
type PassiveValue = [
  subscribedKey: string,
  transform: (subscribedValue: any) => any,
  fromParent?: true | string
]
```

Map of values that are passively changed when other values, either on this Poser or an ancestor, change.

`fromParent` can be set either as `true` or as a `string`:
  - `true`: Link to value from immediate parent.
  - `string`: Link to the nearest ancestor with this `label` prop.

#### Example

The `transform` function here is composed with Popmotion [transformers](/api/transformers):

```javascript
const config = {
  draggable: 'x',
  passive: {
    backgroundColor: ['x', pipe(
      clamp(0, 300),
      interpolate([0, 300], [0, 1]),
      blendColor('#f00', '#0f0')
    )]
  }
}
```

### `label: string`

Set a label on this poser. Currently, this allows a `passive` value on a child poser to refer to this ancestor value.

### `props: { [key: string]: any }`

Properties to provide to entered pose `transition` methods and dynamic pose props. These can be updated with the `setProps` method or, in React Pose, by providing props to the posed component.

### `onChange?: { [key: string]: (v: any) => any }`

Map of callbacks, one for each animated value, that will fire whenever that value changes.

**Note:** For React Pose, instead use the `onValueChange` property on the posed component.

#### Example

```javascript
const config = {
  draggable: 'x',
  onChange: {
    x: (x) => // you do you 
  }
}
```

### `...poses: { [key: string]: Pose }`

Any other config props will be treated as [poses](#pose-props).

### Pose config

You can call a pose anything, and animate to it by calling `poser.set('poseName')` or setting `<PosedComponent pose="poseName" />`.

A pose is defined by style attributes like `x` or `backgroundColor`, and the following optional props:

### `transition?: (props: TransitionProps) => Action | false`

```typescript
type TransitionsProps = {
  from: any,
  to: any,
  velocity: number,
  key: string,
  prevPoseKey: string,
  ...props: any
}
```

This is an optional function that can be used to create custom transitions.

The function is run **once for every style property in the pose**.

It must return a Popmotion animation, like [tween](/api/tween) or [decay](/api/decay), or `false` to indicate no transition.

The function is provided some properties about the currently animating value:

- `from`: The current state of the value
- `velocity`: The current velocity of the value, if it's a number
- `to`: The state we're animating to, as defined in the current pose. **Note:** You're under no obligation to actually animate to this value (for instance for non-deterministic animations)
- `key`: The name of the value
- `prevPoseKey`: The name of the pose this value was previously in.
- `...props`: If using `pose`, the properties passed as the second argument of `set`, set statefully as `transitionProps` or with `setTransitionProps`. If a React component, the props passed to that component.

You can return different animations based on your own custom logic or use Pose's included [transition compositors](/pose/api/transition-compositors) to easily split animations by `key` and `prevPoseKey`.

### `delay?: number | (props: TransitionsProps) => number`

A duration, in milliseconds, to delay this transition. Does **not** affect children.

### `delayChildren?: number | (props: TransitionsProps) => number`

A duration, in milliseconds, to delay the transition of direct children.

### `flip?: boolean = false`

If `true`, will convert this animation to a [FLIP animation](https://aerotwist.com/blog/flip-your-animations/).

### `staggerChildren?: number | (props: TransitionsProps) => number`

A duration, in milliseconds, between transitioning each children.

### `staggerDirection?: 1 | -1 | (props: TransitionsProps) => 1 | -1`

If `1`, staggers from the first child to the last. If `-1`, from last to first.

### `beforeChildren?: boolean | (props: TransitionsProps) => boolean`

If `true`, will ensure this animation completes before firing any child animations.

### `afterChildren?: boolean | (props: TransitionsProps) => boolean`

If `true`, will ensure this animation only fires after all child animations have completed.

### `...values: any | (props: TransitionProps) => any`

Any remaining properties are treated as stylistic values and will be animated.
