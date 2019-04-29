import * as addDays from 'date-fns/add_days'
import * as addMonths from 'date-fns/add_months'
import * as startOfWeek from 'date-fns/start_of_week'
import * as subDays from 'date-fns/sub_days'
import * as subMonths from 'date-fns/sub_months'

import { defaultOptions, Options } from './options'

export interface ActionSelectDate {
  type: 'SelectDate'
  date: string | number | Date
}
export interface ActionSelectCurrent {
  type: 'SelectCurrent'
}
export interface ActionPrevDay {
  type: 'PrevDay'
}
export interface ActionNextDay {
  type: 'NextDay'
}
export interface ActionPrevWeek {
  type: 'PrevWeek'
}
export interface ActionNextWeek {
  type: 'NextWeek'
}
export interface ActionPrevMonth {
  type: 'PrevMonth'
}
export interface ActionNextMonth {
  type: 'NextMonth'
}
export interface ActionStartOfWeek {
  type: 'StartOfWeek'
}
export interface ActionEndOfWeek {
  type: 'EndOfWeek'
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

export interface State {
  date: Date
  selected: Date | null
}

export function reducer(
  state: State,
  action: Action,
  options?: Options,
): State {
  options = { ...defaultOptions, ...options }

  switch (action.type) {
    case 'SelectDate': {
      const d =
        action.date instanceof Date ? action.date : new Date(action.date)

      return {
        ...state,
        date: d,
        selected: d,
      }
    }
    case 'SelectCurrent': {
      return state.date
        ? {
            ...state,
            selected: state.date,
          }
        : state
    }
    case 'PrevDay': {
      return {
        ...state,
        date: subDays(state.date, 1),
      }
    }
    case 'NextDay': {
      return {
        ...state,
        date: addDays(state.date, 1),
      }
    }
    case 'PrevWeek': {
      return {
        ...state,
        date: subDays(state.date, 7),
      }
    }
    case 'NextWeek': {
      return {
        ...state,
        date: addDays(state.date, 7),
      }
    }
    case 'PrevMonth': {
      return {
        ...state,
        date: subMonths(state.date, 1),
      }
    }
    case 'NextMonth': {
      return {
        ...state,
        date: addMonths(state.date, 1),
      }
    }
    case 'StartOfWeek': {
      return {
        ...state,
        date: startOfWeek(state.date, {
          weekStartsOn: options.weekStartsOn,
        }),
      }
    }
    case 'EndOfWeek': {
      return {
        ...state,
        date: addDays(
          startOfWeek(state.date, {
            weekStartsOn: options.weekStartsOn,
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
