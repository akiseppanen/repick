import { fireEvent, render, RenderResult } from '@testing-library/vue'
import format from 'date-fns/format'
import { defineComponent, h, nextTick } from 'vue'
import {
  RepickProps,
  RepickReturnValue,
  RepickStateChangeOptions,
} from '../src/core/types'
import { useDatePickerCore } from '../src/core'
import {
  getHighlightedDate,
  getHighlightedIndexForDate,
  keyToAction,
  RepickState,
  RepickOptions,
  RepickDay,
  RepickAction,
  objectCopyPartial,
} from '../src'
import { calendarFixture } from './fixtures/calendar'

jest.mock('@repick/core')

const options: RepickOptions<Date> = {
  weekStartsOn: 1,
}

const mockedGetHighlightedDate = getHighlightedDate as jest.Mock
const mockedGetHighlightedIndexForDate = getHighlightedIndexForDate as jest.Mock
const mockedKeyToAction = keyToAction as jest.Mock
const mockedObjectCopyPartial = objectCopyPartial as jest.Mock
const mockedBuildCalendar = jest.fn()
const mockedReducer = jest.fn()

mockedGetHighlightedDate.mockImplementation(
  jest.requireActual('@repick/core').getHighlightedDate,
)
mockedGetHighlightedIndexForDate.mockImplementation(
  jest.requireActual('@repick/core').getHighlightedIndexForDate,
)
mockedObjectCopyPartial.mockImplementation(
  jest.requireActual('@repick/core').objectCopyPartial,
)

function setup(
  props: RepickProps<Date> = {},
  renderContent: (
    context: RepickReturnValue<Date, RepickDay<{}>>,
  ) => any = () => null,
): [RepickReturnValue<Date, RepickDay<{}>>, RenderResult] {
  const result: any = {}

  const Component = defineComponent({
    setup() {
      const datePicker = useDatePickerCore<Date, RepickDay<{}>>({
        reducer: mockedReducer,
        buildContext: mockedBuildCalendar,
        ...props,
      })

      return { datePicker }
    },
    render() {
      Object.assign(result, this.datePicker)

      return renderContent(this.datePicker)
    },
  })

  const renderResult = render(Component)

  return [result!, renderResult]
}

