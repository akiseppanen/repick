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
  actionSelectHighlighted,
  actionSelectDate,
  actionStartOfWeek,
} from '../actions'
import { RepickState } from './types'
import { dateIsSelectable } from '../utils'

type RepickStateSelected<
  State extends RepickState<any>
> = State extends RepickState<infer Selected> ? Selected : never

export function reducer<State extends RepickState<any>>(
  selectDate: (
    selected: RepickStateSelected<State> | null,
    date: Date,
  ) => RepickStateSelected<State> | null,
) {
  return function (state: State, action: Action): State {
    switch (action.type) {
      case actionSelectDate: {
        const date =
          action.date instanceof Date ? action.date : new Date(action.date)

        if (!dateIsSelectable(state, date)) {
          return state
        }

        return {
          ...state,
          highlighted: date,
          selected: selectDate(state.selected, date),
        }
      }

      case actionSelectHighlighted: {
        const date = state.highlighted

        if (!dateIsSelectable(state, date)) {
          return state
        }

        return {
          ...state,
          highlighted: date,
          selected: selectDate(state.selected, date),
        }
      }
      case actionPrevDay: {
        return { ...state, highlighted: subDays(state.highlighted, 1) }
      }
      case actionNextDay: {
        return { ...state, highlighted: addDays(state.highlighted, 1) }
      }
      case actionPrevWeek: {
        return { ...state, highlighted: subDays(state.highlighted, 7) }
      }
      case actionNextWeek: {
        return { ...state, highlighted: addDays(state.highlighted, 7) }
      }
      case actionPrevMonth: {
        return { ...state, highlighted: subMonths(state.highlighted, 1) }
      }
      case actionNextMonth: {
        return { ...state, highlighted: addMonths(state.highlighted, 1) }
      }
      case actionStartOfWeek: {
        return {
          ...state,
          highlighted: startOfWeek(state.highlighted, {
            weekStartsOn: state.weekStartsOn,
          }),
        }
      }
      case actionEndOfWeek: {
        return {
          ...state,
          highlighted: addDays(
            startOfWeek(state.highlighted, {
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
}

// export const reducerSingle = reducerGeneric<RepickStateSingle>(selectDateSingle)
// export const reducerMulti = reducerGeneric<RepickStateMulti>(selectDateMulti)
// export const reducerRange = reducerGeneric<RepickStateRange>(selectDateRange)
