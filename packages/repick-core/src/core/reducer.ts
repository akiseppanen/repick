import addDays from 'date-fns/addDays'
import addMonths from 'date-fns/addMonths'
import addYears from 'date-fns/addYears'
import setDay from 'date-fns/setDay'
import subDays from 'date-fns/subDays'
import subMonths from 'date-fns/subMonths'
import subYears from 'date-fns/subYears'
import startOfMonth from 'date-fns/startOfMonth'
import startOfWeek from 'date-fns/startOfWeek'
import differenceInDays from 'date-fns/differenceInDays'

import {
  actionBlur,
  actionCloseCalendar,
  actionDateClick,
  actionDateMouseOver,
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
import { RepickState, RepickOptions } from './types'
import {
  getHighlightedDate,
  getHighlightedIndexForDate,
  dateIsSelectable,
  wrapWeekDay,
  defaultOptions,
  assertNever,
} from '../utils'

export function createReducer<Selected extends Date | Date[]>(
  selectDate: (
    selected: Selected | null,
    date: Date,
  ) => [Selected | null, boolean],
  defaultFormatter: (selected: Selected | null, format: string) => string,
  defaultParser: (dateString: string, format: string) => Selected | false,
) {
  return function reducer(
    state: RepickState<Selected>,
    action: RepickAction,
    argOptions: RepickOptions<Selected>,
  ): Partial<RepickState<Selected>> {
    const options = { ...defaultOptions, ...argOptions }

    const formatter = options.formatter || defaultFormatter
    const parser = options.parser || defaultParser

    function reduceHighlighted(
      state: RepickState<Selected>,
      updateDate: (date: Date) => Date,
    ): Partial<RepickState<Selected>> {
      const activeDate = updateDate(
        getHighlightedDate(state.activeDate, state.highlightedIndex, {
          weekStartsOn: options.weekStartsOn || 0,
        }),
      )

      const firstDayOfMonth = startOfMonth(activeDate)

      const highlightedIndex = differenceInDays(
        activeDate,
        startOfWeek(firstDayOfMonth, {
          weekStartsOn: options.weekStartsOn,
        }),
      )

      return {
        activeDate,
        highlightedIndex,
      }
    }

    function reduceSelected(state: RepickState<Selected>, date: Date) {
      if (!dateIsSelectable(options, date)) {
        return {}
      }

      const [selected, shouldClose] = selectDate(state.selected, date)

      return {
        activeDate: date,
        selected,
        highlightedIndex: getHighlightedIndexForDate(startOfMonth(date), date, {
          weekStartsOn: options.weekStartsOn,
        }),
        isOpen: !shouldClose && state.isOpen,
        inputValue: formatter(selected, options.format),
      } as Partial<RepickState<Selected>>
    }

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
        const parsedDate = parser(action.value, options.format)

        const highlightedDate: Date | false =
          !!parsedDate && Array.isArray(parsedDate) ? parsedDate[0] : parsedDate

        if (!highlightedDate) {
          return {
            inputValue: action.value,
          }
        }

        return {
          highlightedIndex: getHighlightedIndexForDate(
            state.activeDate,
            highlightedDate,
            { weekStartsOn: options.weekStartsOn },
          ),
          inputValue: action.value,
        }
      }

      case actionInputKeyEnter: {
        const parsedDate = parser(state.inputValue, options.format)

        if (!parsedDate) {
          return {
            inputValue: formatter(state.selected, options.format),
          }
        }

        const highlightedDate: Date = Array.isArray(parsedDate)
          ? parsedDate[0]
          : parsedDate

        return {
          highlightedIndex: getHighlightedIndexForDate(
            state.activeDate,
            highlightedDate,
            { weekStartsOn: options.weekStartsOn },
          ),
          selected: parsedDate,
          inputValue: formatter(parsedDate, options.format),
        } as Partial<RepickState<Selected>>
      }
      case actionDateClick:
      case actionSelectDate: {
        const date =
          action.date instanceof Date ? action.date : new Date(action.date)

        return reduceSelected(state, date)
      }

      case actionDateMouseOver: {
        if (!options.updateHighlightedOnHover) {
          return {}
        }

        return { highlightedIndex: action.index }
      }

      case actionKeyEnter:
      case actionSelectHighlighted: {
        return reduceSelected(
          state,
          getHighlightedDate(state.activeDate, state.highlightedIndex, {
            weekStartsOn: options.weekStartsOn,
          }),
        )
      }

      case actionKeyArrowLeft:
      case actionPrevDay: {
        return reduceHighlighted(state, date => subDays(date, 1))
      }
      case actionKeyArrowRight:
      case actionNextDay: {
        return reduceHighlighted(state, date => addDays(date, 1))
      }
      case actionKeyArrowUp:
      case actionPrevWeek: {
        return reduceHighlighted(state, date => subDays(date, 7))
      }
      case actionKeyArrowDown:
      case actionNextWeek: {
        return reduceHighlighted(state, date => addDays(date, 7))
      }
      case actionKeyPageDown:
      case actionPrevMonth: {
        return reduceHighlighted(state, date => subMonths(date, 1))
      }
      case actionKeyPageUp:
      case actionNextMonth: {
        return reduceHighlighted(state, date => addMonths(date, 1))
      }
      case actionKeyHome:
      case actionStartOfWeek: {
        return reduceHighlighted(state, date =>
          setDay(date, options.weekStartsOn || 0, {
            locale: options.locale,
            weekStartsOn: options.weekStartsOn,
          }),
        )
      }

      case actionKeyEnd:
      case actionEndOfWeek: {
        return reduceHighlighted(state, date =>
          setDay(date, wrapWeekDay(options.weekStartsOn + 6), {
            locale: options.locale,
            weekStartsOn: options.weekStartsOn,
          }),
        )
      }

      case actionKeyShiftPageDown:
      case actionPrevYear: {
        return reduceHighlighted(state, date => subYears(date, 1))
      }

      case actionKeyShiftPageUp:
      case actionNextYear: {
        return reduceHighlighted(state, date => addYears(date, 1))
      }

      default: {
        assertNever(action, 'Invalid action type')
      }
    }
  }
}
