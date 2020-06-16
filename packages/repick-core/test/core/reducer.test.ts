import format from 'date-fns/format'
import parse from 'date-fns/parse'
import {
  reducer as reducerCore,
  RepickStateChangeOptions,
} from '../../src/core/reducer'
import { RepickOptions, RepickState } from '../../src/core/types'
import { dateIsSelectable, wrapWeekDay } from '../../src/utils'
import { RepickAction, ActionSelectDate } from '../../src/actions'

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
  const highlighted = new Date('2018-01-01 00:00:00')

  const state: RepickState<Date> = {
    highlighted,
    inputValue: format(selected, 'yyyy-MM-dd'),
    isOpen: false,
    selected,
  }

  const mockedSelectDate = jest.fn<[Date, boolean], [Date | null, Date]>()
  const mockedFormat = jest.fn<string, [Date, string]>(format)
  const mockedParse = jest.fn<Date, [string, string]>((dateString, format) =>
    parse(dateString, format, new Date('2018-01-01 00:00:00')),
  )
  const mockedStateReducer = jest.fn<
    RepickState<Date>,
    [RepickState<Date>, RepickStateChangeOptions<Date>]
  >((state, { changes }) => ({
    ...state,
    ...changes,
  }))
  const reducer = reducerCore<Date>(
    mockedSelectDate,
    mockedFormat,
    mockedParse,
  )(mockedStateReducer)

  mockedDateIsSelectable.mockReturnValue(true)

  const assertAction = (
    action: RepickAction,
    expectedChanges: Partial<RepickState<Date>>,
  ) => {
    const newState = reducer(state, action)

    expect(newState).toEqual({ ...state, ...expectedChanges })

    expect(mockedStateReducer).toHaveBeenCalledWith(state, {
      action,
      changes: expectedChanges,
    })
  }

  afterEach(() => {
    mockedStateReducer.mockClear()
  })

  it('StateReducer', () => {
    const inputDate = new Date('2018-01-10 12:00:00')
    const expectedDate = new Date('2018-01-10 00:00:00')
    const expected = {
      highlighted: expectedDate,
      inputValue: format(expectedDate, 'yyyy-MM-dd'),
      isOpen: true,
      selected: expectedDate,
    }
    const action: ActionSelectDate = {
      date: inputDate,
      type: 'SelectDate',
    }

    mockedSelectDate.mockReturnValue([inputDate, true])
    mockedStateReducer.mockReturnValueOnce(expected)

    const newState = reducer(state, action)

    expect(newState).toEqual({
      ...state,
      ...expected,
    })

    expect(mockedStateReducer).toHaveBeenCalledWith(state, {
      action,
      changes: {
        highlighted: inputDate,
        inputValue: format(inputDate, 'yyyy-MM-dd'),
        isOpen: false,
        selected: inputDate,
      },
    })
  })

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
    expect(mockedDateIsSelectable).toHaveBeenCalledWith(state, date)
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
    expect(mockedDateIsSelectable).toHaveBeenCalledWith(state, date)
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
    expect(mockedDateIsSelectable).toHaveBeenCalledWith(state, highlighted)
  })

  it('ArrowLeft', () => {
    assertAction(
      {
        type: 'KeyArrowLeft',
      },
      {
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
        highlighted: new Date('2018-01-06 00:00:00'),
      },
    )
  })
})
