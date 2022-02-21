import compareAsc from 'date-fns/compareAsc'
import formatDate from 'date-fns/format'
import isValid from 'date-fns/isValid'
import startOfToday from 'date-fns/startOfToday'
import parseDate from 'date-fns/parse'
import isSameDay from 'date-fns/isSameDay'

import { buildCalendarDay, buildContext } from './core/calendar'
import { createReducer } from './core/reducer'
import {
  RepickContext,
  RepickDay,
  RepickState,
  RepickOptions,
} from './core/types'
import { sort, toggleValue } from './utils'

export type RepickOptionsMulti = RepickOptions<Date[]>
export type RepickStateMulti = RepickState<Date[]>
export type RepickDayMulti = RepickDay
export type RepickContextMulti = RepickContext<Date[], RepickDayMulti>

export const selectDateMulti = (
  selected: Date[] | null,
  date: Date,
): [Date[], boolean] => [
  selected !== null
    ? sort(compareAsc, toggleValue(isSameDay, selected, date))
    : [date],
  false,
]

export const isSelectedMulti = (selected: Date[] | null, date: Date) =>
  !!selected && selected.findIndex(x => isSameDay(x, date)) >= 0

export const formatMulti = (selected: Date[] | null, format: string) =>
  selected ? selected.map(date => formatDate(date, format)).join(', ') : ''

export const parseMulti = (dateString: string, format: string) => {
  const baseDate = startOfToday()
  const parsedDate = dateString
    .split(/,/)
    .map(x => parseDate(x, format, baseDate))

  return parsedDate.every(isValid)
    ? (parsedDate as [Date] | [Date, Date])
    : false
}

export const reducerMulti = createReducer<Date[]>(
  selectDateMulti,
  formatMulti,
  parseMulti,
)

const buildCalendarContextDayMulti: (
  state: RepickStateMulti,
  currentMonth: Date,
  date: Date,
  index: number,
  options: RepickOptionsMulti,
) => RepickDayMulti = buildCalendarDay(isSelectedMulti, () => ({}))

export const buildContextMulti: (
  state: RepickStateMulti,
  options: RepickOptionsMulti,
) => RepickContextMulti = buildContext(buildCalendarContextDayMulti)
