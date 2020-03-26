import '@testing-library/jest-dom/extend-expect'
import { act, fireEvent, render, RenderResult } from '@testing-library/react'
import React from 'react'
import Repick, {
  Action,
  buildCalendarContext,
  keyToAction,
  RepickOptions,
  RepickPropsSingle,
  reducer,
  RepickContextSingle,
  RepickState,
} from '../src'
import { calendarFixture } from './fixtures/calendar'
import { mapDays } from 'repick-core/src/utils'
jest.mock('repick-core')

const options: RepickOptions = {
  weekStartsOn: 6,
}

function setup(
  repickProps: RepickPropsSingle = {},
  renderProp: (
    context: RepickContextSingle,
  ) => React.ReactElement | null = () => null,
): [RepickContextSingle, RenderResult] {
  const childProps: any = {}
  const renderResult = render(
    <Repick
      {...repickProps}
      render={(context: RepickContextSingle) => {
        Object.assign(childProps, context)
        return renderProp(context)
      }}
    />,
  )

  return [childProps!, renderResult]
}

const mockedBuildCalendar = buildCalendarContext as jest.Mock
const mockedReducer = reducer as jest.Mock
const mockedKeyToAction = keyToAction as jest.Mock

describe('calendar', () => {
  const state: RepickState = {
    date: calendarFixture.date,
    mode: 'single',
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
    const [props] = setup({
      initialDate: calendarFixture.date || undefined,
      initialSelected: calendarFixture.selected || undefined,

      ...options,
    })

    expect(mockedBuildCalendar).toHaveBeenCalledTimes(1)
    expect(mockedBuildCalendar).toHaveBeenCalledWith({ ...state, ...options })

    expect(props.date).toEqual(calendarFixture.date)
    expect(props.calendar).toEqual(calendarFixture.calendar)
    expect(props.month).toEqual(calendarFixture.month)
    expect(props.monthLong).toEqual(calendarFixture.monthLong)
    expect(props.monthShort).toEqual(calendarFixture.monthShort)
    expect(props.selected).toEqual(calendarFixture.selected)
    expect(props.weekdays).toEqual(calendarFixture.weekdays)
    expect(props.year).toEqual(calendarFixture.year)
  })

  it('date click dispatches correct action', () => {
    const [, view] = setup(
      {
        initialDate: calendarFixture.date || undefined,
        initialSelected: calendarFixture.selected || undefined,
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
      type: 'SelectDate',
    })

    expect(mockedReducer).toHaveBeenNthCalledWith(2, state, {
      date: calendar[0].weeks[2].days[6].date,
      type: 'SelectDate',
    })

    expect(mockedReducer).toHaveBeenNthCalledWith(3, state, {
      date: calendar[0].weeks[4].days[2].date,
      type: 'SelectDate',
    })
  })

  it('keyPress is handled correctly', () => {
    const [, view] = setup(
      {
        date: calendarFixture.date || undefined,
        selected: calendarFixture.selected || undefined,
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
        initialDate: calendarFixture.date || undefined,
        initialSelected: calendarFixture.selected || undefined,
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

  const state: RepickState = {
    date,
    mode: 'single',
    selected: null,
    ...options,
  }

  mockedBuildCalendar.mockImplementation(s => ({
    date: s.date,
    selected: s.selected,
  }))

  mockedReducer.mockReturnValue({
    date: expected,
    mode: 'single',
    selected: expected,
  })

  const onChange = jest.fn()

  const [props] = setup({ onChange, initialDate: date, ...options })

  expect(props.date).toEqual(date)
  expect(props.selected).toBeNull()

  act(() => props.selectDate(expected))

  expect(mockedReducer).toHaveBeenCalledWith(state, {
    date: expected,
    type: 'SelectDate',
  })

  expect(props.date).toEqual(expected)
  expect(props.selected).toEqual(expected)

  expect(onChange).toHaveBeenCalledWith(expected)
})

describe('actions', () => {
  const date = new Date('2018-01-01 00:00:00')
  const expected = new Date('2018-01-10 00:00:00')

  let props: RepickContextSingle

  beforeEach(() => {
    props = setup({ date })[0]
    mockedReducer.mockReturnValue({ date: expected, selected: expected })
  })

  afterEach(() => {
    mockedReducer.mockReset()
  })

  const assertAction = (action: Action) => {
    expect(mockedReducer).toHaveBeenCalledWith(
      { date, selected: null, mode: 'single' },
      action,
    )
  }
  it('selectDate', () => {
    act(() => props.selectDate(expected))

    assertAction({
      date: expected,
      type: 'SelectDate',
    })
  })
  it('selectCurrent', () => {
    act(() => props.selectCurrent())

    assertAction({
      type: 'SelectCurrent',
    })
  })

  it('prevDay', () => {
    act(() => props.prevDay())

    assertAction({
      type: 'PrevDay',
    })
  })

  it('nextDay', () => {
    act(() => props.nextDay())

    assertAction({
      type: 'NextDay',
    })
  })

  it('prevWeek', () => {
    act(() => props.prevWeek())

    assertAction({
      type: 'PrevWeek',
    })
  })

  it('nextWeek', () => {
    act(() => props.nextWeek())

    assertAction({
      type: 'NextWeek',
    })
  })

  it('prevMonth', () => {
    act(() => props.prevMonth())

    assertAction({
      type: 'PrevMonth',
    })
  })

  it('nextMonth', () => {
    act(() => props.nextMonth())

    assertAction({
      type: 'NextMonth',
    })
  })

  it('startOfWeek', () => {
    act(() => props.startOfWeek())

    assertAction({
      type: 'StartOfWeek',
    })
  })

  it('endOfWeek', () => {
    act(() => props.endOfWeek())

    assertAction({
      type: 'EndOfWeek',
    })
  })
})
