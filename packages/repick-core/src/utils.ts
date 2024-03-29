import addDays from 'date-fns/addDays'
import differenceInDays from 'date-fns/differenceInDays'
import format from 'date-fns/format'
import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import isSameDay from 'date-fns/isSameDay'
import setDay from 'date-fns/setDay'
import startOfMonth from 'date-fns/startOfMonth'
import startOfWeek from 'date-fns/startOfWeek'

import { RepickOptions, Weekday } from './core/types'
import {
  RepickAction,
  actionKeyArrowLeft,
  actionKeyArrowRight,
  actionKeyArrowUp,
  actionKeyArrowDown,
  actionKeyPageDown,
  actionKeyPageUp,
  actionKeyHome,
  actionKeyEnd,
  actionKeyEnter,
} from './actions'

export const defaultOptions: Required<
  Pick<
    RepickOptions<Date | Date[]>,
    | 'allowInput'
    | 'format'
    | 'monthCount'
    | 'weekStartsOn'
    | 'updateHighlightedOnHover'
  >
> = {
  allowInput: false,
  format: 'yyyy-MM-dd',
  monthCount: 1,
  weekStartsOn: 0,
  updateHighlightedOnHover: true,
}

export const arrayGenerate = <A>(
  arrayLength: number,
  fn: (i: number) => A,
): A[] => Array.apply(null, Array(arrayLength)).map((_, i) => fn(i))

export const wrap = (min: number, max: number) => (x: number) => {
  const d = max - min
  return ((((x - min) % d) + d) % d) + min
}

export const wrapWeekDay = wrap(0, 7)

export function keyToAction(key: string): RepickAction | null {
  switch (key) {
    case 'ArrowLeft': {
      return { type: actionKeyArrowLeft }
    }
    case 'ArrowRight': {
      return { type: actionKeyArrowRight }
    }
    case 'ArrowUp': {
      return { type: actionKeyArrowUp }
    }
    case 'ArrowDown': {
      return { type: actionKeyArrowDown }
    }
    case 'PageDown': {
      return { type: actionKeyPageDown }
    }
    case 'PageUp': {
      return { type: actionKeyPageUp }
    }
    case 'Home': {
      return { type: actionKeyHome }
    }
    case 'End': {
      return { type: actionKeyEnd }
    }
    case 'Enter': {
      return { type: actionKeyEnter }
    }
  }

  return null
}

export function buildWeekdays(options: RepickOptions<any> = {}): Weekday[] {
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

export function assertNever(x: never, message: string): never {
  throw new Error(`[repick-core] ${message}: ${JSON.stringify(x)}`)
}

export const emptyFn =
  <T>(e: T) =>
  (): T =>
    e

export const dateIsSelectable = (
  {
    enabledDates,
    disabledDates,
    minDate,
    filterDates,
    maxDate,
  }: RepickOptions<any>,
  date: Date,
) =>
  !(
    (!!filterDates && typeof filterDates === 'function' && filterDates(date)) ||
    (!!enabledDates && !arrayIncludes(isSameDay, enabledDates, date)) ||
    (!!disabledDates && arrayIncludes(isSameDay, disabledDates, date)) ||
    (!!minDate && isAfter(minDate, date)) ||
    (!!maxDate && isBefore(maxDate, date))
  )

export const objectCopyPartial = <O extends Object>(
  keys: (keyof O)[],
  obj: O,
): Partial<O> => {
  return keys.reduce<Partial<O>>((res, key) => {
    if (obj[key] !== undefined) {
      res[key] = obj[key]
    }
    return res
  }, {})
}

export const getHighlightedDate = (
  activeDate: Date,
  highlightedIndex: number,
  { weekStartsOn }: Pick<RepickOptions<any>, 'weekStartsOn'>,
) => {
  const firstDayOfMonth = startOfMonth(activeDate)
  const firstWeekOfMonth = startOfWeek(firstDayOfMonth, {
    weekStartsOn: weekStartsOn || defaultOptions.weekStartsOn,
  })

  return addDays(firstWeekOfMonth, highlightedIndex)
}

export const getHighlightedIndexForDate = (
  activeMonth: Date,
  highlightedDate: Date,
  { weekStartsOn }: Pick<RepickOptions<any>, 'weekStartsOn'>,
) => {
  const firstDayOfMonth = startOfMonth(activeMonth)
  const firstWeekOfMonth = startOfWeek(firstDayOfMonth, {
    weekStartsOn: weekStartsOn || defaultOptions.weekStartsOn,
  })

  return differenceInDays(highlightedDate, firstWeekOfMonth)
}
