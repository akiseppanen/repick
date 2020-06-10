import { act, fireEvent, render, RenderResult } from '@testing-library/react'
import React from 'react'
import { RepickProps, RepickReturnValue } from '../src/core/types'
import { useDatePickerCore } from '../src/core'
import {
  keyToAction,
  RepickState,
  RepickOptions,
  RepickDay,
  RepickMonth,
  RepickAction,
} from '../src'
import { calendarFixture } from './fixtures/calendar'

jest.mock('repick-core')

const { mapDays } = jest.requireActual<{
  mapDays<D extends RepickDay<{}>, R>(
    months: RepickMonth<D>[],
    callbackfn: (day: D) => R,
  ): R[]
}>('repick-core')

const options: RepickOptions = {
  weekStartsOn: 1,
}
const mockedKeyToAction = keyToAction as jest.Mock
const mockedBuildCalendar = jest.fn()
const mockedReducer = jest.fn()
const mockedReducerInitializer = jest.fn(() => mockedReducer)

function setup(
  props: RepickProps<Date> = {},
  renderContent: (
    context: RepickReturnValue<Date, RepickDay<{}>>,
  ) => React.ReactElement | null = () => null,
): [RepickReturnValue<Date, RepickDay<{}>>, RenderResult] {
  const result: any = {}

  const Component = () => {
    const hookResult = useDatePickerCore<Date, RepickDay<{}>>({
      reducer: mockedReducerInitializer,
      buildContext: mockedBuildCalendar,
      ...props,
    })

    Object.assign(result, hookResult)

    return renderContent(hookResult)
  }

  const renderResult = render(<Component />)

  return [result!, renderResult]
}

describe('calendar', () => {
  const state: RepickState<Date> = {
    highlighted: calendarFixture.highlighted,
    selected: calendarFixture.selected,
  }

  beforeEach(() => {
    mockedReducer.mockReturnValue(state)
    mockedBuildCalendar.mockReturnValue(calendarFixture)
  })

  afterEach(() => {
    mockedReducer.mockReset()
    mockedBuildCalendar.mockReset()
  })

  it('object is passed', () => {
    const [result] = setup({
      initialHighlighted: calendarFixture.highlighted,
      initialSelected: calendarFixture.selected,
      ...options,
    })

    expect(mockedBuildCalendar).toHaveBeenCalledTimes(1)
    expect(mockedBuildCalendar).toHaveBeenCalledWith({ ...state, ...options })

    expect(result.highlighted).toEqual(calendarFixture.highlighted)
    expect(result.calendar).toEqual(calendarFixture.calendar)
    expect(result.month).toEqual(calendarFixture.month)
    expect(result.monthLong).toEqual(calendarFixture.monthLong)
    expect(result.monthShort).toEqual(calendarFixture.monthShort)
    expect(result.selected).toEqual(calendarFixture.selected)
    expect(result.weekdays).toEqual(calendarFixture.weekdays)
    expect(result.year).toEqual(calendarFixture.year)
  })

  it('stateReducer is passed correctly', () => {
    const stateReducer = jest.fn()

    setup({
      stateReducer,
      ...options,
    })

    expect(mockedReducerInitializer).toHaveBeenCalledWith(stateReducer)
  })

  it('date click dispatches correct action', () => {
    const [, view] = setup(
      {
        initialHighlighted: calendarFixture.highlighted,
        initialSelected: calendarFixture.selected,
      },
      ({ calendar, getDateProps }) => (
        <>
          {mapDays(calendar, calendarDay => (
            <button
              {...getDateProps(calendarDay)}
              key={calendarDay.date.toISOString()}
            >
              {calendarDay.day}
            </button>
          ))}
        </>
      ),
    )

    fireEvent.click(view.container.children[10])
    fireEvent.click(view.container.children[20])
    fireEvent.click(view.container.children[30])

    const { calendar } = calendarFixture

    expect(mockedReducer).toHaveBeenNthCalledWith(1, state, {
      date: calendar[0].weeks[1].days[3].date,
      type: 'DateClick',
    })

    expect(mockedReducer).toHaveBeenNthCalledWith(2, state, {
      date: calendar[0].weeks[2].days[6].date,
      type: 'DateClick',
    })

    expect(mockedReducer).toHaveBeenNthCalledWith(3, state, {
      date: calendar[0].weeks[4].days[2].date,
      type: 'DateClick',
    })
  })

  it('keyPress is handled correctly', () => {
    const [, view] = setup(
      {
        highlighted: calendarFixture.highlighted,
        selected: calendarFixture.selected,
      },
      ({ getCalendarProps }) => <div {...getCalendarProps()} />,
    )

    mockedKeyToAction.mockReturnValueOnce({ type: 'PrevDay' })
    fireEvent.keyDown(view.container.children[0], {
      key: 'ArrowLeft',
    })
    mockedKeyToAction.mockReturnValueOnce({ type: 'NextDay' })
    fireEvent.keyDown(view.container.children[0], {
      key: 'ArrowRight',
    })
    mockedKeyToAction.mockReturnValueOnce({ type: 'StartOfWeek' })
    fireEvent.keyDown(view.container.children[0], {
      key: 'Home',
    })
    mockedKeyToAction.mockReturnValueOnce(null)
    fireEvent.keyDown(view.container.children[0], {
      key: 'Escape',
    })

    expect(mockedKeyToAction).toHaveBeenCalledTimes(4)
    expect(mockedKeyToAction).toHaveBeenNthCalledWith(1, 'ArrowLeft')
    expect(mockedKeyToAction).toHaveBeenNthCalledWith(2, 'ArrowRight')
    expect(mockedKeyToAction).toHaveBeenNthCalledWith(3, 'Home')
    expect(mockedKeyToAction).toHaveBeenNthCalledWith(4, 'Escape')

    expect(mockedReducer).toHaveBeenCalledTimes(3)
    expect(mockedReducer).toHaveBeenNthCalledWith(1, state, { type: 'PrevDay' })
    expect(mockedReducer).toHaveBeenNthCalledWith(2, state, { type: 'NextDay' })
    expect(mockedReducer).toHaveBeenNthCalledWith(3, state, {
      type: 'StartOfWeek',
    })

    mockedKeyToAction.mockReset()
  })

  it('prevMonth and nextMonth click dispatches correct action', () => {
    const [, view] = setup(
      {
        initialHighlighted: calendarFixture.highlighted,
        initialSelected: calendarFixture.selected,
      },
      ({ getPrevMonthProps, getNextMonthProps }) => (
        <>
          <button {...getPrevMonthProps()} />
          <button {...getNextMonthProps()} />
        </>
      ),
    )

    fireEvent.click(view.container.children[0])
    fireEvent.click(view.container.children[1])

    expect(mockedReducer).toHaveBeenNthCalledWith(1, state, {
      type: 'PrevMonth',
    })

    expect(mockedReducer).toHaveBeenNthCalledWith(2, state, {
      type: 'NextMonth',
    })
  })
})

