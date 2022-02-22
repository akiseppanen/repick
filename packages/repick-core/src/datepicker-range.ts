import compareAsc from 'date-fns/compareAsc'
import formatDate from 'date-fns/format'
import isValid from 'date-fns/isValid'
import parseDate from 'date-fns/parse'
import startOfToday from 'date-fns/startOfToday'
import isSameDay from 'date-fns/isSameDay'
import isWithinInterval from 'date-fns/isWithinInterval'

import { buildCalendarDay, buildContext } from './core/calendar'
import { createReducer } from './core/reducer'
import {
  RepickContext,
  RepickDay,
  RepickState,
  RepickOptions,
} from './core/types'
import { getHighlightedDate, sort } from './utils'

export type RepickOptionsRange = RepickOptions<
  [Date] | [Date, Date],
  {
    allowSelectingSameDate: boolean
  }
>
export type RepickStateRange = RepickState<[Date] | [Date, Date]>
export type RepickDayRange = RepickDay<{
  inRange: boolean
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
  options: RepickOptionsRange,
): [[Date] | [Date, Date], boolean] => {
  return selected === null ||
    selected.length === 2 ||
    (options.allowSelectingSameDate !== true && isSameDay(selected[0], date))
    ? [[date], false]
    : [
        sort(compareAsc, [...selected, date] as Date[]) as
          | [Date]
          | [Date, Date],
        true,
      ]
}

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

export const reducerRange = createReducer<[Date] | [Date, Date]>(
  selectDateRange,
  formatRange,
  parseRange,
)

export const isSelectedRange = (
  selected: [Date] | [Date, Date] | null,
  date: Date,
) =>
  !!selected &&
  (isSameDay(date, selected[0]) ||
    (!!selected[1] && isSameDay(date, selected[1])))

export const buildCalendarDayRangeExtra = (
  state: RepickStateRange,
  date: Date,
  options: Pick<RepickOptions<unknown>, 'weekStartsOn'> = {},
) => {
  const [rangeStart, rangeEnd] = !!state.selected
    ? [
        state.selected[0],
        state.selected[1] ||
          getHighlightedDate(state.activeDate, state.highlightedIndex, {
            weekStartsOn: options.weekStartsOn,
          }),
      ].sort(compareAsc)
    : []

  return {
    inRange:
      !!rangeStart &&
      !!rangeEnd &&
      isWithinInterval(date, {
        start: rangeStart,
        end: rangeEnd,
      }),
    rangeStart: !!rangeStart && isSameDay(date, rangeStart),
    rangeEnd: !!rangeEnd && isSameDay(date, rangeEnd),
  }
}

export const buildCalendarDayRange: (
  state: RepickStateRange,
  currentMonth: Date,
  date: Date,
  index: number,
  options: RepickOptionsRange,
) => RepickDayRange = buildCalendarDay(
  isSelectedRange,
  buildCalendarDayRangeExtra,
)

export const buildContextRange: (
  state: RepickStateRange,
  options: RepickOptionsRange,
) => RepickContextRange = buildContext(buildCalendarDayRange)
