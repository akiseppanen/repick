import { Locale } from 'date-fns'

export type Weekday = {
  long: string
  short: string
}

export type RepickOptions<Selected> = Partial<{
  allowInput: boolean
  format: string
  formatter: (selected: Selected | null, format: string) => string
  parser: (dateString: string, format: string) => Selected | false
  monthCount: number
  locale: Locale
  disabledDates: Date[]
  enabledDates: Date[]
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6
  minDate: Date
  maxDate: Date
  filterDates: (date: Date) => boolean
  updateHighlightedOnHover: boolean
}>

export type RepickState<Selected extends Date | Date[]> = {
  activeMonth: Date
  highlighted: Date
  inputValue: string
  isOpen: boolean
  selected: Selected | null
}

export type RepickStateSelected<
  State extends RepickState<any>
> = State extends RepickState<infer Selected> ? Selected : never

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
  activeMonth: Date
  isOpen: boolean
  inputValue: string
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
