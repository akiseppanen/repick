import format from 'date-fns/format'
import startOfDay from 'date-fns/startOfDay'
import React, { useRef, useEffect } from 'react'
import {
  actionDateClick,
  actionEndOfWeek,
  actionNextDay,
  actionNextMonth,
  actionNextWeek,
  actionNextYear,
  actionPrevDay,
  actionPrevMonth,
  actionPrevWeek,
  actionPrevYear,
  actionSelectDate,
  actionSelectHighlighted,
  actionStartOfWeek,
  keyToAction,
  RepickAction,
  RepickContext,
  RepickDay,
  RepickState,
  RepickStateReducer,
  actionOpenCalendar,
  actionCloseCalendar,
  actionInputFocus,
  actionInputKeyArrowDown,
  actionInputBlur,
  actionInputChange,
  actionInputKeyEnter,
} from 'repick-core'

import { useControllableReducer } from './use-controllable-reducer'
import {
  RepickProps,
  RepickReturnValue,
  DialogProps,
  MonthProps,
  DateProps,
  InputProps,
  CalendarProps,
  HeaderProps,
  LabelProps,
  ToggleButtonProps,
} from './types'

export type RepickCoreDeps<
  Selected extends Date | Date[],
  DayContext extends RepickDay<any>
> = {
  reducer: (
    stateReducer?: RepickStateReducer<Selected>,
  ) => (
    state: RepickState<Selected>,
    action: RepickAction,
  ) => RepickState<Selected>
  buildContext: (
    state: RepickState<Selected>,
  ) => RepickContext<Selected, DayContext>
}

export type RepickPropsWithCoreDeps<
  Selected extends Date | Date[],
  DayContext extends RepickDay<any>
> = RepickProps<Selected> & RepickCoreDeps<Selected, DayContext>

export function useDatePickerCore<
  Selected extends Date | Date[],
  DayContext extends RepickDay<any>
>({
  buildContext,
  reducer,
  ...props
}: RepickPropsWithCoreDeps<Selected, DayContext>): RepickReturnValue<
  Selected,
  DayContext
