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

import {
  CalendarContext,
  CalendarContextCommon,
  CalendarContextDayCommon,
  CalendarContextDayMulti,
  CalendarContextDayRange,
  CalendarContextDaySingle,
  CalendarContextMulti,
  CalendarContextRange,
  CalendarContextSingle,
  State,
  StateMulti,
  StateRange,
  StateSingle,
} from './types'
import { buildWeekdays, extractOptionsFromState } from './utils'

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

export function buildCalendarContextDayCommon(
  state: State,
  date: Date,
): CalendarContextDayCommon {
  const prevMonth = subMonths(state.current, 1)
  const nextMonth = addMonths(state.current, 1)

  return {
    date,
    day: getDate(date),
    nextMonth: isSameMonth(nextMonth, date),
    prevMonth: isSameMonth(prevMonth, date),
    selected: isSelected(state, date),
    current: isSameDay(state.current, date),
    today: isSameDay(new Date(), date),
  }
}

export function buildCalendarContextDaySingle(
  state: StateSingle,
  date: Date,
): CalendarContextDaySingle {
  return buildCalendarContextDayCommon(state, date)
}

export function buildCalendarContextDayMulti(
  state: StateMulti,
  date: Date,
): CalendarContextDayMulti {
  return buildCalendarContextDayCommon(state, date)
}

export function buildCalendarContextDayRange(
  state: StateRange,
  date: Date,
): CalendarContextDayRange {
  return {
    ...buildCalendarContextDayCommon(state, date),
    rangeStart: !!state.selected && isSameDay(date, state.selected[0]),
    rangeEnd:
      !!state.selected &&
      !!state.selected[1] &&
      isSameDay(date, state.selected[1]),
  }
}

export function buildCalendarContextCommon(
  state: State,
): CalendarContextCommon {
  const { current } = state
  const options = extractOptionsFromState(state)

  return {
    date: current || null,
    month: current.getMonth() + 1,
    monthLong: format(current, 'MMMM', { locale: options.locale }),
    monthShort: format(current, 'MMM', { locale: options.locale }),
    year: current.getFullYear(),
    weekdays: buildWeekdays(options),
  }
}

export function buildCalendarContext(state: State): CalendarContext {
  const { current } = state
  const options = extractOptionsFromState(state)
  const firstDayOfMonth = startOfMonth(current)
  const firstWeekOfMonth = startOfWeek(firstDayOfMonth, {
    weekStartsOn: options.weekStartsOn,
  })
  switch (state.mode) {
    case 'single': {
      return {
        ...buildCalendarContextCommon(state),
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
        ...buildCalendarContextCommon(state),
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
        ...buildCalendarContextCommon(state),
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
