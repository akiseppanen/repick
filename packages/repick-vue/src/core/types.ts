import {
  RepickAction,
  RepickContext,
  RepickDay,
  RepickOptions,
  RepickState,
} from '@repick/core'
export type RepickStateChangeOptions<Selected extends Date | Date[]> = {
  action: RepickAction
  changes: Partial<RepickState<Selected>>
  options: RepickOptions<Selected>
}

export type RepickStateReducer<Selected extends Date | Date[]> = (
  state: RepickState<Selected>,
  actionAndChanges: RepickStateChangeOptions<Selected>,
) => RepickState<Selected>

export type RepickProps<Selected extends Date | Date[]> = {
  id?: string
  stateReducer?: RepickStateReducer<Selected>

  // Control Props
  activeDate?: Date
  highlightedDate?: Date
  highlightedIndex?: number
  selected?: Selected | null
  inputValue?: string
  isOpen?: boolean

  // Initial Values
  initialActiveDate?: Date | null
  initialHighlightedIndex?: number
  initialSelected?: Selected | null
  initialInputValue?: string
  initialIsOpen?: boolean

  // On Change Handlers
  onActiveDateChange?: (activeDate: Date) => void
  onHighlightedIndexChange?: (highlightedIndex: number) => void
  onSelectedChange?: (selected?: Selected | null) => void
  onInputValueChange?: (inputValue: string) => void
  onIsOpenChange?: (isOpen: boolean) => void
  onStateChange?: (actionAndChanges: {
    action: RepickAction
    changes: Partial<RepickState<Selected>>
  }) => void
} & RepickOptions<Selected>

export type InputProps = {
  id: string
  onBlur: (e: FocusEvent) => void
  onChange: (e: Event) => void
  onFocus: (e: FocusEvent) => void
  onKeydown: (e: KeyboardEvent) => void
  readOnly: boolean
  ref: (ref: object | null) => void
  type: string
  value: string
}

export type ToggleButtonProps = {
  'aria-label': string
  onClick: (e: MouseEvent) => void
  ref: (ref: object | null) => void
}

export type LabelProps = {
  for: string
}

export type DialogProps = {
  'aria-labelledby': string
  'aria-modal': true
  onFocusout: (e: FocusEvent) => void
  onKeydown: (e: KeyboardEvent) => void
  ref: (ref: object | null) => void
  role: 'dialog'
  tabIndex: number
}

export type HeaderProps = {
  'aria-live': 'polite'
  id: string
}

export type MonthProps = {
  'aria-label': string
  onClick: (e: MouseEvent) => void
  role: string
}

export type CalendarProps = {
  'aria-labelledby': string
  onKeydown: (e: KeyboardEvent) => void
  role: 'grid'
}

export type DateProps = {
  'aria-label': string
  'aria-pressed': boolean
  'aria-selected': boolean
  onClick: (e: MouseEvent) => void
  onMouseover: (e: MouseEvent) => void
  ref: (ref: object | null) => void
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
  handleKeyDown: (e: KeyboardEvent) => void
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
  startOfWeek: () => void
}

export type RepickReturnValue<
  Selected,
  DayContext extends RepickDay<any>,
> = RepickHelpers<DayContext> & RepickContext<Selected, DayContext>
