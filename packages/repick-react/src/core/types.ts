import {
  RepickContext,
  RepickDay,
  RepickOptions,
  RepickState,
  RepickAction,
} from '@repick/core'
import React from 'react'

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
  autoFocus?: boolean
  id?: string
  stateReducer?: RepickStateReducer<Selected>

  // Control Props
  activeMonth?: Date | null
  highlighted?: Date
  selected?: Selected | null
  inputValue?: string
  isOpen?: boolean

  // Initial Values
  initialActiveMonth?: Date | null
  initialHighlighted?: Date
  initialSelected?: Selected | null
  initialInputValue?: string
  initialIsOpen?: boolean

  // On Change Handlers
  onActiveMonthChange?: (activeMonth: Date) => void
  onHighlightedChange?: (highlighted: Date) => void
  onSelectedChange?: (selected?: Selected | null) => void
  onInputValueChange?: (inputValue: string) => void
  onIsOpenChange?: (isOpen: boolean) => void
} & RepickOptions<Selected>

export type InputProps = {
  id: string
  onBlur: (e: React.FocusEvent) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFocus: (e: React.FocusEvent) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  readOnly: boolean
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
  onKeyDown: (e: React.KeyboardEvent) => void
  role: 'grid'
}

export type DateProps = {
  'aria-label': string
  'aria-pressed': boolean
  'aria-selected': boolean
  onClick: (e: React.MouseEvent) => void
  onMouseOver: (e: React.MouseEvent) => void
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
