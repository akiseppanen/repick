import { Locale } from 'date-fns'

export type Weekday = {
  long: string
  short: string
}

export type RepickDayContext<E extends {}> = {
  date: Date
  day: number
  nextMonth: boolean
  prevMonth: boolean
  selected: boolean
  current: boolean
  today: boolean
  disabled: boolean
} & E

export type RepickDayContextSingle = RepickDayContext<{}>
export type RepickDayContextMulti = RepickDayContext<{}>
export type RepickDayContextRange = RepickDayContext<{
  rangeStart: boolean
  rangeEnd: boolean
}>

export type RepickWeekContext<D extends RepickDayContext<{}>> = {
  weekNumber: number
  year: number
  days: D[]
}

export type RepickMonthContext<D extends RepickDayContext<{}>> = {
  month: number
  monthLong: string
  monthShort: string
  year: number
  weeks: RepickWeekContext<D>[]
}

export type RepickCalendarContextGeneric<
  M,
  T,
  D extends RepickDayContext<{}>
> = {
  mode: M
  selected: T
  date: Date
  month: number
  monthLong: string
  monthShort: string
  year: number
  weekdays: Weekday[]
  calendar: RepickMonthContext<D>[]
}

export type RepickCalendarContextSingle = RepickCalendarContextGeneric<
  'single',
  Date,
  RepickDayContextSingle
>

export type RepickCalendarContextMulti = RepickCalendarContextGeneric<
  'multi',
  Date[],
  RepickDayContextMulti
>

export type RepickCalendarContextRange = RepickCalendarContextGeneric<
  'range',
  [Date, Date?],
  RepickDayContextRange
>

export type RepickCalendarContext =
  | RepickCalendarContextSingle
  | RepickCalendarContextMulti
  | RepickCalendarContextRange

export type RepickOptions = Partial<{
  monthCount: number
  locale: Locale
  disabledDates: Date[]
  enabledDates: Date[]
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6
  minDate: Date
  maxDate: Date
  filterDates: (date: Date) => boolean
}>

export type RepickMode = 'single' | 'multi' | 'range'

export interface RepickModeType {
  single: Date
  multi: Date[]
  range: [Date, Date?]
}

export interface RepickStateGeneric<
  M extends RepickMode,
  T extends RepickModeType[M]
> extends RepickOptions {
  mode: M
  current: Date
  selected: T | null
}

export type RepickStateSingle = RepickStateGeneric<'single', Date>
export type RepickStateMulti = RepickStateGeneric<'multi', Date[]>
export type RepickStateRange = RepickStateGeneric<'range', [Date, Date?]>

export type RepickState =
  | RepickStateSingle
  | RepickStateMulti
  | RepickStateRange

export type RepickStateType<
  S extends RepickStateGeneric<any, any>
> = S extends RepickStateGeneric<any, infer T> ? T : never
