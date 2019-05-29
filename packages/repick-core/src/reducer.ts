import * as addDays from 'date-fns/add_days'
import * as addMonths from 'date-fns/add_months'
import * as startOfWeek from 'date-fns/start_of_week'
import * as subDays from 'date-fns/sub_days'
import * as subMonths from 'date-fns/sub_months'
import { Options } from './options'

export const actionSelectDate = 'SelectDate'
export const actionSelectCurrent = 'SelectCurrent'
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
export interface ActionSelectCurrent {
  type: typeof actionSelectCurrent
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
  | ActionSelectCurrent
  | ActionPrevDay
  | ActionNextDay
  | ActionPrevWeek
  | ActionNextWeek
  | ActionPrevMonth
  | ActionNextMonth
  | ActionStartOfWeek
  | ActionEndOfWeek

export interface State extends Options {
  date: Date
  selected: Date | null
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case actionSelectDate: {
      const d =
        action.date instanceof Date ? action.date : new Date(action.date)

      return {
        ...state,
        date: d,
        selected: d,
      }
    }
    case actionSelectCurrent: {
      return state.date
        ? {
            ...state,
            selected: state.date,
          }
        : state
    }
    case actionPrevDay: {
      return {
        ...state,
        date: subDays(state.date, 1),
      }
    }
    case actionNextDay: {
      return {
        ...state,
        date: addDays(state.date, 1),
      }
    }
    case actionPrevWeek: {
      return {
        ...state,
        date: subDays(state.date, 7),
      }
    }
    case actionNextWeek: {
      return {
        ...state,
        date: addDays(state.date, 7),
      }
    }
    case actionPrevMonth: {
      return {
        ...state,
        date: subMonths(state.date, 1),
      }
    }
    case actionNextMonth: {
      return {
        ...state,
        date: addMonths(state.date, 1),
      }
    }
    case actionStartOfWeek: {
      return {
        ...state,
        date: startOfWeek(state.date, {
          weekStartsOn: state.weekStartsOn,
        }),
      }
    }
    case actionEndOfWeek: {
      return {
        ...state,
        date: addDays(
          startOfWeek(state.date, {
            weekStartsOn: state.weekStartsOn,
          }),
          6,
        ),
      }
    }

    default: {
      const _: never = action
      return state
    }
  }
}
