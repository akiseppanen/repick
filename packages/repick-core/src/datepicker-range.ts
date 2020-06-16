import compareAsc from 'date-fns/compareAsc'
import formatDate from 'date-fns/format'
import isValid from 'date-fns/isValid'
import parseDate from 'date-fns/parse'
import startOfToday from 'date-fns/startOfToday'
import isSameDay from 'date-fns/isSameDay'
import isWithinInterval from 'date-fns/isWithinInterval'

import { buildCalendarDay, buildContext } from './core/calendar'
import { reducer } from './core/reducer'
import { RepickContext, RepickDay, RepickState } from './core/types'
import { sort } from './utils'

export type RepickStateRange = RepickState<[Date] | [Date, Date]>

export type RepickDayRange = RepickDay<{
  rangeStart: boolean
  rangeEnd: boolean
}>

export type RepickContextRange = RepickContext<
  [Date] | [Date, Date],
  RepickDayRange
>

export const selectDateRange = (
  selected: [Date] | [Date, Date] | null,
  date: Date,
): [[Date] | [Date, Date], boolean] =>
  selected === null || isSameDay(selected[0], date) || selected.length === 2
    ? [[date], false]
    : [
        sort(compareAsc, [...selected, date] as Date[]) as
          | [Date]
          | [Date, Date],
        true,
      ]

export const formatRange = (
  selected: [Date] | [Date, Date] | null,
  format: string,
) =>
  selected
    ? selected[1] !== undefined
      ? formatDate(selected[0], format) +
        ' - ' +
        formatDate(selected[1], format)
      : formatDate(selected[0], format)
    : ''

export const parseRange = (dateString: string, format: string) => {
  const baseDate = startOfToday()

  const parsedDate = dateString
    .split('-')
    .map(x => parseDate(x, format, baseDate))

  return parsedDate.length <= 2 && parsedDate.every(isValid)
    ? (parsedDate as [Date] | [Date, Date])
    : false
}

export const reducerRange = reducer<[Date] | [Date, Date]>(
  selectDateRange,
  formatRange,
  parseRange,
)

export const isSelectedRange = (
  selected: [Date] | [Date, Date] | null,
  date: Date,
) =>
  !!selected &&
  (selected[1] !== undefined
    ? isWithinInterval(date, { start: selected[0], end: selected[1] })
    : isSameDay(date, selected[0]))

export const buildCalendarDayRangeExtra = (
  state: RepickStateRange,
  date: Date,
) => ({
  rangeStart: !!state.selected && isSameDay(date, state.selected[0]),
  rangeEnd:
    !!state.selected &&
    !!state.selected[1] &&
    isSameDay(date, state.selected[1]),
})

export const buildCalendarDayRange: (
  state: RepickStateRange,
  currentMonth: Date,
  date: Date,
) => RepickDayRange = buildCalendarDay(
  isSelectedRange,
  buildCalendarDayRangeExtra,
)

export const buildContextRange: (
  state: RepickStateRange,
) => RepickContextRange = buildContext(buildCalendarDayRange)
