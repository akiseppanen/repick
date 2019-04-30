import * as startOfDay from 'date-fns/start_of_day'
import * as React from 'react'
import {
  buildCalendar,
  Calendar,
  CalendarDay,
  defaultOptions,
  keyToAction,
  Options,
  reducer,
} from 'repick-core'

export interface CalendarProps {
  onKeyDown: (e: React.KeyboardEvent) => void
  tabIndex: number
}

export interface MonthProps {
  onClick: (e: React.MouseEvent) => void
  'aria-label': string
  role: string
}

export interface DateProps {
  onClick: (e: React.MouseEvent) => void
  'aria-label': string
  'aria-pressed': boolean
  role: string
  tabIndex: number
  ref: (el: HTMLElement | null) => void
}

export interface Props extends Calendar {
  selectDate: (date: string | number | Date) => void
  prevDay: () => void
  nextDay: () => void
  prevWeek: () => void
  nextWeek: () => void
  prevMonth: () => void
  nextMonth: () => void
  getCalendarProps: () => CalendarProps
  getDateProps: (calendarDay: CalendarDay) => DateProps
  getNextMonthProps: () => MonthProps
  getPrevMonthProps: () => MonthProps
  handleKeyDown: (e: React.KeyboardEvent) => void
  setFocusToCalendar: () => void
  setFocusToDate: (date: Date) => void
}

interface RepickProps {
  onChange?: (date: Date) => void
  onUpdate?: (calendar: Calendar) => void
  weekStartsOn?: number
  locale?: object
  format?: string
  date?: Date
  initialDate?: Date
  selected?: Date | null
  initialSelected?: Date
}

interface Children {
  children: (s: Props) => React.ReactElement
}

export const useRepick = (props: RepickProps): Props => {
  const dateRefs: Record<string, HTMLElement> = {}

  const initialState = {
    date:
      props.initialDate ||
      props.initialSelected ||
      props.selected ||
      startOfDay(new Date()),
    selected: props.initialSelected || null,
  }

  const [dispatcherState, dispatch] = React.useReducer(reducer, initialState)

  const state = {
    date: props.date || dispatcherState.date,
    selected: props.selected || dispatcherState.selected,
  }

  const setFocusToDate = (date: Date) => {
    window.requestAnimationFrame(() => {
      if (dateRefs[date.toISOString()]) {
        dateRefs[date.toISOString()].focus()
      }
    })
  }

  React.useEffect(
    () => {
      setFocusToDate(state.date)
    },
    [state.date],
  )

  React.useEffect(
    () => {
      if (props.onChange && state.selected) {
        props.onChange(state.selected)
      }
    },
    [state.selected],
  )

  const options: Options = {
    ...defaultOptions,
    locale: props.locale,
    weekStartsOn: props.weekStartsOn,
  }

  const setFocusToCalendar = () => {
    window.requestAnimationFrame(() => {
      if (dateRefs[state.date.toISOString()]) {
        dateRefs[state.date.toISOString()].focus()
      }
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const action = keyToAction(e.key)

    if (action) {
      dispatch(action)
    }
  }

  const getCalendarProps = (): CalendarProps => {
    return {
      onKeyDown: handleKeyDown,
      tabIndex: 0,
    }
  }

  const getPrevMonthProps = (): MonthProps => {
    return {
      onClick: () => dispatch({ type: 'PrevMonth' }),
      'aria-label': `Go back 1 month`,
      role: 'button',
    }
  }

  const getNextMonthProps = (): MonthProps => {
    return {
      onClick: () => dispatch({ type: 'NextMonth' }),
      'aria-label': `Go ahead 1 month`,
      role: 'button',
    }
  }

  const getDateProps = (calendarDay: CalendarDay): DateProps => {
    return {
      onClick: e => {
        e.preventDefault()
        dispatch({ type: 'SelectDate', date: calendarDay.date })
      },
      'aria-label': calendarDay.date.toDateString(),
      'aria-pressed': calendarDay.selected,
      role: 'button',
      tabIndex: calendarDay.current ? 0 : -1,
      ref: (el: HTMLElement | null) => {
        if (el) {
          dateRefs[calendarDay.date.toISOString()] = el
        }
      },
    }
  }

  return {
    ...buildCalendar(state, options),
    selectDate: (date: string | number | Date) =>
      dispatch({ type: 'SelectDate', date }),
    prevDay: () => dispatch({ type: 'PrevDay' }),
    nextDay: () => dispatch({ type: 'NextDay' }),
    prevWeek: () => dispatch({ type: 'PrevWeek' }),
    nextWeek: () => dispatch({ type: 'NextWeek' }),
    prevMonth: () => dispatch({ type: 'PrevMonth' }),
    nextMonth: () => dispatch({ type: 'NextMonth' }),
    getCalendarProps,
    getDateProps,
    getNextMonthProps,
    getPrevMonthProps,
    handleKeyDown,
    setFocusToCalendar,
    setFocusToDate,
  }
}

export const Repick: React.FunctionComponent<RepickProps & Children> = ({
  children,
  ...props
}) => {
  const childProps = useRepick(props)

  return children(childProps)
}

export default Repick
