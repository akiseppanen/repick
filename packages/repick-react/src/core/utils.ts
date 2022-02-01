import { useCallback, useEffect, useReducer, useRef } from 'react'
import { objectCopyPartial, RepickAction, RepickOptions, RepickState } from '..'
import { RepickProps } from './types'

export function optionsFromProps(props: RepickProps<any>) {
  return objectCopyPartial(
    [
      'allowInput',
      'format',
      'formatter',
      'parser',
      'monthCount',
      'locale',
      'disabledDates',
      'enabledDates',
      'weekStartsOn',
      'minDate',
      'maxDate',
      'filterDates',
    ],
    props,
  )
}

function getState<Selected extends Date | Date[]>(
  state: RepickState<Selected>,
  props: RepickProps<Selected> = {},
): RepickState<Selected> {
  return ((Object.keys(state) as unknown) as (keyof RepickState<
    Selected
  >)[]).reduce<any>(
    (prevState, key) => {
      const isControlledProp = typeof props[key] !== 'undefined'

      prevState[key] = isControlledProp ? props[key] : prevState[key]

      return prevState
    },
    { ...state },
  )
}

function invokeOnchangeHandler<Selected extends Date | Date[]>(
  props: RepickProps<Selected>,
  key: keyof RepickState<Selected>,
  state: RepickState<Selected>,
  newState: RepickState<Selected>,
) {
  const handler = `on${key.slice(0, 1).toUpperCase()}${key.slice(1)}Change`

  if (
    handler in props &&
    newState[key] !== undefined &&
    newState[key] !== state[key]
  ) {
    ;(props as any)[handler](newState[key])
  }
}

function callOnchangeProps<Selected extends Date | Date[]>(
  props: RepickProps<Selected>,
  state: RepickState<Selected>,
  newState: RepickState<Selected>,
) {
  ;((Object.keys(state) as unknown) as (keyof RepickState<Selected>)[]).forEach(
    key => {
      invokeOnchangeHandler(props, key, state, newState)
    },
  )
}

type RepickReducer<Selected extends Date | Date[]> = (
  state: RepickState<Selected>,
  action: RepickAction,
  options: RepickOptions<Selected>,
) => Partial<RepickState<Selected>>

function useEnhancedReducer<Selected extends Date | Date[]>(
  reducer: RepickReducer<Selected>,
  initialState: RepickState<Selected>,
  props: RepickProps<Selected>,
): [RepickState<Selected>, (action: RepickAction) => void] {
  const prevStateRef = useRef<RepickState<Selected>>()
  const actionWithPropsRef = useRef<
    RepickAction & { props: RepickProps<Selected> }
  >()
  const enhancedReducer = useCallback(
    (
      state: RepickState<Selected>,
      actionWithProps: RepickAction & { props: RepickProps<Selected> },
    ) => {
      actionWithPropsRef.current = actionWithProps

      const { props, ...action } = actionWithProps
      const options = optionsFromProps(props)

      state = getState(state, props)

      const changes = reducer(state, action, options)

      const newState =
        typeof props.stateReducer === 'function'
          ? props.stateReducer(state, { action, changes, options })
          : { ...state, ...changes }

      return newState
    },
    [reducer],
  )

  const [state, dispatch] = useReducer(enhancedReducer, initialState)

  const dispatchWithProps = useCallback(
    action => dispatch({ props: props, ...action }),
    [props],
  )

  const actionWithProps = actionWithPropsRef.current

  useEffect(() => {
    if (
      actionWithProps &&
      prevStateRef.current &&
      prevStateRef.current !== state
    ) {
      const { props } = actionWithProps

      callOnchangeProps(props, getState(prevStateRef.current, props), state)
    }

    prevStateRef.current = state
  }, [state, actionWithProps])

  return [state, dispatchWithProps]
}

export function useControlledReducer<Selected extends Date | Date[]>(
  reducer: RepickReducer<Selected>,
  initialState: RepickState<Selected>,
  props: RepickProps<Selected>,
): [RepickState<Selected>, (action: RepickAction) => void] {
  const [state, dispatch] = useEnhancedReducer(reducer, initialState, props)

  return [getState(state, props), dispatch]
}