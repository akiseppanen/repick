import format from 'date-fns/format'
import parse from 'date-fns/parse'
import { createReducer } from '../../src/core/reducer'
import { RepickOptions, RepickState } from '../../src/core/types'
import { dateIsSelectable, wrapWeekDay, defaultOptions } from '../../src/utils'
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

describe('reducerGeneric', () => {
  const selected = new Date('2018-01-05 00:00:00')
  const activeMonth = new Date('2018-01-01 00:00:00')
  const highlighted = new Date('2018-01-01 00:00:00')

  const state: RepickState<Date> = {
    activeMonth,
    highlighted,
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
  ) => {
    const newState = reducer(state, action, {})

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
        highlighted: expectedDate,
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
        highlighted: expectedDate,
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

  it('SelectHighlighted', () => {
    mockedSelectDate.mockReturnValue([highlighted, true])

    assertAction(
      {
        type: 'SelectHighlighted',
      },
      {
        highlighted,
        selected: highlighted,
        inputValue: format(highlighted, 'yyyy-MM-dd'),
        isOpen: false,
      },
    )

    expect(mockedSelectDate).toHaveBeenCalledWith(selected, highlighted)
  })

  it('SelectHighlighted: unselectable', () => {
    mockedDateIsSelectable.mockReturnValueOnce(false)

    assertAction(
      {
        type: 'SelectHighlighted',
      },
      {},
    )
    expect(mockedDateIsSelectable).toHaveBeenCalledWith(
      defaultOptions,
      highlighted,
    )
  })

  it('ArrowLeft', () => {
    assertAction(
      {
        type: 'KeyArrowLeft',
      },
      {
        activeMonth: new Date('2017-12-01 00:00:00'),
        highlighted: new Date('2017-12-31 00:00:00'),
      },
    )
  })

  it('ArrowRight', () => {
    assertAction(
      {
        type: 'KeyArrowRight',
      },
      {
        activeMonth: new Date('2018-01-01 00:00:00'),
        highlighted: new Date('2018-01-02 00:00:00'),
      },
    )
  })

  it('ArrowUp', () => {
    assertAction(
      {
        type: 'KeyArrowUp',
      },
      {
        activeMonth: new Date('2017-12-01 00:00:00'),
        highlighted: new Date('2017-12-25 00:00:00'),
      },
    )
  })

  it('ArrowDown', () => {
    assertAction(
      {
        type: 'KeyArrowDown',
      },
      {
        activeMonth: new Date('2018-01-01 00:00:00'),
        highlighted: new Date('2018-01-08 00:00:00'),
      },
    )
  })

  it('PageDown', () => {
    assertAction(
      {
        type: 'KeyPageDown',
      },
      {
        activeMonth: new Date('2017-12-01 00:00:00'),
        highlighted: new Date('2017-12-01 00:00:00'),
      },
    )
  })

  it('PageUp', () => {
    assertAction(
      {
        type: 'KeyPageUp',
      },
      {
        activeMonth: new Date('2018-02-01 00:00:00'),
        highlighted: new Date('2018-02-01 00:00:00'),
      },
    )
  })

  it('Home', () => {
    assertAction(
      {
        type: 'KeyHome',
      },
      {
        activeMonth: new Date('2017-12-01 00:00:00'),
        highlighted: new Date('2017-12-31 00:00:00'),
      },
    )
  })

  it('End', () => {
    assertAction(
      {
        type: 'KeyEnd',
      },
      {
        activeMonth: new Date('2018-01-01 00:00:00'),
        highlighted: new Date('2018-01-06 00:00:00'),
      },
    )
  })

  it('Shift + PageDown', () => {
    assertAction(
      {
        type: 'KeyShiftPageDown',
      },
      {
        activeMonth: new Date('2017-01-01 00:00:00'),
        highlighted: new Date('2017-01-01 00:00:00'),
      },
    )
  })

  it('Shift + PageUp', () => {
    assertAction(
      {
        type: 'KeyShiftPageUp',
      },
      {
        activeMonth: new Date('2019-01-01 00:00:00'),
        highlighted: new Date('2019-01-01 00:00:00'),
      },
    )
  })

  it('PrevDay', () => {
    assertAction(
      {
        type: 'PrevDay',
      },
      {
        activeMonth: new Date('2017-12-01 00:00:00'),
        highlighted: new Date('2017-12-31 00:00:00'),
      },
    )
  })

  it('KeyEnter', () => {
    assertAction(
      {
        type: 'KeyEnter',
      },
      {
        selected: highlighted,
        highlighted,
        inputValue: format(highlighted, 'yyyy-MM-dd'),
        isOpen: false,
      },
    )
  })

  it('NextDay', () => {
    assertAction(
      {
        type: 'NextDay',
      },
      {
        activeMonth: new Date('2018-01-01 00:00:00'),
        highlighted: new Date('2018-01-02 00:00:00'),
      },
    )
  })

  it('PrevWeek', () => {
    assertAction(
      {
        type: 'PrevWeek',
      },
      {
        activeMonth: new Date('2017-12-01 00:00:00'),
        highlighted: new Date('2017-12-25 00:00:00'),
      },
    )
  })

  it('NextWeek', () => {
    assertAction(
      {
        type: 'NextWeek',
      },
      {
        activeMonth: new Date('2018-01-01 00:00:00'),
        highlighted: new Date('2018-01-08 00:00:00'),
      },
    )
  })

  it('PrevMonth', () => {
    assertAction(
      {
        type: 'PrevMonth',
      },
      {
        activeMonth: new Date('2017-12-01 00:00:00'),
        highlighted: new Date('2017-12-01 00:00:00'),
      },
    )
  })

  it('NextMonth', () => {
    assertAction(
      {
        type: 'NextMonth',
      },
      {
        activeMonth: new Date('2018-02-01 00:00:00'),
        highlighted: new Date('2018-02-01 00:00:00'),
      },
    )
  })

  it('StartOfWeek', () => {
    assertAction(
      {
        type: 'StartOfWeek',
      },
      {
        activeMonth: new Date('2017-12-01 00:00:00'),
        highlighted: new Date('2017-12-31 00:00:00'),
      },
    )
  })

  it('EndOfWeek', () => {
    assertAction(
      {
        type: 'EndOfWeek',
      },
      {
        activeMonth: new Date('2018-01-01 00:00:00'),
        highlighted: new Date('2018-01-06 00:00:00'),
      },
    )
  })
})
