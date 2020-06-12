import compareAsc from 'date-fns/compareAsc'
import formatDate from 'date-fns/format'
import isSameDay from 'date-fns/isSameDay'

import { buildCalendarDay, buildContext } from './core/calendar'
import { reducer } from './core/reducer'
import { RepickContext, RepickDay, RepickState } from './core/types'
import { sort, toggleValue } from './utils'

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

export const formatMulti = (selected: Date[], format: string) =>
  selected.map(date => formatDate(date, format)).join(', ')

export const reducerMulti = reducer<RepickStateMulti>(
  selectDateMulti,
  formatMulti,
)

const buildCalendarContextDayMulti: (
  state: RepickStateMulti,
  currentMonth: Date,
  date: Date,
) => RepickDayMulti = buildCalendarDay(isSelectedMulti, () => ({}))

export const buildContextMulti: (
  state: RepickStateMulti,
) => RepickContextMulti = buildContext(buildCalendarContextDayMulti)
