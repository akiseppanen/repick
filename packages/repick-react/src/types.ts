import {
  RepickCalendarContextGeneric,
  RepickCalendarContextMulti,
  RepickCalendarContextRange,
  RepickCalendarContextSingle,
  RepickDayContext,
  RepickDayContextMulti,
  RepickDayContextRange,
  RepickDayContextSingle,
  RepickWeekContext,
  RepickOptions,
} from 'repick-core'

export type CalendarProps = {
  onKeyDown: (e: React.KeyboardEvent) => void
  tabIndex: number
}

export type MonthProps = {
  onClick: (e: React.MouseEvent) => void
  'aria-label': string
  role: string
}

export type DateProps = {
  onClick: (e: React.MouseEvent) => void
  'aria-label': string
  'aria-pressed': boolean
  role: string
  tabIndex: number
  ref: (el: HTMLElement | null) => void
}

export type RepickDayHelpers = {
  select: () => void
  setFocus: () => void
  getProps: () => void
}

export type RepickWeekHelpers<D extends RepickDayContext<{}>> = {
  mapDays: <R>(callbackfn: (repickDayContext: D) => R) => R[]
}

export type RepickMonthHelpers<D extends RepickDayContext<{}>> = {
  mapDays: <R>(callbackfn: (repickDayContext: D) => R) => R[]
  mapWeeks: <R>(
    callbackfn: (
      repickWeekContext: RepickWeekContext<D> & RepickWeekHelpers<D>,
    ) => R,
  ) => R[]
}

export type RepickHelpers<D extends RepickDayContext<{}>> = {
  selectDate: (date: string | number | Date) => void
  selectCurrent: () => void
  prevDay: () => void
  nextDay: () => void
  prevWeek: () => void
  nextWeek: () => void
  prevMonth: () => void
  nextMonth: () => void
  startOfWeek: () => void
  endOfWeek: () => void
  getCalendarProps: () => CalendarProps
  getDateProps: (repickDayContext: D) => DateProps
  getNextMonthProps: () => MonthProps
  getPrevMonthProps: () => MonthProps
  handleKeyDown: (e: React.KeyboardEvent) => void
  setFocusToCalendar: () => void
  setFocusToDate: (date: Date) => void
}

export type RepickContextGeneric<
  M,
  T,
  D extends RepickDayContext<{}>
> = RepickCalendarContextGeneric<M, T, D> & RepickHelpers<D>

export type RepickContextSingle = RepickCalendarContextSingle &
  RepickHelpers<RepickDayContextSingle>

export type RepickContextMulti = RepickCalendarContextMulti &
  RepickHelpers<RepickDayContextMulti>

export type RepickContextRange = RepickCalendarContextRange &
  RepickHelpers<RepickDayContextRange>

export type RepickContext =
  | RepickContextSingle
  | RepickContextMulti
  | RepickContextRange

export type RepickPropsGeneric<M, T> = RepickOptions & {
  mode?: M
  onChange?: (date: T | null) => void
  onCurrentChange?: (date: Date) => void
  current?: Date
  initialDate?: Date
  selected?: T | null
  initialSelected?: T
}

export type PropsGenericRequireMode<M, T> = RepickPropsGeneric<M, T> & {
  mode: M
}

export type RepickPropsSingle = RepickPropsGeneric<'single', Date>
export type RepickPropsMulti = PropsGenericRequireMode<'multi', Date[]>
export type RepickPropsRange = PropsGenericRequireMode<'range', [Date, Date?]>

export type RepickProps =
  | RepickPropsSingle
  | RepickPropsMulti
  | RepickPropsRange

export type RepickPropsWithChildrenGeneric<
  M,
  T,
  D extends RepickDayContext<{}>
> = RepickPropsGeneric<M, T> & {
  render: (context: RepickContextGeneric<M, T, D>) => React.ReactElement | null
}

export type RepickPropsWithChildrenGenericRequireMode<
  M,
  T,
  D extends RepickDayContext<{}>
> = PropsGenericRequireMode<M, T> & {
  render: (context: RepickContextGeneric<M, T, D>) => React.ReactElement | null
}

export type RepickPropsWithChildrenSingle = RepickPropsWithChildrenGeneric<
  'single',
  Date,
  RepickDayContextSingle
>
export type RepickPropsWithChildrenMulti = RepickPropsWithChildrenGenericRequireMode<
  'multi',
  Date[],
  RepickDayContextMulti
>
export type RepickPropsWithChildrenRange = RepickPropsWithChildrenGenericRequireMode<
  'range',
  [Date, Date?],
  RepickDayContextRange
>

export type RepickPropsWithChildren =
  | RepickPropsWithChildrenSingle
  | RepickPropsWithChildrenMulti
  | RepickPropsWithChildrenRange
