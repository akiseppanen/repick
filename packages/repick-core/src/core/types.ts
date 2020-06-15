import { Locale } from 'date-fns'

export type Weekday = {
  long: string
  short: string
}

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

export type RepickState<Selected> = {
  highlighted: Date
  selected: Selected | null
} & RepickOptions

export type RepickDay<Extra extends { [key: string]: any } = {}> = {
  date: Date
  day: number
  nextMonth: boolean
  prevMonth: boolean
  selected: boolean
  highlighted: boolean
  today: boolean
  disabled: boolean
} & Extra

export type RepickWeek<Day extends RepickDay<any>> = {
  weekNumber: number
  year: number
  days: Day[]
}

export type RepickMonth<Day extends RepickDay<any>> = {
  month: number
  monthLong: string
  monthShort: string
  year: number
  weeks: RepickWeek<Day>[]
  days: Day[]
}

export type RepickCalendar<Day extends RepickDay<any>> = RepickMonth<Day>[]

export type RepickContext<Selected, Day extends RepickDay<any>> = {
  selected: Selected
  highlighted: Date
  month: number
  monthLong: string
  monthShort: string
  year: number
  weekdays: Weekday[]
  months: RepickMonth<Day>[]
  weeks: RepickWeek<Day>[]
  days: Day[]
}
