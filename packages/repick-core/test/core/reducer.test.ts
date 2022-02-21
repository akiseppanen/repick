import format from 'date-fns/format'
import parse from 'date-fns/parse'
import { createReducer } from '../../src/core/reducer'
import { RepickOptions, RepickState } from '../../src/core/types'
import {
  dateIsSelectable,
  getHighlightedDate,
  wrapWeekDay,
  defaultOptions,
  getHighlightedIndexForDate,
} from '../../src/utils'
import { RepickAction } from '../../src/actions'

jest.mock('../../src/utils')

const mockedDateIsSelectable = dateIsSelectable as jest.Mock<
  boolean,
  [RepickOptions<Date>, Date]
>
const mockedWrapWeekDay = wrapWeekDay as jest.Mock<number, [number]>
mockedWrapWeekDay.mockImplementation(
  jest.requireActual('../../src/utils').wrapWeekDay,
)
const mockedGetHighlightedDate = getHighlightedDate as jest.Mock<
  Date,
  [Date, number, RepickOptions<Date>]
>
mockedGetHighlightedDate.mockImplementation(
  jest.requireActual('../../src/utils').getHighlightedDate,
)
const mockedGetHighlightedIndexForDate = getHighlightedIndexForDate as jest.Mock<
  number,
  [Date, Date, RepickOptions<Date>]
>
mockedGetHighlightedIndexForDate.mockImplementation(
  jest.requireActual('../../src/utils').getHighlightedIndexForDate,
)

