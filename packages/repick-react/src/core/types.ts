import {
  RepickContext,
  RepickDay,
  RepickOptions,
  RepickState,
  RepickStateReducer,
} from 'repick-core'

export type RepickProps<Selected> = {
  autoFocus?: boolean
  highlighted?: Date
  initialHighlighted?: Date
  initialIsOpen?: boolean
  initialSelected?: Selected
  isOpen?: boolean
  onChange?: (date: Selected | null) => void
  onUpdate?: (date: Date) => void
  selected?: Selected | null
  stateReducer?: RepickStateReducer<RepickState<Selected>>
} & RepickOptions

export type InputProps = {
  id: string
  onBlur: (e: React.FocusEvent) => void
  onFocus: (e: React.FocusEvent) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  readOnly: true
  ref: (el: HTMLElement | null) => void
  type: string
  value: string
}

export type ToggleButtonProps = {
  'aria-label': string
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  ref: (el: HTMLElement | null) => void
}

export type LabelProps = {
  htmlFor: string
}

export type DialogProps = {
  'aria-labelledby': string
  'aria-modal': true
  onBlur: (e: React.FocusEvent) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  ref: (el: HTMLElement | null) => void
  role: 'dialog'
  tabIndex: number
}

export type HeaderProps = {
  'aria-live': 'polite'
  id: string
}

export type MonthProps = {
  'aria-label': string
  onClick: (e: React.MouseEvent) => void
  role: string
}

export type CalendarProps = {
  'aria-labelledby': string
  role: 'grid'
  onKeyDown: (e: React.KeyboardEvent) => void
}

export type DateProps = {
  'aria-label': string
  'aria-pressed': boolean
  'aria-selected': boolean
  onClick: (e: React.MouseEvent) => void
  ref: (el: HTMLElement | null) => void
  role: string
  tabIndex: number
}

export type RepickHelpers<DayContext extends RepickDay<any>> = {
  closeCalendar: () => void
  endOfWeek: () => void
  getCalendarProps: (index?: number) => CalendarProps
  getDateProps: (repickDay: DayContext) => DateProps
  getDialogProps: () => DialogProps
  getCalendarHeaderProps: (index?: number) => HeaderProps
  getInputProps: () => InputProps
  getLabelProps: () => LabelProps
  getNextMonthProps: () => MonthProps
  getPrevMonthProps: () => MonthProps
  getToggleButtonProps: () => ToggleButtonProps
  handleKeyDown: (e: React.KeyboardEvent) => void
  nextDay: () => void
  nextMonth: () => void
  nextWeek: () => void
  nextYear: () => void
  openCalendar: () => void
  prevDay: () => void
  prevMonth: () => void
  prevWeek: () => void
  prevYear: () => void
  selectCurrent: () => void
  selectDate: (date: string | number | Date) => void
  setFocusToCalendar: () => void
  setFocusToDate: (date: Date) => void
  startOfWeek: () => void
}

export type RepickReturnValue<
  Selected,
  DayContext extends RepickDay<any>
> = RepickHelpers<DayContext> & RepickContext<Selected, DayContext>