it('dispatch', () => {
  const date = new Date('2018-01-01 00:00:00')
  const expected = new Date('2018-01-10 00:00:00')

  const state: RepickState<Date> = {
    highlighted: date,
    selected: null,
    ...options,
  }

  mockedBuildCalendar.mockImplementation(s => ({
    highlighted: s.highlighted,
    selected: s.selected,
  }))

  mockedReducer.mockReturnValue({
    highlighted: expected,
    selected: expected,
  })

  const onChange = jest.fn()

  const [results] = setup({
    onChange,
    initialHighlighted: date,
    ...options,
  })

  expect(results.highlighted).toEqual(date)
  expect(results.selected).toBeNull()

  act(() => results.selectDate(expected))

  expect(mockedReducer).toHaveBeenCalledWith(state, {
    date: expected,
    type: 'SelectDate',
  })

  expect(results.highlighted).toEqual(expected)
  expect(results.selected).toEqual(expected)

  expect(onChange).toHaveBeenCalledWith(expected)
})

describe('actions', () => {
  const highlighted = new Date('2018-01-01 00:00:00')
  const expected = new Date('2018-01-10 00:00:00')

  let results: RepickReturnValue<Date, RepickDay<{}>>

  beforeEach(() => {
    results = setup({ highlighted })[0]
    mockedReducer.mockReturnValue({ highlighted: expected, selected: expected })
  })

  afterEach(() => {
    mockedReducer.mockReset()
  })

  const assertAction = (action: RepickAction) => {
    expect(mockedReducer).toHaveBeenCalledWith(
      { highlighted, selected: null },
      action,
    )
  }
  it('selectDate', () => {
    act(() => results.selectDate(expected))

    assertAction({
      date: expected,
      type: 'SelectDate',
    })
  })
  it('selectCurrent', () => {
    act(() => results.selectCurrent())

    assertAction({
      type: 'SelectHighlighted',
    })
  })

  it('prevDay', () => {
    act(() => results.prevDay())

    assertAction({
      type: 'PrevDay',
    })
  })

  it('nextDay', () => {
    act(() => results.nextDay())

    assertAction({
      type: 'NextDay',
    })
  })

  it('prevWeek', () => {
    act(() => results.prevWeek())

    assertAction({
      type: 'PrevWeek',
    })
  })

  it('nextWeek', () => {
    act(() => results.nextWeek())

    assertAction({
      type: 'NextWeek',
    })
  })

  it('prevMonth', () => {
    act(() => results.prevMonth())

    assertAction({
      type: 'PrevMonth',
    })
  })

  it('nextMonth', () => {
    act(() => results.nextMonth())

    assertAction({
      type: 'NextMonth',
    })
  })

  it('startOfWeek', () => {
    act(() => results.startOfWeek())

    assertAction({
      type: 'StartOfWeek',
    })
  })

  it('endOfWeek', () => {
    act(() => results.endOfWeek())

    assertAction({
      type: 'EndOfWeek',
    })
  })
})
