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
  RepickCalendarContextGeneric,
  RepickDayContext,
  RepickDayContextMulti,
  RepickDayContextRange,
  RepickDayContextSingle,
  RepickState,
  RepickStateMulti,
  RepickStateRange,
  RepickStateSingle,
} from './types'
import { buildWeekdays, dateIsSelectable, arrayGenerate } from './utils'
import { getWeek } from 'date-fns'

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

export function isSelected(state: RepickState, date: Date): boolean {
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
export function buildCalendarContextDayGeneric<
  S extends RepickState,
  E extends {}
>(extraFn: (state: S, date: Date) => E) {
  return function (
    state: S,
    currentMonth: Date,
    date: Date,
  ): RepickDayContext<E> {
    const prevMonth = subMonths(currentMonth, 1)
    const nextMonth = addMonths(currentMonth, 1)

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
  state: RepickStateSingle,
  currentMonth: Date,
  date: Date,
) => RepickDayContextSingle = buildCalendarContextDayGeneric(() => ({}))

export const buildCalendarContextDayMulti: (
  state: RepickStateMulti,
  currentMonth: Date,

  date: Date,
) => RepickDayContextMulti = buildCalendarContextDayGeneric(() => ({}))

export const buildCalendarContextDayRange: (
  state: RepickStateRange,
  currentMonth: Date,
  date: Date,
) => RepickDayContextRange = buildCalendarContextDayGeneric(
  (state: RepickStateRange, date) => ({
    rangeStart: !!state.selected && isSameDay(date, state.selected[0]),
    rangeEnd:
      !!state.selected &&
      !!state.selected[1] &&
      isSameDay(date, state.selected[1]),
  }),
)

export function buildCalendarContextGeneric<
  S extends RepickState,
  E extends {}
>(
  buildCalendarContextDay: (
    state: S,
    currentMonth: Date,
    date: Date,
  ) => RepickDayContext<E>,
) {
  return function (
    state: S,
  ): RepickCalendarContextGeneric<any, any, RepickDayContext<E>> {
    const { current } = state

    return {
      mode: state.mode,
      date: current || null,
      month: current.getMonth() + 1,
      monthLong: format(current, 'MMMM', { locale: state.locale }),
      monthShort: format(current, 'MMM', { locale: state.locale }),
      year: current.getFullYear(),
      weekdays: buildWeekdays(state),
      selected: state.selected,
      calendar: arrayGenerate(state.monthCount || 1, monthIndex => {
        const firstDayOfMonth = startOfMonth(addMonths(current, monthIndex))
        const firstWeekOfMonth = startOfWeek(firstDayOfMonth, {
          weekStartsOn: state.weekStartsOn,
        })

        return {
          month: firstDayOfMonth.getMonth() + 1,
          monthLong: format(firstDayOfMonth, 'MMMM', { locale: state.locale }),
          monthShort: format(firstDayOfMonth, 'MMM', { locale: state.locale }),
          year: firstDayOfMonth.getFullYear(),
          weeks: arrayGenerate(6, weekIndex => ({
            weekNumber: getWeek(addDays(firstWeekOfMonth, weekIndex * 7), {
              weekStartsOn: state.weekStartsOn,
            }),
            year: current.getFullYear(),
            days: arrayGenerate(7, dayIndex =>
              buildCalendarContextDay(
                state,
                firstDayOfMonth,
                addDays(firstWeekOfMonth, weekIndex * 7 + dayIndex),
              ),
            ),
          })),
        }
      }),
    }
  }
}

export function buildCalendarContext(
  state: RepickState,
): RepickCalendarContextGeneric<any, any, any> {
  switch (state.mode) {
    case 'single':
      return buildCalendarContextGeneric(buildCalendarContextDaySingle)(state)
    case 'multi':
      return buildCalendarContextGeneric(buildCalendarContextDayMulti)(state)
    case 'range':
      return buildCalendarContextGeneric(buildCalendarContextDayRange)(state)

    default:
      const _: never = state
      return _
  }
}
