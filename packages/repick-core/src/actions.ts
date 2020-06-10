export const actionDateClick = 'DateClick'
export const actionSelectDate = 'SelectDate'
export const actionSelectHighlighted = 'SelectHighlighted'
export const actionPrevDay = 'PrevDay'
export const actionNextDay = 'NextDay'
export const actionPrevWeek = 'PrevWeek'
export const actionNextWeek = 'NextWeek'
export const actionPrevMonth = 'PrevMonth'
export const actionNextMonth = 'NextMonth'
export const actionStartOfWeek = 'StartOfWeek'
export const actionEndOfWeek = 'EndOfWeek'

export const actionKeyArrowLeft = 'KeyArrowLeft'
export const actionKeyArrowRight = 'KeyArrowRight'
export const actionKeyArrowUp = 'KeyArrowUp'
export const actionKeyArrowDown = 'KeyArrowDown'
export const actionKeyPageDown = 'KeyPageDown'
export const actionKeyPageUp = 'KeyPageUp'
export const actionKeyHome = 'KeyHome'
export const actionKeyEnd = 'KeyEnd'
export const actionKeyEnter = 'KeyEnter'

export interface ActionKeyArrowLeft {
  type: typeof actionKeyArrowLeft
}

export interface ActionKeyArrowRight {
  type: typeof actionKeyArrowRight
}

export interface ActionKeyArrowUp {
  type: typeof actionKeyArrowUp
}

export interface ActionKeyArrowDown {
  type: typeof actionKeyArrowDown
}

export interface ActionKeyPageDown {
  type: typeof actionKeyPageDown
}

export interface ActionKeyPageUp {
  type: typeof actionKeyPageUp
}

export interface ActionKeyHome {
  type: typeof actionKeyHome
}

export interface ActionKeyEnd {
  type: typeof actionKeyEnd
}

export interface ActionKeyEnter {
  type: typeof actionKeyEnter
}

export interface ActionDateClick {
  type: typeof actionDateClick
  date: Date
}

export interface ActionSelectDate {
  type: typeof actionSelectDate
  date: string | number | Date
}
export interface ActionSelectHighlighted {
  type: typeof actionSelectHighlighted
}
export interface ActionPrevDay {
  type: typeof actionPrevDay
}
export interface ActionNextDay {
  type: typeof actionNextDay
}
export interface ActionPrevWeek {
  type: typeof actionPrevWeek
}
export interface ActionNextWeek {
  type: typeof actionNextWeek
}
export interface ActionPrevMonth {
  type: typeof actionPrevMonth
}
export interface ActionNextMonth {
  type: typeof actionNextMonth
}
export interface ActionStartOfWeek {
  type: typeof actionStartOfWeek
}
export interface ActionEndOfWeek {
  type: typeof actionEndOfWeek
}

export type RepickAction =
  | ActionKeyArrowLeft
  | ActionKeyArrowRight
  | ActionKeyArrowUp
  | ActionKeyArrowDown
  | ActionKeyPageDown
  | ActionKeyPageUp
  | ActionKeyHome
  | ActionKeyEnd
  | ActionKeyEnter
  | ActionDateClick
  | ActionSelectDate
  | ActionSelectHighlighted
  | ActionPrevDay
  | ActionNextDay
  | ActionPrevWeek
  | ActionNextWeek
  | ActionPrevMonth
  | ActionNextMonth
  | ActionStartOfWeek
  | ActionEndOfWeek