describe('calendar', () => {
  const state: RepickState<Date> = {
    activeDate: calendarFixture.activeDate,
    highlightedIndex: calendarFixture.highlightedIndex,
    selected: calendarFixture.selected,
    isOpen: false,
    inputValue: '',
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
      initialActiveDate: calendarFixture.activeDate,
      initialSelected: calendarFixture.selected,
      ...options,
    })

    expect(mockedBuildCalendar).toHaveBeenCalledTimes(1)
    expect(mockedBuildCalendar).toHaveBeenCalledWith(state, options)

    expect(result.activeDate).toEqual(calendarFixture.activeDate)
    expect(result.highlightedIndex).toEqual(calendarFixture.highlightedIndex)
    expect(result.days).toEqual(calendarFixture.days)
    expect(result.month).toEqual(calendarFixture.month)
    expect(result.monthLong).toEqual(calendarFixture.monthLong)
    expect(result.monthShort).toEqual(calendarFixture.monthShort)
    expect(result.selected).toEqual(calendarFixture.selected)
    expect(result.weekdays).toEqual(calendarFixture.weekdays)
    expect(result.year).toEqual(calendarFixture.year)
  })

  it('date click dispatches correct action', () => {
    const [, view] = setup(
      {
        initialActiveDate: calendarFixture.activeDate,
        initialSelected: calendarFixture.selected,
        ...options,
      },
      ({ days, getDateProps }) =>
        days.map(calendarDay =>
          h('button', getDateProps(calendarDay), calendarDay.day),
        ),
    )

    fireEvent.click(view.container.children[10])
    fireEvent.click(view.container.children[20])
    fireEvent.click(view.container.children[30])

    const { days } = calendarFixture

    expect(mockedReducer).toHaveBeenNthCalledWith(
      1,
      state,
      {
        date: days[10].date,
        type: 'DateClick',
      },
      options,
    )

    expect(mockedReducer).toHaveBeenNthCalledWith(
      2,
      state,
      {
        date: days[20].date,
        type: 'DateClick',
      },
      options,
    )

    expect(mockedReducer).toHaveBeenNthCalledWith(
      3,
      state,
      {
        date: days[30].date,
        type: 'DateClick',
      },
      options,
    )
  })

  it('date hover dispatches correct action', () => {
    const [, view] = setup(
      {
        initialActiveDate: calendarFixture.activeDate,
        initialSelected: calendarFixture.selected,
        ...options,
      },
      ({ days, getDateProps }) =>
        days.map(calendarDay =>
          h('button', {
            ...getDateProps(calendarDay),
            key: calendarDay.date.toISOString(),
          }),
        ),
    )

    fireEvent.mouseOver(view.container.children[10])
    fireEvent.mouseOver(view.container.children[20])
    fireEvent.mouseOver(view.container.children[30])

    expect(mockedReducer).toHaveBeenNthCalledWith(
      1,
      state,
      {
        index: 10,
        type: 'DateMouseOver',
      },
      options,
    )

    expect(mockedReducer).toHaveBeenNthCalledWith(
      2,
      state,
      {
        index: 20,
        type: 'DateMouseOver',
      },
      options,
    )

    expect(mockedReducer).toHaveBeenNthCalledWith(
      3,
      state,
      {
        index: 30,
        type: 'DateMouseOver',
      },
      options,
    )
  })

  it('keyPress is handled correctly', () => {
    const [, view] = setup(
      {
        initialActiveDate: calendarFixture.activeDate,
        initialSelected: calendarFixture.selected,
        ...options,
      },
      ({ getDialogProps }) => [h('div', getDialogProps())],
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
    expect(mockedReducer).toHaveBeenNthCalledWith(
      1,
      state,
      { type: 'PrevDay' },
      options,
    )
    expect(mockedReducer).toHaveBeenNthCalledWith(
      2,
      state,
      { type: 'NextDay' },
      options,
    )
    expect(mockedReducer).toHaveBeenNthCalledWith(
      3,
      state,
      {
        type: 'StartOfWeek',
      },
      options,
    )

    mockedKeyToAction.mockReset()
  })

  it('prevMonth and nextMonth click dispatches correct action', () => {
    const [, view] = setup(
      {
        initialActiveDate: calendarFixture.activeDate,
        initialSelected: calendarFixture.selected,
        ...options,
      },
      ({ getPrevMonthProps, getNextMonthProps }) => [
        h('button', getPrevMonthProps()),
        h('button', getNextMonthProps()),
      ],
    )

    fireEvent.click(view.container.children[0])
    fireEvent.click(view.container.children[1])

    expect(mockedReducer).toHaveBeenNthCalledWith(
      1,
      state,
      {
        type: 'PrevMonth',
      },
      options,
    )

    expect(mockedReducer).toHaveBeenNthCalledWith(
      2,
      state,
      {
        type: 'NextMonth',
      },
      options,
    )
  })
})

it('dispatch', async () => {
  const date = new Date('2018-01-01 00:00:00')
  const expected = new Date('2018-01-10 00:00:00')

  const state: RepickState<Date> = {
    activeDate: date,
    highlightedIndex: 0,
    selected: null,
    isOpen: false,
    inputValue: '',
  }

  mockedBuildCalendar.mockImplementation(s => ({
    activeDate: s.activeDate,
    selected: s.selected,
  }))

  mockedReducer.mockReturnValue({
    activeDate: expected,
    highlightedIndex: 10,
    selected: expected,
  })

  const onSelectedChange = jest.fn()

  const [results] = setup({
    onSelectedChange,
    initialActiveDate: date,
    ...options,
  })

  expect(results.activeDate).toEqual(date)
  expect(results.selected).toBeNull()

  results.selectDate(expected)

  expect(mockedReducer).toHaveBeenCalledWith(
    state,
    {
      date: expected,
      type: 'SelectDate',
    },
    options,
  )

  await nextTick()

  expect(results.activeDate).toEqual(expected)
  expect(results.selected).toEqual(expected)

  expect(onSelectedChange).toHaveBeenCalledWith(expected)
})

