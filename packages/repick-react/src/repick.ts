import startOfDay from 'date-fns/startOfDay'
import React from 'react'
import {
  buildCalendarContext,
  keyToAction,
  reducer,
  RepickDayContext,
  RepickState,
  RepickStateGeneric,
} from 'repick-core'
import { useControllableReducer } from './use-controllable-reducer'
import {
  RepickPropsSingle,
  RepickPropsMulti,
  RepickPropsRange,
  RepickProps,
  RepickContextSingle,
  RepickContextMulti,
  RepickContextRange,
  RepickContext,
  RepickPropsGeneric,
  CalendarProps,
  MonthProps,
  DateProps,
  RepickPropsWithChildren,
} from './types'

type PropsPattern<T> = {
  single: (x: RepickPropsSingle) => T
  multi: (x: RepickPropsMulti) => T
  range: (x: RepickPropsRange) => T
}

function matchProps<T>(p: PropsPattern<T>): (props: RepickProps) => T {
  return props => {
    if (props.mode === undefined || props.mode === 'single') {
      return p.single(props)
    }
    if (props.mode === 'multi') {
      return p.multi(props)
    }
    if (props.mode === 'range') {
      return p.range(props)
    }

    throw new Error(`[repick] unexpected props mode '${props.mode}'`)
  }
}

const initializeState = matchProps<RepickState>({
  single: props => ({
    date:
      props.date ||
      props.selected ||
      props.initialDate ||
      props.initialSelected ||
      startOfDay(new Date()),
    mode: 'single',
    selected: props.selected || props.initialSelected || null,
  }),
  multi: props => ({
    date:
      props.date ||
      (props.selected && props.selected[0]) ||
      props.initialDate ||
      (props.initialSelected && props.initialSelected[0]) ||
      startOfDay(new Date()),
    mode: 'multi',
    selected: props.selected || props.initialSelected || null,
  }),
  range: props => ({
    date:
      props.date ||
      (props.selected && props.selected[0]) ||
      props.initialDate ||
      (props.initialSelected && props.initialSelected[0]) ||
      startOfDay(new Date()),
    mode: 'range',
    selected: props.selected || props.initialSelected || null,
  }),
})

function getControlledProps(
  props: RepickPropsGeneric<any, any>,
): Partial<RepickStateGeneric<any, any>> {
  return {
    date: props.date,
    locale: props.locale,
    mode: props.mode,
    selected: props.selected,
    weekStartsOn: props.weekStartsOn,
    filterDates: props.filterDates,
    disabledDates: props.disabledDates,
    enabledDates: props.enabledDates,
    minDate: props.minDate,
    maxDate: props.maxDate,
    monthCount: props.monthCount,
  } as Partial<RepickState>
}

function handleChange<T>(
  props: RepickPropsGeneric<any, T>,
  oldState: RepickStateGeneric<any, T>,
  newState: RepickStateGeneric<any, T>,
) {
  if (props.onChange && oldState.selected !== newState.selected) {
    props.onChange(newState.selected)
  }
  if (props.onUpdate && oldState.date !== newState.date) {
    props.onUpdate(newState.date)
  }
}

export function useRepick(props: RepickPropsSingle): RepickContextSingle
export function useRepick(props: RepickPropsMulti): RepickContextMulti
export function useRepick(props: RepickPropsRange): RepickContextRange
export function useRepick(props: RepickProps): RepickContext
export function useRepick(props: RepickProps): RepickContext {
  const dateRefs: Record<string, HTMLElement> = {}

  const [state, dispatch] = useControllableReducer(
    reducer,
    props,
    initializeState,
    getControlledProps,
    (oldState, newState) => {
      if (
        (props.mode === undefined || props.mode === 'single') &&
        oldState.mode === 'single' &&
        newState.mode === 'single'
      ) {
        handleChange(props, oldState, newState)
      }
      if (
        props.mode === 'multi' &&
        oldState.mode === 'multi' &&
        newState.mode === 'multi'
      ) {
        handleChange(props, oldState, newState)
      }
      if (
        props.mode === 'range' &&
        oldState.mode === 'range' &&
        newState.mode === 'range'
      ) {
        handleChange(props, oldState, newState)
      }
    },
  )

  const setFocusToDate = React.useCallback(
    (date: Date) => {
      window.requestAnimationFrame(() => {
        if (dateRefs[date.toISOString()]) {
          dateRefs[date.toISOString()].focus()
        }
      })
    },
    [dateRefs],
  )

  React.useEffect(() => {
    setFocusToDate(state.date)
  }, [setFocusToDate, state])

  const setFocusToCalendar = () => {
    window.requestAnimationFrame(() => {
      if (dateRefs[state.date.toISOString()]) {
        dateRefs[state.date.toISOString()].focus()
      }
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const action = keyToAction(e.key)

    if (action) {
      e.preventDefault()
      dispatch(action)
    }
  }

  const getCalendarProps = (): CalendarProps => {
    return {
      onKeyDown: handleKeyDown,
      tabIndex: 0,
    }
  }

  const getPrevMonthProps = (): MonthProps => {
    return {
      onClick: () => dispatch({ type: 'PrevMonth' }),
      'aria-label': `Go back 1 month`,
      role: 'button',
    }
  }

  const getNextMonthProps = (): MonthProps => {
    return {
      onClick: () => dispatch({ type: 'NextMonth' }),
      'aria-label': `Go ahead 1 month`,
      role: 'button',
    }
  }

  const getDateProps = (calendarDay: RepickDayContext<any>): DateProps => {
    return {
      onClick: e => {
        e.preventDefault()
        dispatch({ type: 'SelectDate', date: calendarDay.date })
      },
      'aria-label': calendarDay.date.toDateString(),
      'aria-pressed': calendarDay.selected,
      role: 'button',
      tabIndex: calendarDay.current ? 0 : -1,
      ref: (el: HTMLElement | null) => {
        if (el) {
          dateRefs[calendarDay.date.toISOString()] = el
        }
      },
    }
  }

  const context = buildCalendarContext(state)
  return {
    ...context,
    selectDate: (date: string | number | Date) =>
      dispatch({ type: 'SelectDate', date }),
    selectCurrent: () => dispatch({ type: 'SelectCurrent' }),
    prevDay: () => dispatch({ type: 'PrevDay' }),
    nextDay: () => dispatch({ type: 'NextDay' }),
    prevWeek: () => dispatch({ type: 'PrevWeek' }),
    nextWeek: () => dispatch({ type: 'NextWeek' }),
    prevMonth: () => dispatch({ type: 'PrevMonth' }),
    nextMonth: () => dispatch({ type: 'NextMonth' }),
    startOfWeek: () => dispatch({ type: 'StartOfWeek' }),
    endOfWeek: () => dispatch({ type: 'EndOfWeek' }),
    getCalendarProps,
    getDateProps,
    getNextMonthProps,
    getPrevMonthProps,
    handleKeyDown,
    setFocusToCalendar,
    setFocusToDate,
  }
}

export function Repick(props: RepickPropsWithChildren) {
  const { render, ...hookProps } = props

  const context = useRepick(hookProps)

  return render(context as any)
}

export default Repick
