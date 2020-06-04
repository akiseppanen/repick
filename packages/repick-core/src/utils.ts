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
  actionSelectHighlighted,
  actionStartOfWeek,
} from './actions'
import {
  RepickOptions,
  Weekday,
  RepickDayContext,
  RepickMonthContext,
  RepickWeekContext,
} from './types'

export const arrayGenerate = <A>(
  arrayLength: number,
  fn: (i: number) => A,
): A[] => Array.apply(null, Array(arrayLength)).map((_, i) => fn(i))

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
      return { type: actionSelectHighlighted }
    }
  }

  return null
}

export function buildWeekdays(options: RepickOptions = {}): Weekday[] {
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

export const dateIsSelectable = (
  { enabledDates, disabledDates, minDate, filterDates, maxDate }: RepickOptions,
  date: Date,
) =>
  !(
    (!!filterDates && typeof filterDates === 'function' && filterDates(date)) ||
    (!!enabledDates && !arrayIncludes(isSameDay, enabledDates, date)) ||
    (!!disabledDates && arrayIncludes(isSameDay, disabledDates, date)) ||
    (!!minDate && isAfter(minDate, date)) ||
    (!!maxDate && isBefore(maxDate, date))
  )

function isRepickMonthContext(
  monthOrWeek: RepickMonthContext<any> | RepickWeekContext<any>,
): monthOrWeek is RepickMonthContext<any> {
  return monthOrWeek.hasOwnProperty('weeks')
}

export function mapDays<D extends RepickDayContext<{}>, R>(
  months: RepickMonthContext<D>[],
  callbackfn: (day: D) => R,
): R[]
export function mapDays<D extends RepickDayContext<{}>, R>(
  weeks: RepickWeekContext<D>[],
  callbackfn: (day: D) => R,
): R[]
export function mapDays<D extends RepickDayContext<{}>, R>(
  monthsOrWeeks: (RepickMonthContext<D> | RepickWeekContext<D>)[],
  callbackfn: (day: D) => R,
): R[] {
  return monthsOrWeeks.reduce<R[]>((x, monthOrWeek) => {
    if (isRepickMonthContext(monthOrWeek)) {
      return [...x, ...mapDays(monthOrWeek.weeks, callbackfn)]
    }

    return [...x, ...monthOrWeek.days.map(callbackfn)]
  }, [])
}

export function mapWeeks<D extends RepickDayContext<{}>, R>(
  months: RepickMonthContext<D>[],
  callbackfn: (day: RepickWeekContext<D>) => R,
): R[] {
  return months.reduce<R[]>(
    (x, month) => [...x, ...month.weeks.map(callbackfn)],
    [],
  )
}
