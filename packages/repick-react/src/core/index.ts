import format from 'date-fns/format'
import startOfDay from 'date-fns/startOfDay'
import React, { useRef } from 'react'
import {
  Action,
  keyToAction,
  RepickContext,
  RepickDay,
  RepickState,
} from 'repick-core'

import { useControllableReducer } from './use-controllable-reducer'
import {
  RepickProps,
  RepickReturnValue,
  CalendarProps,
  MonthProps,
  DateProps,
} from './types'

export type RepickCoreDeps<Selected, DayContext extends RepickDay<any>> = {
  reducer: (
    state: RepickState<Selected>,
    action: Action,
  ) => RepickState<Selected>
  buildContext: (
    state: RepickState<Selected>,
  ) => RepickContext<Selected, DayContext>
}

export type RepickPropsWithCoreDeps<
  Selected,
  DayContext extends RepickDay<any>
> = RepickProps<Selected> & RepickCoreDeps<Selected, DayContext>

export function useDatePickerCore<Selected, DayContext extends RepickDay<any>>({
  buildContext,
  reducer,
  ...props
}: RepickPropsWithCoreDeps<Selected, DayContext>): RepickReturnValue<
  Selected,
  DayContext
> {
  function initializeState(
    props: RepickProps<Selected>,
  ): RepickState<Selected> {
    return {
      highlighted:
        props.highlighted || props.initialHighlighted || startOfDay(new Date()),
      selected: props.selected || props.initialSelected || null,
    }
  }

  function getControlledProps(
    props: RepickProps<Selected>,
  ): Partial<RepickState<Selected>> {
    return {
      highlighted: props.highlighted,
      locale: props.locale,
      selected: props.selected,
      weekStartsOn: props.weekStartsOn,
      filterDates: props.filterDates,
      disabledDates: props.disabledDates,
      enabledDates: props.enabledDates,
      minDate: props.minDate,
      maxDate: props.maxDate,
      monthCount: props.monthCount,
    }
  }

  const hasFocusRef = useRef<boolean>(false)
  const calendarRef = useRef<HTMLElement>()
  const dateRefs: Record<string, HTMLElement> = {}

  const [state, dispatch] = useControllableReducer(
    reducer,
    props,
    initializeState,
    getControlledProps,
    (oldState, newState) => {
      if (props.onChange && oldState.selected !== newState.selected) {
        props.onChange(newState.selected)
      }
      if (props.onUpdate && oldState.highlighted !== newState.highlighted) {
        props.onUpdate(newState.highlighted)
      }
    },
  )

  const formatDateRefId = (date: Date) => format(date, 'yyyy-MM-dd')

  const setFocusToDate = React.useCallback(
    (date: Date) => {
      window.requestAnimationFrame(() => {
        const id = formatDateRefId(date)
        if (dateRefs[id]) {
          hasFocusRef.current = true
          dateRefs[id].focus()
        }
      })
    },
    [dateRefs],
  )

  React.useEffect(() => {
    if (props.autoFocus === true) {
      setFocusToCalendar()
    }
  }, [])

  React.useEffect(() => {
    if (hasFocusRef.current === true) {
      setFocusToDate(state.highlighted)
    }
  }, [setFocusToDate, state.highlighted])

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
      const id = formatDateRefId(state.highlighted)
      if (dateRefs[id]) {
        hasFocusRef.current = true
        dateRefs[id].focus()
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
      ref: (el: HTMLElement | null) => {
        calendarRef.current = el || undefined
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

  const getDateProps = (calendarDay: RepickDay<any>): DateProps => {
    return {
      onClick: e => {
        e.preventDefault()
        dispatch({ type: 'SelectDate', date: calendarDay.date })
      },
      'aria-label': calendarDay.date.toDateString(),
      'aria-pressed': calendarDay.selected,
      role: 'button',
      tabIndex: calendarDay.highlighted ? 0 : -1,
      ref: (el: HTMLElement | null) => {
        if (el) {
          dateRefs[formatDateRefId(calendarDay.date)] = el
        }
      },
    }
  }

  const context = buildContext(state)

  return {
    ...context,
    selectDate: (date: string | number | Date) =>
      dispatch({ type: 'SelectDate', date }),
    selectCurrent: () => dispatch({ type: 'SelectHighlighted' }),
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
