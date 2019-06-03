import {
  Reducer,
  ReducerAction,
  ReducerState,
  useCallback,
  useState,
} from 'react'

const mergeControlledState = <S extends {}>(
  controlledProps: Partial<S>,
  stateToMerge: S,
): S => {
  const state: Partial<S> = stateToMerge

  for (const key in controlledProps) {
    if (controlledProps[key] !== undefined) {
      state[key] = controlledProps[key]
    }
  }

  return state as S
}

export const useControllableReducer = <R extends Reducer<any, any>, I>(
  reducer: R,
  initializerArg: I,
  initializer: (arg: I) => ReducerState<R>,
  getControlledProps: (arg: I) => Partial<ReducerState<R>>,
  changeHandler: (oldState: ReducerState<R>, newState: ReducerState<R>) => void,
): [ReducerState<R>, (action: ReducerAction<R>) => void] => {
  const [state, setState] = useState(initializer(initializerArg))

  const effectiveState = mergeControlledState(
    getControlledProps(initializerArg),
    state,
  )

  return [
    effectiveState,
    useCallback(
      (action: ReducerAction<R>) => {
        const newState = reducer(effectiveState, action)

        if (changeHandler) {
          changeHandler(state, newState)
        }

        setState(newState)
      },
      [changeHandler],
    ),
  ]
}
