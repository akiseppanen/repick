export const actionBlur = 'Blur'
export const actionCloseCalendar = 'CloseCalendar'
export const actionDateClick = 'DateClick'
export const actionEndOfWeek = 'EndOfWeek'
export const actionInputBlur = 'InputBlur'
export const actionInputChange = 'InputChange'
export const actionInputFocus = 'InputFocus'
export const actionInputKeyArrowDown = 'InputKeyArrowDown'
export const actionInputKeyEnter = 'InputKeyEnter'
export const actionKeyArrowDown = 'KeyArrowDown'
export const actionKeyArrowLeft = 'KeyArrowLeft'
export const actionKeyArrowRight = 'KeyArrowRight'
export const actionKeyArrowUp = 'KeyArrowUp'
export const actionKeyEnd = 'KeyEnd'
export const actionKeyEnter = 'KeyEnter'
export const actionKeyEscape = 'KeyEscape'
export const actionKeyHome = 'KeyHome'
export const actionKeyPageDown = 'KeyPageDown'
export const actionKeyPageUp = 'KeyPageUp'
export const actionKeyShiftPageDown = 'KeyShiftPageDown'
export const actionKeyShiftPageUp = 'KeyShiftPageUp'
export const actionNextDay = 'NextDay'
export const actionNextMonth = 'NextMonth'
export const actionNextWeek = 'NextWeek'
export const actionNextYear = 'NextYear'
export const actionOpenCalendar = 'OpenCalendar'
export const actionPrevDay = 'PrevDay'
export const actionPrevMonth = 'PrevMonth'
export const actionPrevWeek = 'PrevWeek'
export const actionPrevYear = 'PrevYear'
export const actionSelectDate = 'SelectDate'
export const actionSelectHighlighted = 'SelectHighlighted'
export const actionStartOfWeek = 'StartOfWeek'

export interface ActionBlur {
  type: typeof actionBlur
}

export interface ActionCloseCalendar {
  type: typeof actionCloseCalendar
}

export interface ActionDateClick {
  type: typeof actionDateClick
  date: Date
}

export interface ActionInputBlur {
  type: typeof actionInputBlur
}

export interface ActionInputChange {
  type: typeof actionInputChange
  value: string
}

export interface ActionInputFocus {
  type: typeof actionInputFocus
}

export interface ActionInputKeyArrowDown {
  type: typeof actionInputKeyArrowDown
}
export interface ActionInputKeyEnter {
  type: typeof actionInputKeyEnter
}

export interface ActionEndOfWeek {
  type: typeof actionEndOfWeek
}

export interface ActionKeyArrowDown {
  type: typeof actionKeyArrowDown
}

export interface ActionKeyArrowLeft {
  type: typeof actionKeyArrowLeft
}

export interface ActionKeyArrowRight {
  type: typeof actionKeyArrowRight
}

export interface ActionKeyArrowUp {
  type: typeof actionKeyArrowUp
}

export interface ActionKeyEnd {
  type: typeof actionKeyEnd
}

export interface ActionKeyEnter {
  type: typeof actionKeyEnter
}

export interface ActionKeyEscape {
  type: typeof actionKeyEscape
}

export interface ActionKeyHome {
  type: typeof actionKeyHome
}

export interface ActionKeyPageDown {
  type: typeof actionKeyPageDown
}

export interface ActionKeyPageUp {
  type: typeof actionKeyPageUp
}

export interface ActionKeyShiftPageDown {
  type: typeof actionKeyShiftPageDown
}

export interface ActionKeyShiftPageUp {
  type: typeof actionKeyShiftPageUp
}

export interface ActionNextDay {
  type: typeof actionNextDay
}

export interface ActionNextMonth {
  type: typeof actionNextMonth
}

export interface ActionNextWeek {
  type: typeof actionNextWeek
}

export interface ActionNextYear {
  type: typeof actionNextYear
}

export interface ActionOpenCalendar {
  type: typeof actionOpenCalendar
}

export interface ActionPrevDay {
  type: typeof actionPrevDay
}

export interface ActionPrevMonth {
  type: typeof actionPrevMonth
}

export interface ActionPrevWeek {
  type: typeof actionPrevWeek
}

export interface ActionPrevYear {
  type: typeof actionPrevYear
}

export interface ActionSelectDate {
  type: typeof actionSelectDate
  date: string | number | Date
}

export interface ActionSelectHighlighted {
  type: typeof actionSelectHighlighted
}

export interface ActionStartOfWeek {
  type: typeof actionStartOfWeek
}

export type RepickAction =
  | ActionBlur
  | ActionCloseCalendar
  | ActionDateClick
  | ActionEndOfWeek
  | ActionInputBlur
  | ActionInputChange
  | ActionInputFocus
  | ActionInputKeyArrowDown
  | ActionInputKeyEnter
  | ActionKeyArrowDown
  | ActionKeyArrowLeft
  | ActionKeyArrowRight
  | ActionKeyArrowUp
  | ActionKeyEnd
  | ActionKeyEnter
  | ActionKeyEscape
  | ActionKeyHome
  | ActionKeyPageDown
  | ActionKeyPageUp
  | ActionKeyShiftPageDown
  | ActionKeyShiftPageUp
  | ActionNextDay
  | ActionNextMonth
  | ActionNextWeek
  | ActionNextYear
  | ActionOpenCalendar
  | ActionPrevDay
  | ActionPrevMonth
  | ActionPrevWeek
  | ActionPrevYear
  | ActionSelectDate
  | ActionSelectHighlighted
  | ActionStartOfWeek
