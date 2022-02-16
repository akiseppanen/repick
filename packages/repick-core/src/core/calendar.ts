import addDays from 'date-fns/addDays'
import addMonths from 'date-fns/addMonths'
import format from 'date-fns/format'
import getDate from 'date-fns/getDate'
import getWeek from 'date-fns/getWeek'
import isSameDay from 'date-fns/isSameDay'
import isSameMonth from 'date-fns/isSameMonth'
import startOfMonth from 'date-fns/startOfMonth'
import startOfWeek from 'date-fns/startOfWeek'
import subMonths from 'date-fns/subMonths'

import { buildWeekdays, dateIsSelectable, arrayGenerate } from '../utils'
import {
  RepickContext,
  RepickDay,
  RepickState,
  RepickWeek,
  RepickOptions,
  RepickStateSelected,
} from './types'

export function buildCalendarDay<
  State extends RepickState<any>,
  Extra extends { [key: string]: any } = {},
>(
  isSelected: (selected: State['selected'], date: Date) => boolean,
  extraFn: (
    state: State,
    date: Date,
    options: RepickOptions<State['selected']>,
  ) => Extra,
) {
  return function (
    state: State,
    currentMonth: Date,
    date: Date,
    index: number,
    options: RepickOptions<RepickStateSelected<State>> = {},
  ): RepickDay<Extra> {
    const prevMonth = subMonths(currentMonth, 1)
    const nextMonth = addMonths(currentMonth, 1)

    return {
      date,
      day: getDate(date),
      index,
      nextMonth: isSameMonth(nextMonth, date),
      prevMonth: isSameMonth(prevMonth, date),
      selected: isSelected(state.selected, date),
      highlighted: state.highlightedIndex === index,
      disabled: !dateIsSelectable(options, date),
      today: isSameDay(new Date(), date),
      ...extraFn(state, date, options),
    }
  }
}

export function buildContext<
  State extends RepickState<any>,
  Extra extends { [key: string]: any } = {},
>(
  buildCalendarDay: (
    state: State,
    currentMonth: Date,
    date: Date,
    index: number,
    options: RepickOptions<RepickStateSelected<State>>,
  ) => RepickDay<Extra>,
) {
  return function (
    state: State,
    options: RepickOptions<RepickStateSelected<State>> = {},
  ): RepickContext<any, RepickDay<Extra>> {
    const { activeDate, highlightedIndex } = state

    const months = arrayGenerate(options.monthCount || 1, monthIndex => {
      const firstDayOfMonth = startOfMonth(addMonths(activeDate, monthIndex))
      const firstWeekOfMonth = startOfWeek(firstDayOfMonth, {
        weekStartsOn: options.weekStartsOn,
      })

      const weeks = arrayGenerate(6, weekIndex => ({
        weekNumber: getWeek(addDays(firstWeekOfMonth, weekIndex * 7), {
          weekStartsOn: options.weekStartsOn,
        }),
        year: activeDate.getFullYear(),
        days: arrayGenerate(7, dayIndex =>
          buildCalendarDay(
            state,
            firstDayOfMonth,
            addDays(firstWeekOfMonth, weekIndex * 7 + dayIndex),
            monthIndex * 42 + weekIndex * 7 + dayIndex,
            options,
          ),
        ),
      }))

      const days = weeks.reduce<RepickDay<Extra>[]>(
        (x, week) => [...x, ...week.days],
        [],
      )

      return {
        month: firstDayOfMonth.getMonth() + 1,
        monthLong: format(firstDayOfMonth, 'MMMM', { locale: options.locale }),
        monthShort: format(firstDayOfMonth, 'MMM', { locale: options.locale }),
        year: firstDayOfMonth.getFullYear(),
        weeks,
        days,
      }
    })

    const weeks = months.reduce<RepickWeek<RepickDay<Extra>>[]>(
      (x, month) => [...x, ...month.weeks],
      [],
    )

    const days = weeks.reduce<RepickDay<Extra>[]>(
      (x, week) => [...x, ...week.days],
      [],
    )

    return {
      activeDate,
      isOpen: state.isOpen,
      inputValue: state.inputValue,
      highlightedIndex: highlightedIndex,
      month: activeDate.getMonth() + 1,
      monthLong: format(activeDate, 'MMMM', { locale: options.locale }),
      monthShort: format(activeDate, 'MMM', { locale: options.locale }),
      year: activeDate.getFullYear(),
      weekdays: buildWeekdays(options),
      selected: state.selected,
      months,
      weeks,
      days,
    }
  }
}
