import startOfDay from 'date-fns/startOfDay'
import React, { useRef } from 'react'
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

const first = <T>(valueOrArray: T | T[]): T =>
  valueOrArray instanceof Array ? valueOrArray[0] : valueOrArray

const initializeState = (props: RepickPropsGeneric<any, any>) => ({
  date:
    props.date ||
    first(props.selected) ||
    props.initialDate ||
    first(props.initialSelected) ||
    startOfDay(new Date()),
  mode: props.mode || 'single',
  selected: props.selected || props.initialSelected || null,
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

function handleChange(
  props: RepickPropsGeneric<any, any>,
  oldState: RepickStateGeneric<any, any>,
  newState: RepickStateGeneric<any, any>,
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
export function useRepick(props: RepickProps): RepickContext {
  const hasFocusRef = useRef<boolean>(false)
  const calendarRef = useRef<HTMLElement>()
  const dateRefs: Record<string, HTMLElement> = {}

  const [state, dispatch] = useControllableReducer(
    reducer,
    props,
    initializeState,
    getControlledProps,
    (oldState, newState) => {
      handleChange(props, oldState, newState)
    },
  )

  const setFocusToDate = React.useCallback(
    (date: Date) => {
      window.requestAnimationFrame(() => {
        if (dateRefs[date.toISOString()]) {
          hasFocusRef.current = true
          dateRefs[date.toISOString()].focus()
        }
      })
    },
    [dateRefs],
  )

  React.useEffect(() => {
    if (hasFocusRef.current === true) {
      setFocusToDate(state.date)
    }
  }, [setFocusToDate, state.date])

  const handleFocusIn = () => {
    hasFocusRef.current = true
  }

  const handleFocusOut = (e: FocusEvent) => {
    if (
      !(
        calendarRef.current &&
        calendarRef.current.contains(e.relatedTarget as HTMLElement)
      )
    ) {
      hasFocusRef.current = false
    }
  }

  React.useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.addEventListener('focusin', handleFocusIn)
      calendarRef.current.addEventListener('focusout', handleFocusOut)
    }

    return () => {
      if (calendarRef.current) {
        calendarRef.current.removeEventListener('focusin', handleFocusIn)
        calendarRef.current.removeEventListener('focusout', handleFocusOut)
      }
    }
  }, [calendarRef.current])

  const setFocusToCalendar = () => {
    window.requestAnimationFrame(() => {
      if (dateRefs[state.date.toISOString()]) {
        hasFocusRef.current = true
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
      ref: (el: HTMLElement | undefined) => {
        calendarRef.current = el
      },
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
      ref: (el: HTMLElement | undefined) => {
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

  const context = useRepick(hookProps as any)

  return render(context as any)
}

export default Repick
