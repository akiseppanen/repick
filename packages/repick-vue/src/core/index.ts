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
  getHighlightedIndexForDate,
  keyToAction,
  RepickAction,
  RepickContext,
  RepickDay,
  RepickOptions,
  RepickState,
} from '@repick/core'
import startOfDay from 'date-fns/startOfDay'
import startOfMonth from 'date-fns/startOfMonth'
import { computed, ComputedRef, onMounted, onUnmounted, ref, watch } from 'vue'

import {
  CalendarProps,
  DateProps,
  DialogProps,
  HeaderProps,
  InputProps,
  LabelProps,
  MonthProps,
  RepickProps,
  RepickReturnValue,
  ToggleButtonProps,
} from './types'
import { optionsFromProps, useControlledReducer } from './utils'

type RepickCoreDeps<
  Selected extends Date | Date[],
  DayContext extends RepickDay<any>,
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
  DayContext extends RepickDay<any>,
> = RepickProps<Selected> & RepickCoreDeps<Selected, DayContext>

export function useDatePickerCore<
  Selected extends Date | Date[],
  DayContext extends RepickDay<any>,
>({
  buildContext,
  reducer,
  ...props
}: RepickPropsWithCoreDeps<Selected, DayContext>): ComputedRef<
  RepickReturnValue<Selected, DayContext>
