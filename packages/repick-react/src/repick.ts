import * as startOfDay from 'date-fns/start_of_day'
import * as React from 'react'
import {
  Action,
  buildCalendar,
  Calendar,
  CalendarDay,
  defaultOptions,
  keyToAction,
  reducer,
  State,
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

export interface ChildProps extends Calendar {
  selectDate: (date: string | number | Date) => State
  prevDay: () => State
  nextDay: () => State
  prevWeek: () => State
  nextWeek: () => State
  prevMonth: () => State
  nextMonth: () => State
  getCalendarProps: () => CalendarProps
  getDateProps: (calendarDay: CalendarDay) => DateProps
  getNextMonthProps: () => MonthProps
  getPrevMonthProps: () => MonthProps
  handleKeyDown: (e: React.KeyboardEvent) => void
  setFocusToCalendar: () => void
  setFocusToDate: (date: Date) => void
}

interface Props {
  children: (s: ChildProps) => React.ReactChild
  onChange?: (date: Date) => void
  onUpdate?: (calendar: Calendar) => void
  weekStartsOn?: number
  locale?: string
  format?: string
  date?: Date
  initialDate?: Date
  selected?: Date | null
  initialSelected?: Date
}

export default class Repick extends React.Component<Props, State> {
  public static getDerivedStateFromProps(props: Props, state: State) {
    return {
      date: props.date || state.date,
      selected: props.selected || state.selected,
    }
  }

  private dateRefs: Record<string, HTMLElement> = {}

  constructor(props: Props) {
    super(props)

    this.state = {
      date:
        this.props.initialDate ||
        this.props.initialSelected ||
        this.props.selected ||
        startOfDay(new Date()),
      selected: this.props.initialSelected || null,
    }
  }

  public render() {
    const { children } = this.props
    if (children) {
      return children({
        ...this.buildCalendar(),
        selectDate: (date: string | number | Date) =>
          this.dispatch({ type: 'SelectDate', date }),
        prevDay: () => this.dispatch({ type: 'PrevDay' }),
        nextDay: () => this.dispatch({ type: 'NextDay' }),
        prevWeek: () => this.dispatch({ type: 'PrevWeek' }),
        nextWeek: () => this.dispatch({ type: 'NextWeek' }),
        prevMonth: () => this.dispatch({ type: 'PrevMonth' }),
        nextMonth: () => this.dispatch({ type: 'NextMonth' }),
        getCalendarProps: this.getCalendarProps,
        getDateProps: this.getDateProps,
        getNextMonthProps: this.getNextMonthProps,
        getPrevMonthProps: this.getPrevMonthProps,
        handleKeyDown: this.handleKeyDown,
        setFocusToCalendar: this.setFocusToCalendar,
        setFocusToDate: this.setFocusToDate,
      })
    }
  }

  private setFocusToDate = (date: Date) => {
    window.requestAnimationFrame(() => {
      if (this.dateRefs[date.toISOString()]) {
        this.dateRefs[date.toISOString()].focus()
      }
    })
  }

  private setFocusToCalendar = () => {
    window.requestAnimationFrame(() => {
      if (this.dateRefs[this.state.date.toISOString()]) {
        this.dateRefs[this.state.date.toISOString()].focus()
      }
    })
  }

  private handleKeyDown = (e: React.KeyboardEvent) => {
    const action = keyToAction(e.key)

    if (action) {
      const d = this.dispatch(action).date
      this.setFocusToDate(d)
    }
  }

  private getCalendarProps = (): CalendarProps => {
    return {
      onKeyDown: this.handleKeyDown,
      tabIndex: 0,
    }
  }

  private getPrevMonthProps = (): MonthProps => {
    return {
      onClick: () => this.dispatch({ type: 'PrevMonth' }),
      'aria-label': `Go back 1 month`,
      role: 'button',
    }
  }

  private getNextMonthProps = (): MonthProps => {
    return {
      onClick: () => this.dispatch({ type: 'NextMonth' }),
      'aria-label': `Go ahead 1 month`,
      role: 'button',
    }
  }

  private getDateProps = (calendarDay: CalendarDay): DateProps => {
    return {
      onClick: () =>
        this.dispatch({ type: 'SelectDate', date: calendarDay.date }),
      'aria-label': calendarDay.date.toDateString(),
      'aria-pressed': calendarDay.selected,
      role: 'button',
      tabIndex: calendarDay.current ? 0 : -1,
      ref: (el: HTMLElement | null) => {
        if (el) {
          this.dateRefs[calendarDay.date.toISOString()] = el
        }
      },
    }
  }

  private buildCalendar = (state = this.state) =>
    buildCalendar(state, this.options)

  private dispatch(action: Action) {
    const newState = reducer(this.state, action, this.options)

    if (
      newState.selected &&
      this.state.selected !== newState.selected &&
      this.props.onChange
    ) {
      this.props.onChange(newState.selected)
    }

    this.setState(newState)

    return newState
  }

  private get options() {
    return {
      ...defaultOptions,
      weekStartsOn: this.props.weekStartsOn,
    }
  }
}
