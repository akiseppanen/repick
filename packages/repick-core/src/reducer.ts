import addDays from 'date-fns/addDays'
import addMonths from 'date-fns/addMonths'

import startOfWeek from 'date-fns/startOfWeek'
import subDays from 'date-fns/subDays'
import subMonths from 'date-fns/subMonths'

import {
  Action,
  actionEndOfWeek,
  actionNextDay,
  actionNextMonth,
  actionNextWeek,
  actionPrevDay,
  actionPrevMonth,
  actionPrevWeek,
  actionSelectCurrent,
  actionSelectDate,
  actionStartOfWeek,
} from './actions'
import { RepickState } from './types'
import {
  selectDateMulti,
  selectDateRange,
  selectDateSingle,
  dateIsSelectable,
} from './utils'

export function reducer(state: RepickState, action: Action): RepickState {
  switch (action.type) {
    case actionSelectDate: {
      const date =
        action.date instanceof Date ? action.date : new Date(action.date)

      if (!dateIsSelectable(state, date)) {
        return state
      }

      switch (state.mode) {
        case 'single':
          return {
            ...state,
            date: date,
            selected: selectDateSingle(state.selected, date),
          }

        case 'multi':
          return {
            ...state,
            date: date,
            selected: selectDateMulti(state.selected, date),
          }

        case 'range':
          return {
            ...state,
            date: date,
            selected: selectDateRange(state.selected, date),
          }

        default:
          const _: never = state
          return _
      }
    }

    case actionSelectCurrent: {
      const date = state.date

      if (!dateIsSelectable(state, date)) {
        return state
      }

      switch (state.mode) {
        case 'single':
          return {
            ...state,
            date: date,
            selected: selectDateSingle(state.selected, date),
          }

        case 'multi':
          return {
            ...state,
            date: date,
            selected: selectDateMulti(state.selected, date),
          }

        case 'range':
          return {
            ...state,
            date: date,
            selected: selectDateRange(state.selected, date),
          }

        default:
          const _: never = state
          return _
      }
    }
    case actionPrevDay: {
      return { ...state, date: subDays(state.date, 1) }
    }
    case actionNextDay: {
      return { ...state, date: addDays(state.date, 1) }
    }
    case actionPrevWeek: {
      return { ...state, date: subDays(state.date, 7) }
    }
    case actionNextWeek: {
      return { ...state, date: addDays(state.date, 7) }
    }
    case actionPrevMonth: {
      return { ...state, date: subMonths(state.date, 1) }
    }
    case actionNextMonth: {
      return { ...state, date: addMonths(state.date, 1) }
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
      return _
    }
  }
}
