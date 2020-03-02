import startOfDay from 'date-fns/startOfDay'
import React from 'react'
import {
  CalendarContext,
  CalendarContextMulti,
  CalendarContextRange,
  CalendarContextSingle,
  keyToAction,
  reducer,
  State,
  StateGeneric,
  CalendarContextDay,
  CalendarContextDayMulti,
  CalendarContextDaySingle,
  CalendarContextDayRange,
  buildCalendarContext,
} from 'repick-core'
import { useControllableReducer } from './use-controllable-reducer'

export type CalendarProps = {
  onKeyDown: (e: React.KeyboardEvent) => void
  tabIndex: number
}

export type MonthProps = {
  onClick: (e: React.MouseEvent) => void
  'aria-label': string
  role: string
}

export type DateProps = {
  onClick: (e: React.MouseEvent) => void
  'aria-label': string
  'aria-pressed': boolean
  role: string
  tabIndex: number
  ref: (el: HTMLElement | null) => void
}

type RepickContextGeneric<
  C extends CalendarContext,
  CD extends CalendarContextDay
> = {
  selectDate: (date: string | number | Date) => void
  selectCurrent: () => void
  prevDay: () => void
  nextDay: () => void
  prevWeek: () => void
  nextWeek: () => void
  prevMonth: () => void
  nextMonth: () => void
  startOfWeek: () => void
  endOfWeek: () => void
  getCalendarProps: () => CalendarProps
  getDateProps: (calendarDay: CD) => DateProps
  getNextMonthProps: () => MonthProps
  getPrevMonthProps: () => MonthProps
  handleKeyDown: (e: React.KeyboardEvent) => void
  setFocusToCalendar: () => void
  setFocusToDate: (date: Date) => void
} & C

export type RepickContextSingle = RepickContextGeneric<
  CalendarContextSingle,
  CalendarContextDaySingle
>
export type RepickContextMulti = RepickContextGeneric<
  CalendarContextMulti,
  CalendarContextDayMulti
>
export type RepickContextRange = RepickContextGeneric<
  CalendarContextRange,
  CalendarContextDayRange
>

export type RepickContext =
  | RepickContextSingle
  | RepickContextMulti
  | RepickContextRange

export type PropsGeneric<M, T> = {
  mode?: M
  onChange?: (date: T | null) => void
  onCurrentChange?: (date: Date) => void
  weekStartsOn?: number
  locale?: object
  current?: Date
  initialDate?: Date
  selected?: T | null
  initialSelected?: T
}

export type PropsGenericRequireMode<M, T> = PropsGeneric<M, T> & {
  mode: M
}

export type PropsSingle = PropsGeneric<'single', Date>
export type PropsMulti = PropsGenericRequireMode<'multi', Date[]>
export type PropsRange = PropsGenericRequireMode<'range', [Date, Date?]>
export type Props = PropsSingle | PropsMulti | PropsRange

export type PropsWithChildrenSingle = PropsSingle & {
  children: (context: RepickContextSingle) => React.ReactElement | null
}
export type PropsWithChildrenMulti = PropsMulti & {
  children: (context: RepickContextMulti) => React.ReactElement | null
}
export type PropsWithChildrenRange = PropsRange & {
  children: (context: RepickContextRange) => React.ReactElement | null
}

export type PropsWithChildren =
  | PropsWithChildrenSingle
  | PropsWithChildrenMulti
  | PropsWithChildrenRange

type PropsPattern<T> = {
  single: (x: PropsSingle) => T
  multi: (x: PropsMulti) => T
  range: (x: PropsRange) => T
}

function matchProps<T>(p: PropsPattern<T>): (props: Props) => T {
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

const initializeState = matchProps<State>({
  single: props => ({
    current:
      props.current ||
      props.selected ||
      props.initialDate ||
      props.initialSelected ||
      startOfDay(new Date()),
    mode: 'single',
    selected: props.selected || props.initialSelected || null,
  }),
  multi: props => ({
    current:
      props.current ||
      (props.selected && props.selected[0]) ||
      props.initialDate ||
      (props.initialSelected && props.initialSelected[0]) ||
      startOfDay(new Date()),
    mode: 'multi',
    selected: props.selected || props.initialSelected || null,
  }),
  range: props => ({
    current:
      props.current ||
      (props.selected && props.selected[0]) ||
      props.initialDate ||
      (props.initialSelected && props.initialSelected[0]) ||
      startOfDay(new Date()),
    mode: 'range',
    selected: props.selected || props.initialSelected || null,
  }),
})

function getControlledProps(
  props: PropsGeneric<any, any>,
): Partial<StateGeneric<any, any>> {
  return {
    current: props.current,
    locale: props.locale,
    mode: props.mode,
    selected: props.selected,
    weekStartsOn: props.weekStartsOn,
  } as Partial<State>
}

function handleChange<T>(
  props: PropsGeneric<any, T>,
  oldState: StateGeneric<any, T>,
  newState: StateGeneric<any, T>,
) {
  if (props.onChange && oldState.selected !== newState.selected) {
    props.onChange(newState.selected)
  }
  if (props.onCurrentChange && oldState.current !== newState.current) {
    props.onCurrentChange(newState.current)
  }
}

export function useRepick(props: PropsSingle): RepickContextSingle
export function useRepick(props: PropsMulti): RepickContextMulti
export function useRepick(props: PropsRange): RepickContextRange
export function useRepick(props: Props): RepickContext
export function useRepick(props: Props): RepickContext {
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
    setFocusToDate(state.current)
  }, [setFocusToDate, state])

  const setFocusToCalendar = () => {
    window.requestAnimationFrame(() => {
      if (dateRefs[state.current.toISOString()]) {
        dateRefs[state.current.toISOString()].focus()
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

  const getDateProps = (calendarDay: CalendarContextDay): DateProps => {
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

  return {
    ...buildCalendarContext(state),
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

export function Repick(props: PropsWithChildren) {
  const { children, ...hookProps } = props

  const context = useRepick(hookProps as any)

  return children(context as any)
}

export default Repick
