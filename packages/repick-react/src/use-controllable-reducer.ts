import { useState } from 'react'

export const useControllableReducer = <S extends {}, A>(
  reducer: React.Reducer<S, A>,
  initialState: S,
  controlledProps: Partial<S>,
  onChange: (s: S) => void,
): [S, React.Dispatch<A>] => {
  const [state, setState] = useState(initialState)

  const effectiveState = mergeControlledState(controlledProps, state)

  return [
    effectiveState,
    (action: A) => {
      const newState = reducer(effectiveState, action)

      if (onChange) {
        onChange(newState)
      }

      setState(newState)
    },
  ]
}

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
