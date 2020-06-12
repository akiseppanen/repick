import {
  RepickContext,
  RepickDay,
  RepickOptions,
  RepickState,
  RepickStateReducer,
} from 'repick-core'

export type RepickProps<Selected> = {
  autoFocus?: boolean
  onChange?: (date: Selected | null) => void
  onUpdate?: (date: Date) => void
  highlighted?: Date
  initialHighlighted?: Date
  isOpen?: boolean
  initialIsOpen?: boolean
  selected?: Selected | null
  initialSelected?: Selected
  stateReducer?: RepickStateReducer<RepickState<Selected>>
} & RepickOptions

export type InputProps = {
  onBlur: (e: React.FocusEvent) => void
  onFocus: (e: React.FocusEvent) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  readOnly: true
  ref: (el: HTMLElement | null) => void
  type: string
  value: string
}

export type ToggleButtonProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  ref: (el: HTMLElement | null) => void
}

export type CalendarProps = {
  onKeyDown: (e: React.KeyboardEvent) => void
  tabIndex: number
  ref: (el: HTMLElement | null) => void
  onBlur: (e: React.FocusEvent) => void
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
  openCalendar: () => void
  closeCalendar: () => void
  prevDay: () => void
  nextDay: () => void
  prevWeek: () => void
  nextWeek: () => void
  prevMonth: () => void
  nextMonth: () => void
  prevYear: () => void
  nextYear: () => void
  startOfWeek: () => void
  endOfWeek: () => void
  getCalendarProps: () => CalendarProps
  getInputProps: () => InputProps
  getToggleButtonProps: () => ToggleButtonProps
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
