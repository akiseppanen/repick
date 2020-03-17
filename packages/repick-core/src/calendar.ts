import addDays from 'date-fns/addDays'
import addMonths from 'date-fns/addMonths'
import format from 'date-fns/format'
import getDate from 'date-fns/getDate'
import isSameDay from 'date-fns/isSameDay'
import isSameMonth from 'date-fns/isSameMonth'
import isWithinInterval from 'date-fns/isWithinInterval'
import startOfMonth from 'date-fns/startOfMonth'
import startOfWeek from 'date-fns/startOfWeek'
import subMonths from 'date-fns/subMonths'

import { State, StateMulti, StateRange, StateSingle } from './types'
import { buildWeekdays, dateIsSelectable } from './utils'

export type CalendarContextDayGeneric<E extends {}> = {
  date: Date
  day: number
  nextMonth: boolean
  prevMonth: boolean
  selected: boolean
  current: boolean
  today: boolean
  disabled: boolean
} & E

export type CalendarContextDaySingle = CalendarContextDayGeneric<{}>
export type CalendarContextDayMulti = CalendarContextDayGeneric<{}>
export type CalendarContextDayRange = CalendarContextDayGeneric<{
  rangeStart: boolean
  rangeEnd: boolean
}>

export type CalendarContextDay =
  | CalendarContextDaySingle
  | CalendarContextDayMulti
  | CalendarContextDayRange

export type Weekday = {
  long: string
  short: string
}

export type CalendarContextGeneric<
  M,
  T,
  D extends CalendarContextDayGeneric<{}>
> = {
  mode: M
  selected: T
  date: Date
  month: number
  monthLong: string
  monthShort: string
  year: number
  weekdays: Weekday[]
  days: D[]
}

export type CalendarContextSingle = CalendarContextGeneric<
  'single',
  Date,
  CalendarContextDaySingle
>

export type CalendarContextMulti = CalendarContextGeneric<
  'multi',
  Date[],
  CalendarContextDayMulti
>

export type CalendarContextRange = CalendarContextGeneric<
  'range',
  [Date, Date?],
  CalendarContextDayRange
>

export type CalendarContext =
  | CalendarContextSingle
  | CalendarContextMulti
  | CalendarContextRange

export function isSelectedSingle(selected: Date, date: Date) {
  return isSameDay(selected, date)
}

export function isSelectedMulti(selected: Date[], date: Date) {
  return selected.findIndex(x => isSameDay(x, date)) >= 0
}

export function isSelectedRange(selected: [Date, Date?], date: Date) {
  return selected[1] !== undefined
    ? isWithinInterval(date, { start: selected[0], end: selected[1] })
    : isSameDay(date, selected[0])
}

export function isSelected(state: State, date: Date): boolean {
  switch (state.mode) {
    case 'single':
      return !!state.selected && isSelectedSingle(state.selected, date)
    case 'multi':
      return !!state.selected && isSelectedMulti(state.selected, date)
    case 'range':
      return !!state.selected && isSelectedRange(state.selected, date)

    default:
      const _: never = state
      return _
  }
}
export function buildCalendarContextDayGeneric<S extends State, E extends {}>(
  extraFn: (state: S, date: Date) => E,
) {
  return function(state: S, date: Date): CalendarContextDayGeneric<E> {
    const prevMonth = subMonths(state.current, 1)
    const nextMonth = addMonths(state.current, 1)

    return {
      date,
      day: getDate(date),
      nextMonth: isSameMonth(nextMonth, date),
      prevMonth: isSameMonth(prevMonth, date),
      selected: isSelected(state, date),
      current: isSameDay(state.current, date),
      disabled: !dateIsSelectable(state, date),
      today: isSameDay(new Date(), date),
      ...extraFn(state, date),
    }
  }
}

export const buildCalendarContextDaySingle: (
  state: StateSingle,
  date: Date,
) => CalendarContextDaySingle = buildCalendarContextDayGeneric(() => ({}))

export const buildCalendarContextDayMulti: (
  state: StateMulti,
  date: Date,
) => CalendarContextDayMulti = buildCalendarContextDayGeneric(() => ({}))

export const buildCalendarContextDayRange: (
  state: StateRange,
  date: Date,
) => CalendarContextDayRange = buildCalendarContextDayGeneric(
  (state: StateRange, date) => ({
    rangeStart: !!state.selected && isSameDay(date, state.selected[0]),
    rangeEnd:
      !!state.selected &&
      !!state.selected[1] &&
      isSameDay(date, state.selected[1]),
  }),
)

export function buildCalendarContext(
  state: State,
): CalendarContextGeneric<any, any, any> {
  const { current } = state
  const firstDayOfMonth = startOfMonth(current)
  const firstWeekOfMonth = startOfWeek(firstDayOfMonth, {
    weekStartsOn: state.weekStartsOn,
  })
  switch (state.mode) {
    case 'single': {
      return {
        date: current || null,
        month: current.getMonth() + 1,
        monthLong: format(current, 'MMMM', { locale: state.locale }),
        monthShort: format(current, 'MMM', { locale: state.locale }),
        year: current.getFullYear(),
        weekdays: buildWeekdays(state),
        selected: state.selected,
        days: Array.apply(null, Array(42)).map((_, i) => {
          return buildCalendarContextDaySingle(
            state,
            addDays(firstWeekOfMonth, i),
          )
        }),
      } as CalendarContextSingle
    }
    case 'multi': {
      return {
        date: current || null,
        month: current.getMonth() + 1,
        monthLong: format(current, 'MMMM', { locale: state.locale }),
        monthShort: format(current, 'MMM', { locale: state.locale }),
        year: current.getFullYear(),
        weekdays: buildWeekdays(state),
        selected: state.selected,
        days: Array.apply(null, Array(42)).map((_, i) => {
          return buildCalendarContextDayMulti(
            state,
            addDays(firstWeekOfMonth, i),
          )
        }),
      } as CalendarContextMulti
    }
    case 'range': {
      return {
        date: current || null,
        month: current.getMonth() + 1,
        monthLong: format(current, 'MMMM', { locale: state.locale }),
        monthShort: format(current, 'MMM', { locale: state.locale }),
        year: current.getFullYear(),
        weekdays: buildWeekdays(state),
        selected: state.selected,
        days: Array.apply(null, Array(42)).map((_, i) => {
          return buildCalendarContextDayRange(
            state,
            addDays(firstWeekOfMonth, i),
          )
        }),
      } as CalendarContextRange
    }

    default: {
      const _: never = state
      return _
    }
  }
}
