import { Locale } from 'date-fns'

export type CalendarContextDayCommon = {
  date: Date
  day: number
  nextMonth: boolean
  prevMonth: boolean
  selected: boolean
  current: boolean
  today: boolean
  disabled: boolean
}

export type CalendarContextDaySingle = CalendarContextDayCommon
export type CalendarContextDayMulti = CalendarContextDayCommon
export type CalendarContextDayRange = CalendarContextDayCommon & {
  rangeStart: boolean
  rangeEnd: boolean
}

export type CalendarContextDay =
  | CalendarContextDaySingle
  | CalendarContextDayMulti
  | CalendarContextDayRange

export type Weekday = {
  long: string
  short: string
}

export type CalendarContextCommon = {
  date: Date
  month: number
  monthLong: string
  monthShort: string
  year: number
  weekdays: Weekday[]
}

export type CalendarContextSingle = CalendarContextCommon & {
  selected: Date
  days: CalendarContextDaySingle[]
}

export type CalendarContextMulti = CalendarContextCommon & {
  selected: Date[]
  days: CalendarContextDayMulti[]
}

export type CalendarContextRange = CalendarContextCommon & {
  selected: [Date, Date?]
  days: CalendarContextDayRange[]
}

export type CalendarContext =
  | CalendarContextSingle
  | CalendarContextMulti
  | CalendarContextRange

export type Options = {
  locale?: Locale
  disabledDates?: Date[]
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
