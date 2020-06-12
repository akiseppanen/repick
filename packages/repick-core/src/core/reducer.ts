import addDays from 'date-fns/addDays'
import addMonths from 'date-fns/addMonths'
import addYears from 'date-fns/addYears'
import setDay from 'date-fns/setDay'
import subDays from 'date-fns/subDays'
import subMonths from 'date-fns/subMonths'
import subYears from 'date-fns/subYears'

import {
  actionBlur,
  actionCloseCalendar,
  actionDateClick,
  actionEndOfWeek,
  actionInputFocus,
  actionInputKeyArrowDown,
  actionKeyArrowDown,
  actionKeyArrowLeft,
  actionKeyArrowRight,
  actionKeyArrowUp,
  actionKeyEnd,
  actionKeyEnter,
  actionKeyEscape,
  actionKeyHome,
  actionKeyPageDown,
  actionKeyPageUp,
  actionKeyShiftPageDown,
  actionKeyShiftPageUp,
  actionNextDay,
  actionNextMonth,
  actionNextWeek,
  actionNextYear,
  actionOpenCalendar,
  actionPrevDay,
  actionPrevMonth,
  actionPrevWeek,
  actionPrevYear,
  actionSelectDate,
  actionSelectHighlighted,
  actionStartOfWeek,
  RepickAction,
  actionInputBlur,
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
  ) => [RepickStateSelected<State> | null, boolean],
  format: (selected: RepickStateSelected<State>, format: string) => string,
) {
  function reduceSelected(state: State, date: Date) {
    if (!dateIsSelectable(state, date)) {
      return {}
    }

    const [selected, shouldClose] = selectDate(state.selected, date)

    return {
      selected,
      highlighted: date,
      isOpen: !shouldClose && state.isOpen,
      inputValue: selected
        ? format(selected, state.format || 'yyyy-MM-dd')
        : '',
    } as Partial<State>
  }

  function reducer(state: State, action: RepickAction): Partial<State> {
    switch (action.type) {
      case actionInputFocus:
      case actionInputKeyArrowDown:
      case actionOpenCalendar: {
        return {
          isOpen: true,
        } as Partial<State>
      }
      case actionBlur:
      case actionInputBlur:
      case actionKeyEscape:
      case actionCloseCalendar: {
        return {
          isOpen: false,
        } as Partial<State>
      }
      case actionDateClick:
      case actionSelectDate: {
        const date =
          action.date instanceof Date ? action.date : new Date(action.date)

        return reduceSelected(state, date)
      }

      case actionKeyEnter:
      case actionSelectHighlighted: {
        return reduceSelected(state, state.highlighted)
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

      case actionKeyShiftPageDown:
      case actionPrevYear: {
        return { highlighted: subYears(state.highlighted, 1) } as Partial<State>
      }

      case actionKeyShiftPageUp:
      case actionNextYear: {
        return { highlighted: addYears(state.highlighted, 1) } as Partial<State>
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
