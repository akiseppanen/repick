import * as addDays from 'date-fns/add_days'
import * as addMonths from 'date-fns/add_months'
import * as format from 'date-fns/format'
import * as getDate from 'date-fns/get_date'
import * as isSameDay from 'date-fns/is_same_day'
import * as isSameMonth from 'date-fns/is_same_month'
import * as setDay from 'date-fns/set_day'
import * as startOfMonth from 'date-fns/start_of_month'
import * as startOfWeek from 'date-fns/start_of_week'
import * as subMonths from 'date-fns/sub_months'

import { extractOptionsFromState, Options } from './options'
import { State } from './reducer'
import { wrapWeekDay } from './utils'

export interface CalendarDay {
  date: Date
  day: number
  nextMonth: boolean
  prevMonth: boolean
  selected: boolean
  current: boolean
  today: boolean
}

export interface Weekday {
  long: string
  short: string
}

export interface Calendar {
  date: Date
  selected: Date | null
  month: number
  monthLong: string
  monthShort: string
  year: number
  weekdays: Weekday[]
  days: CalendarDay[]
}

export function buildWeekdays(options: Options = {}): Weekday[] {
  return Array.apply(null, Array(7)).map((v: null, i: number) => {
    const day = setDay(new Date(), wrapWeekDay(i + (options.weekStartsOn || 0)))

    return {
      long: format(day, 'dddd', { locale: options.locale }),
      short: format(day, 'ddd', { locale: options.locale }),
    }
  })
}

export function buildDate({ date, selected }: State, d: Date): CalendarDay {
  const prevMonth = subMonths(date, 1)
  const nextMonth = addMonths(date, 1)

  return {
    date: d,
    day: getDate(d),
    nextMonth: isSameMonth(nextMonth, d),
    prevMonth: isSameMonth(prevMonth, d),
    selected: !!selected && isSameDay(selected, d),
    current: isSameDay(date, d),
    today: isSameDay(new Date(), d),
  }
}

export function buildCalendar(state: State): Calendar {
  const { date, selected } = state
  const options = extractOptionsFromState(state)
  const firstDayOfMonth = startOfMonth(date)
  const firstWeekOfMonth = startOfWeek(firstDayOfMonth, {
    weekStartsOn: options.weekStartsOn,
  })

  return {
    date: date || null,
    selected: selected || null,
    month: date.getMonth() + 1,
    monthLong: format(date, 'MMMM', { locale: options.locale }),
    monthShort: format(date, 'MMM', { locale: options.locale }),
    year: date.getFullYear(),
    weekdays: buildWeekdays(options),
    days: Array.apply(null, Array(42)).map(
      (v: null, i: number): CalendarDay => {
        return buildDate(state, addDays(firstWeekOfMonth, i))
      },
    ),
  }
}
