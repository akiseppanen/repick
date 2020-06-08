import isSameDay from 'date-fns/isSameDay'

import { buildCalendarDay, buildContext } from './core/calendar'
import { reducer } from './core/reducer'
import { RepickContext, RepickDay, RepickState } from './core/types'

export type RepickStateSingle = RepickState<Date>

export type RepickDaySingle = RepickDay

export type RepickContextSingle = RepickContext<Date, RepickDaySingle>

export const selectDateSingle = (selected: Date | null, date: Date) =>
  selected !== null && isSameDay(selected, date) ? null : date

export const reducerSingle = reducer<RepickStateSingle>(selectDateSingle)

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
