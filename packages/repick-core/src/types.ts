import { Locale } from 'date-fns'

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

export interface Calendar<Selected> {
  date: Date
  selected: Selected | null
  month: number
  monthLong: string
  monthShort: string
  year: number
  weekdays: Weekday[]
  days: CalendarDay[]
}

export interface Options {
  locale?: Locale
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
}

export type Mode = 'single' | 'multi' | 'range'

export interface ModeType {
  single: Date
  multi: Date[]
  range: [Date, Date?]
}

export interface StateGeneric<M extends Mode, T extends ModeType[M]>
  extends Options {
  mode: M
  current: Date
  selected: T | null
}

export type StateSingle = StateGeneric<'single', Date>
export type StateMulti = StateGeneric<'multi', Date[]>
export type StateRange = StateGeneric<'range', [Date, Date?]>

export type State = StateSingle | StateMulti | StateRange

export type StateType<
  S extends StateGeneric<any, any>
> = S extends StateGeneric<any, infer T> ? T : never
