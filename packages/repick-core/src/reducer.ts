import addDays from 'date-fns/add_days'
import addMonths from 'date-fns/add_months'
import startOfWeek from 'date-fns/start_of_week'
import subDays from 'date-fns/sub_days'
import subMonths from 'date-fns/sub_months'

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
import { State } from './types'
import { selectDateMulti, selectDateRange, selectDateSingle } from './utils'

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case actionSelectDate: {
      const date =
        action.date instanceof Date ? action.date : new Date(action.date)

      switch (state.mode) {
        case 'single':
          return {
            ...state,
            current: date,
            selected: selectDateSingle(state.selected, date),
          }

        case 'multi':
          return {
            ...state,
            current: date,
            selected: selectDateMulti(state.selected, date),
          }

        case 'range':
          return {
            ...state,
            current: date,
            selected: selectDateRange(state.selected, date),
          }

        default:
          const _: never = state
          return _
      }
    }

    case actionSelectCurrent: {
      const date = state.current

      switch (state.mode) {
        case 'single':
          return {
            ...state,
            current: date,
            selected: selectDateSingle(state.selected, date),
          }

        case 'multi':
          return {
            ...state,
            current: date,
            selected: selectDateMulti(state.selected, date),
          }

        case 'range':
          return {
            ...state,
            current: date,
            selected: selectDateRange(state.selected, date),
          }

        default:
          const _: never = state
          return _
      }
    }
    case actionPrevDay: {
      return { ...state, current: subDays(state.current, 1) }
    }
    case actionNextDay: {
      return { ...state, current: addDays(state.current, 1) }
    }
    case actionPrevWeek: {
      return { ...state, current: subDays(state.current, 7) }
    }
    case actionNextWeek: {
      return { ...state, current: addDays(state.current, 7) }
    }
    case actionPrevMonth: {
      return { ...state, current: subMonths(state.current, 1) }
    }
    case actionNextMonth: {
      return { ...state, current: addMonths(state.current, 1) }
    }
    case actionStartOfWeek: {
      return {
        ...state,
        current: startOfWeek(state.current, {
          weekStartsOn: state.weekStartsOn,
        }),
      }
    }
    case actionEndOfWeek: {
      return {
        ...state,
        current: addDays(
          startOfWeek(state.current, {
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
