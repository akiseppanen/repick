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
  return function(state: S, date: Date): RepickDayContext<E> {
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
  state: RepickStateSingle,
  date: Date,
) => RepickDayContextSingle = buildCalendarContextDayGeneric(() => ({}))

export const buildCalendarContextDayMulti: (
  state: RepickStateMulti,
  date: Date,
) => RepickDayContextMulti = buildCalendarContextDayGeneric(() => ({}))

export const buildCalendarContextDayRange: (
  state: RepickStateRange,
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
>(buildCalendarContextDay: (state: S, date: Date) => RepickDayContext<E>) {
  return function(
    state: S,
  ): RepickCalendarContextGeneric<any, any, RepickDayContext<E>> {
    const { current } = state
    const firstDayOfMonth = startOfMonth(current)
    const firstWeekOfMonth = startOfWeek(firstDayOfMonth, {
      weekStartsOn: state.weekStartsOn,
    })

    return {
      mode: state.mode,
      date: current || null,
      month: current.getMonth() + 1,
      monthLong: format(current, 'MMMM', { locale: state.locale }),
      monthShort: format(current, 'MMM', { locale: state.locale }),
      year: current.getFullYear(),
      weekdays: buildWeekdays(state),
      selected: state.selected,
      calendar: {
        month: current.getMonth() + 1,
        monthLong: format(current, 'MMMM', { locale: state.locale }),
        monthShort: format(current, 'MMM', { locale: state.locale }),
        year: current.getFullYear(),
        weeks: arrayGenerate(6, i => ({
          weekNumber: getWeek(addDays(firstWeekOfMonth, i * 7), {
            weekStartsOn: state.weekStartsOn,
          }),
          year: current.getFullYear(),
          days: arrayGenerate(7, a =>
            buildCalendarContextDay(
              state,
              addDays(firstWeekOfMonth, i * 7 + a),
            ),
          ),
        })),
      },
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
