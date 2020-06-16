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
  actionInputChange,
  actionInputKeyEnter,
} from '../actions'
import { RepickState } from './types'
import { dateIsSelectable, wrapWeekDay } from '../utils'

export type RepickStateChangeOptions<Selected extends Date | Date[]> = {
  action: RepickAction
  changes: Partial<RepickState<Selected>>
}

export type RepickStateReducer<Selected extends Date | Date[]> = (
  state: RepickState<Selected>,
  actionAndChanges: RepickStateChangeOptions<Selected>,
) => RepickState<Selected>

export function reducer<Selected extends Date | Date[]>(
  selectDate: (
    selected: Selected | null,
    date: Date,
  ) => [Selected | null, boolean],
  format: (selected: Selected, format: string) => string,
  parse: (dateString: string, format: string) => Selected | false,
) {
  function reduceSelected(state: RepickState<Selected>, date: Date) {
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
    } as Partial<RepickState<Selected>>
  }

  function reducer(
    state: RepickState<Selected>,
    action: RepickAction,
  ): Partial<RepickState<Selected>> {
    switch (action.type) {
      case actionInputFocus:
      case actionInputKeyArrowDown:
      case actionOpenCalendar: {
        return {
          isOpen: true,
        } as Partial<RepickState<Selected>>
      }
      case actionBlur:
      case actionInputBlur:
      case actionKeyEscape:
      case actionCloseCalendar: {
        return {
          isOpen: false,
        } as Partial<RepickState<Selected>>
      }
      case actionInputChange: {
        const parsedDate = parse(action.value, state.format || 'yyyy-MM-dd')

        const highlighted = parsedDate
          ? Array.isArray(parsedDate)
            ? parsedDate[0]
            : parsedDate
          : state.highlighted

        return {
          highlighted,
          inputValue: action.value,
        } as Partial<RepickState<Selected>>
      }
      case actionInputKeyEnter: {
        const parsedDate = parse(state.inputValue, state.format || 'yyyy-MM-dd')

        const highlighted = parsedDate
          ? Array.isArray(parsedDate)
            ? parsedDate[0]
            : parsedDate
          : state.highlighted

        const selected = parsedDate ? parsedDate : state.selected

        return {
          highlighted,
          selected,
          inputValue: selected
            ? format(selected, state.format || 'yyyy-MM-dd')
            : '',
        }
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
        } as Partial<RepickState<Selected>>
      }
      case actionKeyArrowRight:
      case actionNextDay: {
        return { highlighted: addDays(state.highlighted, 1) } as Partial<
          RepickState<Selected>
        >
      }
      case actionKeyArrowUp:
      case actionPrevWeek: {
        return { highlighted: subDays(state.highlighted, 7) } as Partial<
          RepickState<Selected>
        >
      }
      case actionKeyArrowDown:
      case actionNextWeek: {
        return { highlighted: addDays(state.highlighted, 7) } as Partial<
          RepickState<Selected>
        >
      }
      case actionKeyPageDown:
      case actionPrevMonth: {
        return { highlighted: subMonths(state.highlighted, 1) } as Partial<
          RepickState<Selected>
        >
      }
      case actionKeyPageUp:
      case actionNextMonth: {
        return { highlighted: addMonths(state.highlighted, 1) } as Partial<
          RepickState<Selected>
        >
      }
      case actionKeyHome:
      case actionStartOfWeek: {
        return {
          highlighted: setDay(state.highlighted, state.weekStartsOn || 0, {
            locale: state.locale,
            weekStartsOn: state.weekStartsOn,
          }),
        } as Partial<RepickState<Selected>>
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
        } as Partial<RepickState<Selected>>
      }

      case actionKeyShiftPageDown:
      case actionPrevYear: {
        return { highlighted: subYears(state.highlighted, 1) } as Partial<
          RepickState<Selected>
        >
      }

      case actionKeyShiftPageUp:
      case actionNextYear: {
        return { highlighted: addYears(state.highlighted, 1) } as Partial<
          RepickState<Selected>
        >
      }

      default: {
        const _: never = action
        return _
      }
    }
  }

  return (
    stateReducer: RepickStateReducer<Selected> | undefined = (
      state,
      { changes },
    ) => ({ ...state, ...changes }),
  ) => (state: RepickState<Selected>, action: RepickAction) => {
    const changes = reducer(state, action)

    return stateReducer(state, { action, changes })
  }
}