> {
  const [state, dispatch] = useControlledReducer(reducer, props, props => {
    const activeDate =
      props.activeDate || props.initialActiveDate || startOfDay(new Date())

    return {
      activeDate,
      highlightedIndex:
        props.highlightedIndex ||
        props.initialHighlightedIndex ||
        getHighlightedIndexForDate(startOfMonth(activeDate), activeDate, {
          weekStartsOn: props.weekStartsOn,
        }),
      selected: props.selected || props.initialSelected || null,
      isOpen: props.isOpen || props.initialIsOpen || false,
      inputValue: '',
    }
  })

  const id = `repick-${Date.now().toString(36)}`

  const focusFromRef = ref<HTMLElement>()
  const isMouseDownRef = ref<boolean>(false)
  const shouldFocusRef = ref<boolean>(false)
  const shouldBlurRef = ref<boolean>(true)
  const inputRef = ref<HTMLElement>()
  const toggleButtonRef = ref<HTMLElement>()
  const calendarRef = ref<HTMLElement>()
  const dateRefs = ref<Record<number, HTMLElement>>({})

  const onMouseDown = () => {
    isMouseDownRef.value = true
  }

  const onMouseUp = (e: MouseEvent) => {
    isMouseDownRef.value = false

    if (
      state.value.isOpen &&
      !(
        toggleButtonRef.value?.contains(e.target as HTMLElement) ||
        inputRef.value?.contains(e.target as HTMLElement) ||
        calendarRef.value?.contains(e.target as HTMLElement)
      )
    ) {
      dispatch({ type: 'CloseCalendar' })
    }
  }

  onMounted(() => {
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
  })

  onUnmounted(() => {
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
  })

  const setFocusWithIndex = (index: number) => {
    window.requestAnimationFrame(() => {
      if (dateRefs.value[index]) {
        shouldFocusRef.value = false
        dateRefs.value[index].focus()
      }
    })
  }

  const setFocusToCalendar = () => {
    window.requestAnimationFrame(() => {
      if (dateRefs.value[state.value.highlightedIndex]) {
        dateRefs.value[state.value.highlightedIndex].focus()
      }
    })
  }

  watch(state, (state, oldState) => {
    if (shouldFocusRef.value === true && state.isOpen && !oldState.isOpen) {
      shouldFocusRef.value = false
      setFocusToCalendar()
    }
    if (shouldFocusRef.value === true && !state.isOpen && oldState.isOpen) {
      shouldFocusRef.value = false
      shouldBlurRef.value = true
      focusFromRef.value?.focus()
    }

    if (
      shouldFocusRef.value === true &&
      state.isOpen &&
      state.highlightedIndex !== oldState.highlightedIndex
    ) {
      shouldFocusRef.value = false

      setFocusWithIndex(state.highlightedIndex)
    }
  })

  const handleKeyDown = (e: KeyboardEvent) => {
    const action = keyToAction(e.key)

    if (action) {
      e.stopPropagation()
      e.preventDefault()
      shouldBlurRef.value = false
      shouldFocusRef.value = true
      dispatch(action)
    }
  }

  const getDialogProps = (): DialogProps => {
    return {
      'aria-modal': true,
      'aria-labelledby': `${id}-header`,
      role: 'dialog',
      onFocusout: e => {
        if (
          shouldBlurRef.value === false ||
          calendarRef.value?.contains(e.relatedTarget as HTMLElement)
        ) {
          shouldBlurRef.value = true
          return
        }

        const shouldBlur = !isMouseDownRef.value

        if (shouldBlur) {
          dispatch({ type: 'CloseCalendar' })
        }
      },
      onKeydown: handleKeyDown,
      tabIndex: 0,
      ref: ref => {
        calendarRef.value = (ref as HTMLElement) || undefined
      },
    }
  }

  const getLabelProps = (): LabelProps => {
    return {
      for: `${id}-input`,
    }
  }

  const getInputProps = (): InputProps => {
    return {
      id: `${id}-input`,
      onChange: e => {
        dispatch({
          type: actionInputChange,
          value: (e.currentTarget as HTMLInputElement).value,
        })
      },
      onBlur: () => {
        if (shouldBlurRef.value === false) {
          shouldBlurRef.value = true
          return
        }

        const shouldBlur = !isMouseDownRef.value

        if (shouldBlur) {
          dispatch({ type: actionInputBlur })
        }
      },
      onFocus: () => {
        dispatch({
          type: actionInputFocus,
        })
      },
      onKeydown: e => {
        if (e.key === 'ArrowDown') {
          focusFromRef.value = e.target as HTMLElement
          shouldBlurRef.value = false
          shouldFocusRef.value = true
          dispatch({
            type: actionInputKeyArrowDown,
          })
          setFocusToCalendar()
        }
        if (e.key === 'Enter') {
          dispatch({
            type: actionInputKeyEnter,
          })
        }
      },
      readOnly: !props.allowInput,
      ref: ref => {
        inputRef.value = (ref as HTMLElement) || undefined
      },
      type: 'text',
      value: state.value.inputValue,
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
      onKeydown: handleKeyDown,
      role: 'grid',
    }
  }

  const getToggleButtonProps = (): ToggleButtonProps => {
    return {
      'aria-label': 'Choose Date',
      onClick: e => {
        if (state.value.isOpen) {
          shouldBlurRef.value = false
          dispatch({
            type: actionCloseCalendar,
          })
        } else {
          focusFromRef.value = e.target as HTMLElement
          shouldFocusRef.value = true
          dispatch({
            type: actionOpenCalendar,
          })
        }
      },
      ref: ref => {
        toggleButtonRef.value = (ref as HTMLElement) || undefined
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
      onMouseover: () => {
        dispatch({ type: actionDateMouseOver, index: calendarDay.index })
      },
      'aria-label': calendarDay.date.toDateString(),
      'aria-pressed': calendarDay.selected,
      'aria-selected': calendarDay.selected,
      role: 'button',
      tabIndex: calendarDay.highlighted ? 0 : -1,
      ref: ref => {
        if (ref) {
          dateRefs.value[calendarDay.index] = (ref as HTMLElement) || undefined
        }
      },
    }
  }

  const closeCalendar = () => dispatch({ type: actionCloseCalendar })

  const endOfWeek = () => dispatch({ type: actionEndOfWeek })

  const nextDay = () => dispatch({ type: actionNextDay })

  const nextMonth = () => dispatch({ type: actionNextMonth })

  const nextWeek = () => dispatch({ type: actionNextWeek })

  const nextYear = () => dispatch({ type: actionNextYear })

  const openCalendar = () => dispatch({ type: actionOpenCalendar })

  const prevDay = () => dispatch({ type: actionPrevDay })

  const prevMonth = () => dispatch({ type: actionPrevMonth })

  const prevWeek = () => dispatch({ type: actionPrevWeek })

  const prevYear = () => dispatch({ type: actionPrevYear })

  const selectCurrent = () => dispatch({ type: actionSelectHighlighted })

  const selectDate = (date: string | number | Date) =>
    dispatch({ type: actionSelectDate, date })

  const startOfWeek = () => dispatch({ type: actionStartOfWeek })

  return computed(() => ({
    ...buildContext(state.value, optionsFromProps(props)),
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
    startOfWeek,
  }))
}