describe('reducerGeneric', () => {
  const selected = new Date('2018-01-05 00:00:00')
  const activeDate = new Date('2018-01-01 00:00:00')
  const highlightedIndex = 1

  const state: RepickState<Date> = {
    activeDate,
    highlightedIndex,
    inputValue: format(selected, 'yyyy-MM-dd'),
    isOpen: false,
    selected,
  }

  const mockedSelectDate = jest.fn<[Date, boolean], [Date | null, Date]>()
  const mockedFormat = jest.fn<string, [Date | null, string]>((a, b) =>
    a ? format(a, b) : '',
  )
  const mockedParse = jest.fn<Date, [string, string]>((dateString, format) =>
    parse(dateString, format, new Date('2018-01-01 00:00:00')),
  )

  const reducer = createReducer<Date>(
    mockedSelectDate,
    mockedFormat,
    mockedParse,
  )

  mockedDateIsSelectable.mockReturnValue(true)

  const assertAction = (
    action: RepickAction,
    expectedChanges: Partial<RepickState<Date>>,
    options: RepickOptions<Date> = {},
  ) => {
    const newState = reducer(state, action, options)

    expect(newState).toEqual(expectedChanges)
  }

  it('SelectDate', () => {
    const expectedDate = new Date('2018-01-10 00:00:00')

    mockedSelectDate.mockReturnValue([expectedDate, true])

    assertAction(
      {
        date: expectedDate,
        type: 'SelectDate',
      },
      {
        activeDate: expectedDate,
        highlightedIndex: 10,
        selected: expectedDate,
        inputValue: format(expectedDate, 'yyyy-MM-dd'),
        isOpen: false,
      },
    )

    expect(mockedSelectDate).toHaveBeenCalledWith(selected, expectedDate)
  })

  it('SelectDate: unselectable', () => {
    mockedDateIsSelectable.mockReturnValueOnce(false)

    const date = new Date('2018-01-05 00:00:00')

    assertAction(
      {
        date: date,
        type: 'SelectDate',
      },
      {},
    )
    expect(mockedDateIsSelectable).toHaveBeenCalledWith(defaultOptions, date)
  })

  it('DateClick', () => {
    const expectedDate = new Date('2018-01-10 00:00:00')

    mockedSelectDate.mockReturnValue([expectedDate, true])

    assertAction(
      {
        date: expectedDate,
        type: 'DateClick',
      },
      {
        activeDate: expectedDate,
        highlightedIndex: 10,
        selected: expectedDate,
        inputValue: format(expectedDate, 'yyyy-MM-dd'),
        isOpen: false,
      },
    )

    expect(mockedSelectDate).toHaveBeenCalledWith(selected, expectedDate)
  })

  it('DateClick: unselectable', () => {
    mockedDateIsSelectable.mockReturnValueOnce(false)

    const date = new Date('2018-01-05 00:00:00')

    assertAction(
      {
        date: date,
        type: 'DateClick',
      },
      {},
    )
    expect(mockedDateIsSelectable).toHaveBeenCalledWith(defaultOptions, date)
  })

  it('DateMouseOver', () => {
    const highlightedIndex = 10

    assertAction(
      {
        index: highlightedIndex,
        type: 'DateMouseOver',
      },
      { highlightedIndex },
    )
    assertAction(
      {
        index: highlightedIndex,
        type: 'DateMouseOver',
      },
      {},
      { updateHighlightedOnHover: false },
    )
  })

  it('SelectHighlighted', () => {
    mockedSelectDate.mockReturnValueOnce([activeDate, true])
    assertAction(
      {
        type: 'KeyEnter',
      },
      {
        activeDate,
        selected: activeDate,
        highlightedIndex,
        inputValue: format(activeDate, 'yyyy-MM-dd'),
        isOpen: false,
      },
    )
    expect(mockedSelectDate).toHaveBeenCalledWith(selected, activeDate)
  })

  it('SelecthighlightedIndex: unselectable', () => {
    mockedDateIsSelectable.mockReturnValueOnce(false)

    assertAction(
      {
        type: 'SelectHighlighted',
      },
      {},
    )
    expect(mockedDateIsSelectable).toHaveBeenCalledWith(
      defaultOptions,
      activeDate,
    )
  })

  it('ArrowLeft', () => {
    assertAction(
      {
        type: 'KeyArrowLeft',
      },
      {
        activeDate: new Date('2017-12-31 00:00:00'),
        highlightedIndex: 35,
      },
    )
  })

  it('ArrowRight', () => {
    assertAction(
      {
        type: 'KeyArrowRight',
      },
      {
        activeDate: new Date('2018-01-02 00:00:00'),
        highlightedIndex: 2,
      },
    )
  })

  it('ArrowUp', () => {
    assertAction(
      {
        type: 'KeyArrowUp',
      },
      {
        activeDate: new Date('2017-12-25 00:00:00'),
        highlightedIndex: 29,
      },
    )
  })

  it('ArrowDown', () => {
    assertAction(
      {
        type: 'KeyArrowDown',
      },
      {
        activeDate: new Date('2018-01-08 00:00:00'),
        highlightedIndex: 8,
      },
    )
  })

  it('PageDown', () => {
    assertAction(
      {
        type: 'KeyPageDown',
      },
      {
        activeDate: new Date('2017-12-01 00:00:00'),
        highlightedIndex: 5,
      },
    )
  })

  it('PageUp', () => {
    assertAction(
      {
        type: 'KeyPageUp',
      },
      {
        activeDate: new Date('2018-02-01 00:00:00'),
        highlightedIndex: 4,
      },
    )
  })

  it('Home', () => {
    assertAction(
      {
        type: 'KeyHome',
      },
      {
        activeDate: new Date('2017-12-31 00:00:00'),
        highlightedIndex: 35,
      },
    )
  })

  it('End', () => {
    assertAction(
      {
        type: 'KeyEnd',
      },
      {
        activeDate: new Date('2018-01-06 00:00:00'),
        highlightedIndex: 6,
      },
    )
  })

  it('Shift + PageDown', () => {
    assertAction(
      {
        type: 'KeyShiftPageDown',
      },
      {
        activeDate: new Date('2017-01-01 00:00:00'),
        highlightedIndex: 0,
      },
    )
  })

  it('Shift + PageUp', () => {
    assertAction(
      {
        type: 'KeyShiftPageUp',
      },
      {
        activeDate: new Date('2019-01-01 00:00:00'),
        highlightedIndex: 2,
      },
    )
  })

  it('PrevDay', () => {
    assertAction(
      {
        type: 'PrevDay',
      },
      {
        activeDate: new Date('2017-12-31 00:00:00'),
        highlightedIndex: 35,
      },
    )
  })

  it('KeyEnter', () => {
    mockedSelectDate.mockReturnValueOnce([activeDate, true])
    assertAction(
      {
        type: 'KeyEnter',
      },
      {
        activeDate,
        selected: activeDate,
        highlightedIndex,
        inputValue: format(activeDate, 'yyyy-MM-dd'),
        isOpen: false,
      },
    )
    expect(mockedSelectDate).toHaveBeenCalledWith(selected, activeDate)
  })

  it('NextDay', () => {
    assertAction(
      {
        type: 'NextDay',
      },
      {
        activeDate: new Date('2018-01-02 00:00:00'),
        highlightedIndex: 2,
      },
    )
  })

  it('PrevWeek', () => {
    assertAction(
      {
        type: 'PrevWeek',
      },
      {
        activeDate: new Date('2017-12-25 00:00:00'),
        highlightedIndex: 29,
      },
    )
  })

  it('NextWeek', () => {
    assertAction(
      {
        type: 'NextWeek',
      },
      {
        activeDate: new Date('2018-01-08 00:00:00'),
        highlightedIndex: 8,
      },
    )
  })

  it('PrevMonth', () => {
    assertAction(
      {
        type: 'PrevMonth',
      },
      {
        activeDate: new Date('2017-12-01 00:00:00'),
        highlightedIndex: 5,
      },
    )
  })

  it('NextMonth', () => {
    assertAction(
      {
        type: 'NextMonth',
      },
      {
        activeDate: new Date('2018-02-01 00:00:00'),
        highlightedIndex: 4,
      },
    )
  })

  it('StartOfWeek', () => {
    assertAction(
      {
        type: 'StartOfWeek',
      },
      {
        activeDate: new Date('2017-12-31 00:00:00'),
        highlightedIndex: 35,
      },
    )
  })

  it('EndOfWeek', () => {
    assertAction(
      {
        type: 'EndOfWeek',
      },
      {
        activeDate: new Date('2018-01-06 00:00:00'),
        highlightedIndex: 6,
      },
    )
  })
})
