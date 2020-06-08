import compareAsc from 'date-fns/compareAsc'
import isSameDay from 'date-fns/isSameDay'
import isWithinInterval from 'date-fns/isWithinInterval'

import { buildCalendarDay, buildContext } from './core/calendar'
import { reducer } from './core/reducer'
import { RepickContext, RepickDay, RepickState } from './core/types'
import { sort } from './utils'

export type RepickStateRange = RepickState<[Date, Date?]>

export type RepickDayRange = RepickDay<{
  rangeStart: boolean
  rangeEnd: boolean
}>

export type RepickContextRange = RepickContext<[Date, Date?], RepickDayRange>

export const selectDateRange = (selected: [Date, Date?] | null, date: Date) =>
  (selected === null || isSameDay(selected[0], date) || selected.length === 2
    ? [date]
    : sort(compareAsc, [...selected, date] as Date[])) as [Date, Date?]

export const reducerRange = reducer<RepickStateRange>(selectDateRange)

export const isSelectedRange = (selected: [Date, Date?] | null, date: Date) =>
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
