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

export type Action =
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
