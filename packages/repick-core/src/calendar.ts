import addDays from 'date-fns/add_days'
import addMonths from 'date-fns/add_months'
import format from 'date-fns/format'
import getDate from 'date-fns/get_date'
import isSameDay from 'date-fns/is_same_day'
import isSameMonth from 'date-fns/is_same_month'
import isWithinRange from 'date-fns/is_within_range'
import startOfMonth from 'date-fns/start_of_month'
import startOfWeek from 'date-fns/start_of_week'
import subMonths from 'date-fns/sub_months'

import { Calendar, CalendarDay, State, StateType } from './types'
import { buildWeekdays, extractOptionsFromState } from './utils'

export function isSelectedSingle(selected: Date, date: Date) {
  return isSameDay(selected, date)
}

export function isSelectedMulti(selected: Date[], date: Date) {
  return selected.findIndex(x => isSameDay(x, date)) >= 0
}

export function isSelectedRange(selected: [Date, Date?], date: Date) {
  return selected[1] !== undefined
    ? isWithinRange(date, selected[0], selected[1])
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

export function buildDate(state: State, date: Date): CalendarDay {
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

export function buildCalendar(state: State): Calendar<StateType<State>> {
  const { current, selected } = state
  const options = extractOptionsFromState(state)
  const firstDayOfMonth = startOfMonth(current)
  const firstWeekOfMonth = startOfWeek(firstDayOfMonth, {
    weekStartsOn: options.weekStartsOn,
  })

  return {
    date: current || null,
    selected: selected || null,
    month: current.getMonth() + 1,
    monthLong: format(current, 'MMMM', { locale: options.locale }),
    monthShort: format(current, 'MMM', { locale: options.locale }),
    year: current.getFullYear(),
    weekdays: buildWeekdays(options),
    days: Array.apply(null, Array(42)).map((_, i) => {
      return buildDate(state, addDays(firstWeekOfMonth, i))
    }),
  }
}
