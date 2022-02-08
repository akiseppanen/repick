import format from 'date-fns/format'
import startOfDay from 'date-fns/startOfDay'
import startOfMonth from 'date-fns/startOfMonth'
import { useRef, useEffect, useMemo, useCallback, KeyboardEvent } from 'react'
import {
  actionCloseCalendar,
  actionDateClick,
  actionDateMouseOver,
  actionEndOfWeek,
  actionInputBlur,
  actionInputChange,
  actionInputFocus,
  actionInputKeyArrowDown,
  actionInputKeyEnter,
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
  keyToAction,
  RepickAction,
  RepickContext,
  RepickDay,
  RepickOptions,
  RepickState,
} from '@repick/core'

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
import { optionsFromProps, useControlledReducer } from './utils'

type RepickCoreDeps<
  Selected extends Date | Date[],
  DayContext extends RepickDay<any>
> = {
  reducer: (
    state: RepickState<Selected>,
    action: RepickAction,
    options: RepickOptions<Selected>,
  ) => Partial<RepickState<Selected>>
  buildContext: (
    state: RepickState<Selected>,
    options: RepickOptions<Selected>,
  ) => RepickContext<Selected, DayContext>
}

type RepickPropsWithCoreDeps<
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
  const [state, dispatch] = useControlledReducer(
    reducer,
    {
      activeMonth: startOfMonth(
        props.highlighted || props.initialHighlighted || new Date(),
      ),
      highlighted:
        props.highlighted || props.initialHighlighted || startOfDay(new Date()),
      selected: props.selected || props.initialSelected || null,
      isOpen: props.isOpen || props.initialIsOpen || false,
      inputValue: '',
    },
    props,
  )

  const id = useMemo(() => props.id || `repick-${Date.now().toString(36)}`, [
    props.id,
  ])
  const focusFromRef = useRef<HTMLElement>()
  const isMouseDownRef = useRef<boolean>(false)
  const shouldFocusRef = useRef<boolean>(false)
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
  }, [dispatch, state.isOpen])

  const formatDateRefId = (date: Date) => format(date, 'yyyy-MM-dd')

  const setFocusToDate = useCallback(
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

  const setFocusToCalendar = useCallback(() => {
    window.requestAnimationFrame(() => {
      const id = formatDateRefId(state.highlighted)

      if (dateRefs[id]) {
        dateRefs[id].focus()
      }
    })
  }, [dateRefs, state.highlighted])

  useEffect(() => {
    if (shouldFocusRef.current === true && state.isOpen) {
      shouldFocusRef.current = false
      setFocusToCalendar()
    }
    if (shouldFocusRef.current === true && !state.isOpen) {
      shouldFocusRef.current = false
      shouldBlurRef.current = true
      focusFromRef.current?.focus()
    }
  }, [setFocusToCalendar, state.isOpen])

  useEffect(() => {
    if (shouldFocusRef.current === true && state.isOpen) {
      shouldFocusRef.current = false

      setFocusToDate(state.highlighted)
    }
  }, [setFocusToDate, state.highlighted, state.isOpen])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const action = keyToAction(e.key)

      if (action) {
        e.stopPropagation()
        e.preventDefault()
        shouldBlurRef.current = false
        shouldFocusRef.current = true
        dispatch(action)
      }
    },
    [dispatch],
  )

  const getDialogProps = useCallback((): DialogProps => {
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
  }, [id, dispatch, handleKeyDown])

  const getLabelProps = useCallback((): LabelProps => {
    return {
      htmlFor: `${id}-input`,
    }
  }, [id])

  const getInputProps = useCallback((): InputProps => {
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
      onKeyDown: e => {
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
  }, [id, dispatch, props.allowInput, state.inputValue])

  const getCalendarHeaderProps = useCallback(
    (index?: number): HeaderProps => {
      return {
        'aria-live': 'polite',
        id: index !== undefined ? `${id}-${index}-header` : `${id}-header`,
      }
    },
    [id],
  )

  const getCalendarProps = useCallback(
    (index?: number): CalendarProps => {
      return {
        'aria-labelledby':
          index !== undefined ? `${id}-${index}-header` : `${id}-header`,
        onKeyDown: handleKeyDown,
        role: 'grid',
      }
    },
    [id, handleKeyDown],
  )

  const getToggleButtonProps = useCallback((): ToggleButtonProps => {
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
  }, [dispatch, state.isOpen])

  const getPrevMonthProps = useCallback((): MonthProps => {
    return {
      onClick: () => dispatch({ type: actionPrevMonth }),
      'aria-label': `Go back 1 month`,
      role: 'button',
    }
  }, [dispatch])

  const getNextMonthProps = useCallback((): MonthProps => {
    return {
      onClick: () => dispatch({ type: actionNextMonth }),
      'aria-label': `Go ahead 1 month`,
      role: 'button',
    }
  }, [dispatch])

  const getDateProps = useCallback(
    (calendarDay: RepickDay<any>): DateProps => {
      return {
        onClick: e => {
          e.preventDefault()
          dispatch({ type: actionDateClick, date: calendarDay.date })
        },
        onMouseOver: () => {
          dispatch({ type: actionDateMouseOver, date: calendarDay.date })
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
    },
    [dispatch, dateRefs],
  )

  const closeCalendar = useCallback(
    () => dispatch({ type: actionCloseCalendar }),
    [dispatch],
  )

  const endOfWeek = useCallback(() => dispatch({ type: actionEndOfWeek }), [
    dispatch,
  ])

  const nextDay = useCallback(() => dispatch({ type: actionNextDay }), [
    dispatch,
  ])

  const nextMonth = useCallback(() => dispatch({ type: actionNextMonth }), [
    dispatch,
  ])

  const nextWeek = useCallback(() => dispatch({ type: actionNextWeek }), [
    dispatch,
  ])

  const nextYear = useCallback(() => dispatch({ type: actionNextYear }), [
    dispatch,
  ])

  const openCalendar = useCallback(
    () => dispatch({ type: actionOpenCalendar }),
    [dispatch],
  )

  const prevDay = useCallback(() => dispatch({ type: actionPrevDay }), [
    dispatch,
  ])

  const prevMonth = useCallback(() => dispatch({ type: actionPrevMonth }), [
    dispatch,
  ])

  const prevWeek = useCallback(() => dispatch({ type: actionPrevWeek }), [
    dispatch,
  ])

  const prevYear = useCallback(() => dispatch({ type: actionPrevYear }), [
    dispatch,
  ])

  const selectCurrent = useCallback(
    () => dispatch({ type: actionSelectHighlighted }),
    [dispatch],
  )

  const selectDate = useCallback(
    (date: string | number | Date) =>
      dispatch({ type: actionSelectDate, date }),
    [dispatch],
  )

  const startOfWeek = useCallback(() => dispatch({ type: actionStartOfWeek }), [
    dispatch,
  ])

  return {
    ...buildContext(state, optionsFromProps(props)),
    closeCalendar,
    endOfWeek,
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
    nextDay,
    nextMonth,
    nextWeek,
    nextYear,
    openCalendar,
    prevDay,
    prevMonth,
    prevWeek,
    prevYear,
    selectCurrent,
    selectDate,
    setFocusToCalendar,
    setFocusToDate,
    startOfWeek,
  }
}
