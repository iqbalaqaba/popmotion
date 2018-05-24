import poseFactory from '../index';

type Value = { i: number };
type Action = { start: (value: Value, complete: Function) => Subscription };
type Subscription = { stop: () => void };
type PoserAPI = {};

const mockAction = (to): Action => ({
  start: (value, complete): Subscription => {
    value.i = to;
    complete();
    return {
      stop: () => undefined
    };
  }
});

const mockMultiplyAction = (to, multiply): Action => ({
  start: (value, complete): Subscription => {
    value.i = to * multiply;
    complete();
    return {
      stop: () => undefined
    };
  }
});

const mockActionInverse = (to): Action => ({
  start: (value, complete): Subscription => {
    value.i = - to;
    complete();
    return {
      stop: () => undefined
    };
  }
});

const testPose = poseFactory<Value, Action, Subscription, PoserAPI>({
  bindOnChange: (values, onChange) => key => undefined,
  readValue: ({ i }) => i,
  createValue: (init, key, props, valueProps) => ({ i: init }),
  getTransitionProps: (props, to) => ({ to }),
  resolveTarget: (props, to) => to,
  selectValueToRead: ({ i }) => i,
  startAction: (value, action, complete) => {
    return action.start(value, complete);
  },
  stopAction: action => action.stop(),
  convertValue: raw => ({ i: raw }),
  getInstantTransition: (v, { to }) => mockAction(to),
  convertTransitionDefinition: ({ multiply }, { to }) => {
    return multiply ? mockMultiplyAction(to, multiply) : mockAction(to);
  },
  addActionDelay: (delay, action) => action,
  defaultTransitions: new Map([['default', ({ to }) => mockActionInverse(to)]]),
  transformPose: pose => pose,
  readValueFromSource: () => 0,
  extendAPI: api => api
});

const testPoser = testPose({
  open: { x: 0 },
  closed: { x: 100 },
  right: { y: 100 },
  left: { y: 50 },
  functionalTransition: {
    x: 10,
    transition: ({ to }) => mockActionInverse(to)
  },
  mapFunctionalTransition: {
    x: 9,
    transition: {
      x: ({ to }) => mockActionInverse(to)
    }
  },
  defTransition: {
    x: 8,
    transition: { multiply: 2 }
  },
  functionalDefTransition: {
    x: 5,
    transition: () => ({ multiply: 10 })
  },
  mapDefTransition: {
    x: 7,
    transition: {
      x: { multiply: 3 }
    }
  },
  mapFunctionalDefTransition: {
    x: 6,
    transition: {
      x: () => ({ multiply: 5 })
    }
  },
  initialPose: ['open', 'left']
});

test('sets initial poses', () => {
  const state = testPoser.get();
  expect(state.x).toBe(0);
  expect(state.y).toBe(50);
});

test('correctly identifies poses', () => {
  expect(testPoser.has('open')).toBe(true);
  expect(testPoser.has('foo')).toBe(false);
});

test('sets poses with default transition', () => Promise.all([
  testPoser.set('closed'),
  testPoser.set('right')
]).then(() => {
  const state = testPoser.get();
  expect(state.x).toBe(-100)
  expect(state.y).toBe(-100)
})

test('resolves custom transitions correctly', () => {
  
});
