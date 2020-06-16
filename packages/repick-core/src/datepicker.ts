import isSameDay from 'date-fns/isSameDay'
import formatDate from 'date-fns/format'
import isValid from 'date-fns/isValid'
import parseDate from 'date-fns/parse'

import { buildCalendarDay, buildContext } from './core/calendar'
import { reducer } from './core/reducer'
import { RepickContext, RepickDay, RepickState } from './core/types'

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

export const formatSingle = (selected: Date, format: string) =>
  formatDate(selected, format)

export const parseSingle = (dateString: string, format: string) => {
  const parsedDate = parseDate(dateString, format, new Date())

  return isValid(parsedDate) ? parsedDate : false
}

export const reducerSingle = reducer<Date>(
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
) => RepickDaySingle = buildCalendarDay(
  (selected: Date | null, date: Date) =>
    !!selected && isSameDay(selected, date),
  () => ({}),
)

export const buildContextSingle: (
  state: RepickStateSingle,
) => RepickContextSingle = buildContext(buildCalendarDaySingle)
