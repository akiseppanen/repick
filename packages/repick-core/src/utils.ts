import compareAsc from 'date-fns/compareAsc'
import format from 'date-fns/format'
import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import isSameDay from 'date-fns/isSameDay'
import setDay from 'date-fns/setDay'

import {
  Action,
  actionEndOfWeek,
  actionNextDay,
  actionNextMonth,
  actionNextWeek,
  actionPrevDay,
  actionPrevMonth,
  actionPrevWeek,
  actionSelectCurrent,
  actionStartOfWeek,
} from './actions'
import { Options, StateGeneric } from './types'
import { Weekday } from './calendar'

export const wrap = (min: number, max: number) => (x: number) => {
  const d = max - min
  return ((((x - min) % d) + d) % d) + min
}

export const wrapWeekDay = wrap(0, 7)

export function keyToAction(key: string): Action | null {
  switch (key) {
    case 'ArrowLeft': {
      return { type: actionPrevDay }
    }
    case 'ArrowRight': {
      return { type: actionNextDay }
    }
    case 'ArrowUp': {
      return { type: actionPrevWeek }
    }
    case 'ArrowDown': {
      return { type: actionNextWeek }
    }
    case 'PageDown': {
      return { type: actionPrevMonth }
    }
    case 'PageUp': {
      return { type: actionNextMonth }
    }
    case 'Home': {
      return { type: actionStartOfWeek }
    }
    case 'End': {
      return { type: actionEndOfWeek }
    }
    case 'Enter': {
      return { type: actionSelectCurrent }
    }
  }

  return null
}

export function buildWeekdays(options: Options = {}): Weekday[] {
  const date = new Date()

  return Array.apply(null, Array(7)).map((_, i) => {
    const day = setDay(date, wrapWeekDay(i + (options.weekStartsOn || 0)))

    return {
      long: format(day, 'iiii', { locale: options.locale }),
      short: format(day, 'iii', { locale: options.locale }),
    }
  })
}

export function sort<T>(compareFn: (a: T, b: T) => number, array: T[]) {
  const result = [...array]

  result.sort(compareFn)

  return result
}

export function arrayIncludes<T>(
  compareFn: (a: T, b: T) => boolean,
  array: T[],
  value: T,
) {
  return array.findIndex(x => compareFn(x, value)) !== -1
}

export function toggleValue<T>(
  compareFn: (a: T, b: T) => boolean,
  orig: T[],
  value: T,
) {
  const index = orig.findIndex(x => compareFn(x, value))

  const result = [...orig]

  if (index >= 0) {
    result.splice(index, 1)
  } else {
    result.push(value)
  }

  return result
}

export function compareUndefined<T>(compareFn: (a: T, b: T) => number) {
  return (a: T | undefined, b: T | undefined): number =>
    a !== undefined && b !== undefined ? compareFn(a, b) : 0
}

export function assertNever(x: never): never {
  throw new Error('Unexpected object: ' + x)
}

export const extractOptionsFromState = (
  state: StateGeneric<any, any>,
): Options => ({
  locale: state.locale,
  disabledDates: state.disabledDates,
  weekStartsOn: state.weekStartsOn,
  minDate: state.minDate,
  maxDate: state.maxDate,
})

export function selectDateSingle(selected: Date | null, date: Date) {
  return selected !== null && isSameDay(selected, date) ? null : date
}

export function selectDateMulti(selected: Date[] | null, date: Date) {
  return selected !== null
    ? sort(compareAsc, toggleValue(isSameDay, selected, date))
    : [date]
}

export function selectDateRange(
  selected: [Date, Date?] | null,
  date: Date,
): [Date, Date?] {
  return (selected === null ||
  isSameDay(selected[0], date) ||
  selected.length === 2
    ? [date]
    : sort(compareAsc, [...selected, date] as Date[])) as [Date, Date?]
}

export const emptyFn = <T>(e: T) => (): T => e

export const dateIsSelectable = (options: Options, date: Date) =>
  !(
    (!!options.disabledDates &&
      arrayIncludes(isSameDay, options.disabledDates, date)) ||
    (!!options.minDate && isAfter(options.minDate, date)) ||
    (!!options.maxDate && isBefore(options.maxDate, date))
  )
