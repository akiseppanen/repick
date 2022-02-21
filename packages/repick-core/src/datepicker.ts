import isSameDay from 'date-fns/isSameDay'
import formatDate from 'date-fns/format'
import isValid from 'date-fns/isValid'
import parseDate from 'date-fns/parse'
import startOfToday from 'date-fns/startOfToday'

import { buildCalendarDay, buildContext } from './core/calendar'
import { createReducer } from './core/reducer'
import {
  RepickContext,
  RepickDay,
  RepickState,
  RepickOptions,
} from './core/types'

export type RepickOptionsSingle = RepickOptions<Date>
export type RepickStateSingle = RepickState<Date>
export type RepickDaySingle = RepickDay
export type RepickContextSingle = RepickContext<Date, RepickDaySingle>

export const selectDateSingle = (
  selected: Date | null,
  date: Date,
): [Date | null, boolean] => [
  selected !== null && isSameDay(selected, date) ? null : date,
  true,
]

export const formatSingle = (selected: Date | null, format: string) =>
  selected ? formatDate(selected, format) : ''

export const parseSingle = (dateString: string, format: string) => {
  const parsedDate = parseDate(dateString, format, startOfToday())

  return isValid(parsedDate) ? parsedDate : false
}

export const reducerSingle = createReducer<Date>(
  selectDateSingle,
  formatSingle,
  parseSingle,
)

export const isSelectedSingle = (selected: Date | null, date: Date) =>
  !!selected && isSameDay(selected, date)

export const buildCalendarDaySingle: (
  state: RepickStateSingle,
  currentMonth: Date,
  date: Date,
  index: number,
  options: RepickOptionsSingle,
) => RepickDaySingle = buildCalendarDay(
  (selected: Date | null, date: Date) =>
    !!selected && isSameDay(selected, date),
  () => ({}),
)

export const buildContextSingle: (
  state: RepickStateSingle,
  options: RepickOptionsSingle,
) => RepickContextSingle = buildContext(buildCalendarDaySingle)