it('StateReducer', async () => {
  const state: RepickState<Date> = {
    activeDate: calendarFixture.activeDate,
    highlightedIndex: calendarFixture.highlightedIndex,
    selected: calendarFixture.selected,
    isOpen: false,
    inputValue: '',
  }

  const inputDate = new Date('2018-01-10 12:00:00')
  const expectedDate = new Date('2018-01-10 00:00:00')

  const expectedChanges = {
    activeDate: expectedDate,
    inputValue: format(expectedDate, 'yyyy-MM-dd'),
    isOpen: false,
    selected: expectedDate,
  }

  const mockedStateReducer = jest.fn<
    RepickState<Date>,
    [RepickState<Date>, RepickStateChangeOptions<Date>]
  >(() => ({ ...state, ...expectedChanges }))

  const [results] = setup({
    initialActiveDate: calendarFixture.activeDate,
    initialSelected: calendarFixture.selected,
    stateReducer: mockedStateReducer,
    ...options,
  })

  mockedReducer.mockReturnValueOnce({
    activeDate: inputDate,
    highlightedIndex: 9,
    inputValue: format(inputDate, 'yyyy-MM-dd'),
    isOpen: false,
    selected: inputDate,
  })

  mockedBuildCalendar.mockImplementationOnce(s => ({
    activeDate: s.activeDate,
    selected: s.selected,
  }))

  results.selectDate(inputDate)

  await nextTick()

  expect(results.activeDate).toEqual(expectedDate)
  expect(results.selected).toEqual(expectedDate)

  expect(mockedStateReducer).toHaveBeenCalledWith(state, {
    action: {
      date: inputDate,
      type: 'SelectDate',
    },
    changes: {
      activeDate: inputDate,
      highlightedIndex: 9,
      inputValue: format(inputDate, 'yyyy-MM-dd'),
      isOpen: false,
      selected: inputDate,
    },
    options,
  })
})

describe('actions', () => {
  const date = new Date('2018-01-01 00:00:00')
  const expected = new Date('2018-01-10 00:00:00')

  let results: RepickReturnValue<Date, RepickDay<{}>>

  beforeEach(() => {
    results = setup({ initialActiveDate: date })[0]
  })

  afterEach(() => {
    mockedReducer.mockReset()
  })

  const assertAction = (action: RepickAction) => {
    expect(mockedReducer).toHaveBeenCalledWith(
      {
        activeDate: date,
        highlightedIndex: 1,
        selected: null,
        isOpen: false,
        inputValue: '',
      },
      action,
      {},
    )
  }

  it('selectDate', () => {
    results.selectDate(expected)

    assertAction({
      date: expected,
      type: 'SelectDate',
    })
  })
  it('selectCurrent', () => {
    results.selectCurrent()

    assertAction({
      type: 'SelectHighlighted',
    })
  })

  it('prevDay', () => {
    results.prevDay()

    assertAction({
      type: 'PrevDay',
    })
  })

  it('nextDay', () => {
    results.nextDay()

    assertAction({
      type: 'NextDay',
    })
  })

  it('prevWeek', () => {
    results.prevWeek()

    assertAction({
      type: 'PrevWeek',
    })
  })

  it('nextWeek', () => {
    results.nextWeek()

    assertAction({
      type: 'NextWeek',
    })
  })

  it('prevMonth', () => {
    results.prevMonth()

    assertAction({
      type: 'PrevMonth',
    })
  })

  it('nextMonth', () => {
    results.nextMonth()

    assertAction({
      type: 'NextMonth',
    })
  })

  it('prevYear', () => {
    results.prevYear()

    assertAction({
      type: 'PrevYear',
    })
  })

  it('nextYear', () => {
    results.nextYear()

    assertAction({
      type: 'NextYear',
    })
  })

  it('startOfWeek', () => {
    results.startOfWeek()

    assertAction({
      type: 'StartOfWeek',
    })
  })

  it('endOfWeek', () => {
    results.endOfWeek()

    assertAction({
      type: 'EndOfWeek',
    })
  })
})