> {
  function initializeState(
    props: RepickProps<Selected>,
  ): RepickState<Selected> {
    return {
      highlighted:
        props.highlighted || props.initialHighlighted || startOfDay(new Date()),
      selected: props.selected || props.initialSelected || null,
      isOpen: props.isOpen || props.initialIsOpen || false,
      inputValue: '',
    }
  }

  function getControlledProps(
    props: RepickProps<Selected>,
  ): Partial<RepickState<Selected>> {
    return {
      allowInput: props.allowInput,
      format: props.format,
      formatter: props.formatter,
      parser: props.parser,
      highlighted: props.highlighted,
      isOpen: props.isOpen,
      locale: props.locale,
      selected: props.selected,
      weekStartsOn: props.weekStartsOn,
      filterDates: props.filterDates,
      disabledDates: props.disabledDates,
      enabledDates: props.enabledDates,
      minDate: props.minDate,
      maxDate: props.maxDate,
      monthCount: props.monthCount,
    }
  }

  const [state, dispatch] = useControllableReducer(
    reducer(props.stateReducer),
    props,
    initializeState,
    getControlledProps,
    (oldState, newState) => {
      if (props.onChange && oldState.selected !== newState.selected) {
        props.onChange(newState.selected)
      }
      if (props.onUpdate && oldState.highlighted !== newState.highlighted) {
        props.onUpdate(newState.highlighted)
      }
    },
  )

  const id = props.id || `repick-${Date.now().toString(36)}`
  const focusFromRef = useRef<HTMLElement>()
  const isMouseDownRef = useRef<boolean>(false)
  const shouldFocusRef = useRef<boolean>(!!props.autoFocus)
  const shouldBlurRef = useRef<boolean>(true)
  const inputRef = useRef<HTMLElement>()
  const toggleButtonRef = useRef<HTMLElement>()
  const calendarRef = useRef<HTMLElement>()
  const dateRefs: Record<string, HTMLElement> = {}

  useEffect(() => {
    const onMouseDown = () => {
      isMouseDownRef.current = true
    }
    const onMouseUp = (e: MouseEvent) => {
      isMouseDownRef.current = false

      if (
        state.isOpen &&
        !(
          toggleButtonRef.current?.contains(e.target as HTMLElement) ||
          inputRef.current?.contains(e.target as HTMLElement) ||
          calendarRef.current?.contains(e.target as HTMLElement)
        )
      ) {
        dispatch({ type: 'CloseCalendar' })
      }
    }

    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [state.isOpen])

  const formatDateRefId = (date: Date) => format(date, 'yyyy-MM-dd')

  const setFocusToDate = React.useCallback(
    (date: Date) => {
      window.requestAnimationFrame(() => {
        const id = formatDateRefId(date)
        if (dateRefs[id]) {
          shouldFocusRef.current = false
          dateRefs[id].focus()
        }
      })
    },
    [dateRefs],
  )

  const setFocusToCalendar = () => {
    window.requestAnimationFrame(() => {
      const id = formatDateRefId(state.highlighted)

      if (dateRefs[id]) {
        dateRefs[id].focus()
      }
    })
  }

  React.useEffect(() => {
    if (shouldFocusRef.current === true && state.isOpen) {
      shouldFocusRef.current = false
      setFocusToCalendar()
    }
    if (shouldFocusRef.current === true && !state.isOpen) {
      shouldFocusRef.current = false
      shouldBlurRef.current = true
      focusFromRef.current?.focus()
    }
  }, [state.isOpen])

  React.useEffect(() => {
    if (shouldFocusRef.current === true && state.isOpen) {
      shouldFocusRef.current = false

      setFocusToDate(state.highlighted)
    }
  }, [setFocusToDate, state.highlighted, state.isOpen])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const action = keyToAction(e.key)

    if (action) {
      e.preventDefault()
      shouldBlurRef.current = false
      shouldFocusRef.current = true
      dispatch(action)
    }
  }

  const getDialogProps = (): DialogProps => {
    return {
      'aria-modal': true,
      'aria-labelledby': `${id}-header`,
      role: 'dialog',
      onBlur: e => {
        if (
          shouldBlurRef.current === false ||
          calendarRef.current?.contains(e.relatedTarget as HTMLElement)
        ) {
          shouldBlurRef.current = true
          return
        }

        const shouldBlur = !isMouseDownRef.current

        if (shouldBlur) {
          dispatch({ type: 'CloseCalendar' })
        }
      },
      onKeyDown: handleKeyDown,
      tabIndex: 0,
      ref: (el: HTMLElement | null) => {
        calendarRef.current = el || undefined
      },
    }
  }

  const getLabelProps = (): LabelProps => {
    return {
      htmlFor: `${id}-input`,
    }
  }

  const getInputProps = (): InputProps => {
    return {
      id: `${id}-input`,
      onChange: e => {
        dispatch({
          type: actionInputChange,
          value: e.currentTarget.value,
        })
      },
      onBlur: () => {
        if (shouldBlurRef.current === false) {
          shouldBlurRef.current = true
          return
        }

        const shouldBlur = !isMouseDownRef.current

        if (shouldBlur) {
          dispatch({ type: actionInputBlur })
        }
      },
      onFocus: () => {
        dispatch({
          type: actionInputFocus,
        })
      },
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
          focusFromRef.current = e.target as HTMLElement
          shouldBlurRef.current = false
          shouldFocusRef.current = true
          dispatch({
            type: actionInputKeyArrowDown,
          })
        }
        if (e.key === 'Enter') {
          dispatch({
            type: actionInputKeyEnter,
          })
        }
      },
      readOnly: !props.allowInput,
      ref: el => {
        inputRef.current = el || undefined
      },
      type: 'text',
      value: state.inputValue,
    }
  }

  const getCalendarHeaderProps = (index?: number): HeaderProps => {
    return {
      'aria-live': 'polite',
      id: index !== undefined ? `${id}-${index}-header` : `${id}-header`,
    }
  }

  const getCalendarProps = (index?: number): CalendarProps => {
    return {
      'aria-labelledby':
        index !== undefined ? `${id}-${index}-header` : `${id}-header`,
      onKeyDown: handleKeyDown,
      role: 'grid',
    }
  }

  const getToggleButtonProps = (): ToggleButtonProps => {
    return {
      'aria-label': 'Choose Date',
      onClick: e => {
        if (state.isOpen) {
          shouldBlurRef.current = false
          dispatch({
            type: actionCloseCalendar,
          })
        } else {
          focusFromRef.current = e.target as HTMLElement
          shouldFocusRef.current = true
          dispatch({
            type: actionOpenCalendar,
          })
        }
      },
      ref: el => {
        toggleButtonRef.current = el || undefined
      },
    }
  }

  const getPrevMonthProps = (): MonthProps => {
    return {
      onClick: () => dispatch({ type: actionPrevMonth }),
      'aria-label': `Go back 1 month`,
      role: 'button',
    }
  }

  const getNextMonthProps = (): MonthProps => {
    return {
      onClick: () => dispatch({ type: actionNextMonth }),
      'aria-label': `Go ahead 1 month`,
      role: 'button',
    }
  }

  const getDateProps = (calendarDay: RepickDay<any>): DateProps => {
    return {
      onClick: e => {
        e.preventDefault()
        dispatch({ type: actionDateClick, date: calendarDay.date })
      },
      'aria-label': calendarDay.date.toDateString(),
      'aria-pressed': calendarDay.selected,
      'aria-selected': calendarDay.selected,
      role: 'button',
      tabIndex: calendarDay.highlighted ? 0 : -1,
      ref: (el: HTMLElement | null) => {
        if (el) {
          dateRefs[formatDateRefId(calendarDay.date)] = el
        }
      },
    }
  }

  const context = buildContext(state)

  return {
    ...context,
    closeCalendar: () => dispatch({ type: actionCloseCalendar }),
    endOfWeek: () => dispatch({ type: actionEndOfWeek }),
    getCalendarHeaderProps,
    getCalendarProps,
    getDateProps,
    getDialogProps,
    getInputProps,
    getLabelProps,
    getNextMonthProps,
    getPrevMonthProps,
    getToggleButtonProps,
    handleKeyDown,
    nextDay: () => dispatch({ type: actionNextDay }),
    nextMonth: () => dispatch({ type: actionNextMonth }),
    nextWeek: () => dispatch({ type: actionNextWeek }),
    nextYear: () => dispatch({ type: actionNextYear }),
    openCalendar: () => dispatch({ type: actionOpenCalendar }),
    prevDay: () => dispatch({ type: actionPrevDay }),
    prevMonth: () => dispatch({ type: actionPrevMonth }),
    prevWeek: () => dispatch({ type: actionPrevWeek }),
    prevYear: () => dispatch({ type: actionPrevYear }),
    selectCurrent: () => dispatch({ type: actionSelectHighlighted }),
    selectDate: (date: string | number | Date) =>
      dispatch({ type: actionSelectDate, date }),
    setFocusToCalendar,
    setFocusToDate,
    startOfWeek: () => dispatch({ type: actionStartOfWeek }),
  }
}
