import {
  objectCopyPartial,
  getHighlightedIndexForDate,
  RepickAction,
  RepickOptions,
  RepickState,
} from '@repick/core'
import { useCallback, useEffect, useReducer, useRef } from 'react'
import { RepickProps } from './types'

export function usePrevious<T>(value: T | undefined): T | undefined {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

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
      'updateHighlightedOnHover',
    ],
    props,
  )
}

function getState<Selected extends Date | Date[]>(
  state: RepickState<Selected>,
  props: RepickProps<Selected> = {},
): RepickState<Selected> {
  return (
    Object.keys(state) as unknown as (keyof RepickState<Selected>)[]
  ).reduce<any>(
    (prevState, key) => {
      const isControlledProp = props[key] !== undefined

      if (
        key === 'highlightedIndex' &&
        !isControlledProp &&
        props.highlightedDate !== undefined
      ) {
        const activeDate = props.activeDate || state.activeDate

        return {
          ...prevState,
          [key]: getHighlightedIndexForDate(activeDate, props.highlightedDate, {
            weekStartsOn: props.weekStartsOn,
          }),
        }
      }

      return {
        ...prevState,
        [key]: isControlledProp ? props[key] : prevState[key],
      }
    },
    { ...state },
  )
}

function invokeOnchangeHandler<Selected extends Date | Date[]>(
  props: RepickProps<Selected>,
  newState: RepickState<Selected>,
  key: keyof RepickState<Selected>,
) {
  const handler = `on${key.slice(0, 1).toUpperCase()}${key.slice(1)}Change`

  if (handler in props && newState[key] !== undefined) {
    ;(props as any)[handler](newState[key])
  }
}

function callOnchangeProps<Selected extends Date | Date[]>(
  actionWithProps: RepickAction & { props: RepickProps<Selected> },
  state: RepickState<Selected>,
  newState: RepickState<Selected>,
) {
  const { props, ...action } = actionWithProps

  const changes: (keyof RepickState<Selected>)[] = (
    Object.keys(state) as unknown as (keyof RepickState<Selected>)[]
  ).filter(key => state[key] !== newState[key])

  changes.forEach(key => invokeOnchangeHandler(props, newState, key))

  if (props.onStateChange && Object.keys(changes).length) {
    props.onStateChange({
      action,
      changes: changes.reduce(
        (obj: Partial<RepickState<Selected>>, key) => ({
          ...obj,
          [key]: newState[key],
        }),
        {},
      ),
    })
  }
}

type RepickReducer<Selected extends Date | Date[]> = (
  state: RepickState<Selected>,
  action: RepickAction,
  options: RepickOptions<Selected>,
) => Partial<RepickState<Selected>>

function useEnhancedReducer<Selected extends Date | Date[]>(
  reducer: RepickReducer<Selected>,
  props: RepickProps<Selected>,
  stateInitializer: (props: RepickProps<Selected>) => RepickState<Selected>,
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

  const [state, dispatch] = useReducer(enhancedReducer, props, stateInitializer)

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
      callOnchangeProps(
        actionWithProps,
        getState(prevStateRef.current, props),
        state,
      )
    }

    prevStateRef.current = state
  }, [props, state, actionWithProps])

  return [state, dispatchWithProps]
}

export function useControlledReducer<Selected extends Date | Date[]>(
  reducer: RepickReducer<Selected>,
  props: RepickProps<Selected>,
  stateInitializer: (props: RepickProps<Selected>) => RepickState<Selected>,
): [RepickState<Selected>, (action: RepickAction) => void] {
  const [state, dispatch] = useEnhancedReducer(reducer, props, stateInitializer)

  return [getState(state, props), dispatch]
}
