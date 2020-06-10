import addDays from 'date-fns/addDays'
import addMonths from 'date-fns/addMonths'
import setDay from 'date-fns/setDay'
import subDays from 'date-fns/subDays'
import subMonths from 'date-fns/subMonths'

import {
  RepickAction,
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
  actionDateClick,
  actionKeyArrowLeft,
  actionKeyArrowRight,
  actionKeyArrowUp,
  actionKeyArrowDown,
  actionKeyPageDown,
  actionKeyPageUp,
  actionKeyHome,
  actionKeyEnd,
  actionKeyEnter,
} from '../actions'
import { RepickState } from './types'
import { dateIsSelectable, wrapWeekDay } from '../utils'

type RepickStateSelected<
  State extends RepickState<any>
> = State extends RepickState<infer Selected> ? Selected : never

export type RepickStateChangeOptions<Selected> = {
  action: RepickAction
  changes: Partial<RepickState<Selected>>
}

export type RepickStateReducer<State extends RepickState<any>> = (
  state: State,
  actionAndChanges: RepickStateChangeOptions<RepickStateSelected<State>>,
) => State

export function reducer<State extends RepickState<any>>(
  selectDate: (
    selected: RepickStateSelected<State> | null,
    date: Date,
  ) => RepickStateSelected<State> | null,
) {
  function reducer(state: State, action: RepickAction): Partial<State> {
    switch (action.type) {
      case actionDateClick:
      case actionSelectDate: {
        const date =
          action.date instanceof Date ? action.date : new Date(action.date)

        if (!dateIsSelectable(state, date)) {
          return {}
        }

        return {
          highlighted: date,
          selected: selectDate(state.selected, date),
        } as Partial<State>
      }

      case actionKeyEnter:
      case actionSelectHighlighted: {
        if (!dateIsSelectable(state, state.highlighted)) {
          return {}
        }

        return {
          highlighted: state.highlighted,
          selected: selectDate(state.selected, state.highlighted),
        } as Partial<State>
      }

      case actionKeyArrowLeft:
      case actionPrevDay: {
        return {
          highlighted: subDays(state.highlighted, 1),
        } as Partial<State>
      }
      case actionKeyArrowRight:
      case actionNextDay: {
        return { highlighted: addDays(state.highlighted, 1) } as Partial<State>
      }
      case actionKeyArrowUp:
      case actionPrevWeek: {
        return { highlighted: subDays(state.highlighted, 7) } as Partial<State>
      }
      case actionKeyArrowDown:
      case actionNextWeek: {
        return { highlighted: addDays(state.highlighted, 7) } as Partial<State>
      }
      case actionKeyPageDown:
      case actionPrevMonth: {
        return { highlighted: subMonths(state.highlighted, 1) } as Partial<
          State
        >
      }
      case actionKeyPageUp:
      case actionNextMonth: {
        return { highlighted: addMonths(state.highlighted, 1) } as Partial<
          State
        >
      }
      case actionKeyHome:
      case actionStartOfWeek: {
        return {
          highlighted: setDay(state.highlighted, state.weekStartsOn || 0, {
            locale: state.locale,
            weekStartsOn: state.weekStartsOn,
          }),
        } as Partial<State>
      }

      case actionKeyEnd:
      case actionEndOfWeek: {
        return {
          highlighted: setDay(
            state.highlighted,
            wrapWeekDay((state.weekStartsOn || 0) + 6),
            {
              locale: state.locale,
              weekStartsOn: state.weekStartsOn,
            },
          ),
        } as Partial<State>
      }

      default: {
        const _: never = action
        return _
      }
    }
  }

  return (
    stateReducer: RepickStateReducer<State> | undefined = (
      state,
      { changes },
    ) => ({ ...state, ...changes }),
  ) => (state: State, action: RepickAction) => {
    const changes = reducer(state, action)

    return stateReducer(state, { action, changes })
  }
}
