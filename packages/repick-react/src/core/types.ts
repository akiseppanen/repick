import { RepickOptions, RepickContext, RepickDay } from 'repick-core'

export type RepickProps<Selected> = {
  autoFocus?: boolean
  onChange?: (date: Selected | null) => void
  onUpdate?: (date: Date) => void
  highlighted?: Date
  initialHighlighted?: Date
  selected?: Selected | null
  initialSelected?: Selected
} & RepickOptions

export type CalendarProps = {
  onKeyDown: (e: React.KeyboardEvent) => void
  tabIndex: number
  ref: (el: HTMLElement | null) => void
}

export type MonthProps = {
  onClick: (e: React.MouseEvent) => void
  'aria-label': string
  role: string
}

export type DateProps = {
  onClick: (e: React.MouseEvent) => void
  'aria-label': string
  'aria-pressed': boolean
  role: string
  tabIndex: number
  ref: (el: HTMLElement | null) => void
}

export type RepickHelpers<DayContext extends RepickDay<any>> = {
  selectDate: (date: string | number | Date) => void
  selectCurrent: () => void
  prevDay: () => void
  nextDay: () => void
  prevWeek: () => void
  nextWeek: () => void
  prevMonth: () => void
  nextMonth: () => void
  startOfWeek: () => void
  endOfWeek: () => void
  getCalendarProps: () => CalendarProps
  getDateProps: (repickDayContext: DayContext) => DateProps
  getNextMonthProps: () => MonthProps
  getPrevMonthProps: () => MonthProps
  handleKeyDown: (e: React.KeyboardEvent) => void
  setFocusToCalendar: () => void
  setFocusToDate: (date: Date) => void
}

export type RepickReturnValue<
  Selected,
  DayContext extends RepickDay<any>
> = RepickHelpers<any> & RepickContext<Selected, DayContext>
