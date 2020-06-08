import { reducer as reducerCore } from '../../src/core/reducer'
import { RepickOptions, RepickState } from '../../src/core/types'
import { dateIsSelectable } from '../../src/utils'

jest.mock('../../src/utils')

const mockedDateIsSelectable = dateIsSelectable as jest.Mock<
  boolean,
  [RepickOptions, Date]
>

describe('reducerGeneric', () => {
  const selected = new Date('2018-01-05 00:00:00')
  const highlighted = new Date('2018-01-01 00:00:00')

  const state: RepickState<Date> = {
    highlighted,
    selected,
  }

  const mockedSelectDate = jest.fn<Date, [Date | null, Date]>()
  const reducer = reducerCore<RepickState<Date>>(mockedSelectDate)

  beforeEach(() => {
    mockedDateIsSelectable.mockReturnValue(true)
  })

  it('SelectDate', () => {
    const expectedDate = new Date('2018-01-10 00:00:00')

    mockedSelectDate.mockReturnValue(expectedDate)

    const newState = reducer(state, {
      date: expectedDate,
      type: 'SelectDate',
    })

    expect(newState).toEqual({
      ...state,
      highlighted: expectedDate,
      selected: expectedDate,
    })

    expect(mockedSelectDate).toHaveBeenCalledWith(selected, expectedDate)
  })

  it('SelectDate: unselectable', () => {
    mockedDateIsSelectable.mockReturnValue(false)

    const date = new Date('2018-01-05 00:00:00')

    const newState = reducer(state, {
      date: date,
      type: 'SelectDate',
    })

    expect(newState).toEqual(state)
    expect(mockedDateIsSelectable).toHaveBeenCalledWith(state, date)
  })

  it('SelectHighlighted', () => {
    mockedSelectDate.mockReturnValue(highlighted)

    const newState = reducer(state, {
      type: 'SelectHighlighted',
    })

    expect(newState).toEqual({
      ...state,
      selected: highlighted,
    })

    expect(mockedSelectDate).toHaveBeenCalledWith(selected, highlighted)
  })

  it('SelectHighlighted: unselectable', () => {
    mockedDateIsSelectable.mockReturnValue(false)

    const newState = reducer(state, {
      type: 'SelectHighlighted',
    })

    expect(newState).toEqual(state)
    expect(mockedDateIsSelectable).toHaveBeenCalledWith(state, highlighted)
  })

  it('PrevDay', () => {
    const newState = reducer(state, {
      type: 'PrevDay',
    })

    expect(newState).toEqual({
      ...state,
      highlighted: new Date('2017-12-31 00:00:00'),
    })
  })

  it('NextDay', () => {
    const newState = reducer(state, {
      type: 'NextDay',
    })

    expect(newState).toEqual({
      ...state,
      highlighted: new Date('2018-01-02 00:00:00'),
    })
  })

  it('PrevWeek', () => {
    const newState = reducer(state, {
      type: 'PrevWeek',
    })

    expect(newState).toEqual({
      ...state,
      highlighted: new Date('2017-12-25 00:00:00'),
    })
  })

  it('NextWeek', () => {
    const newState = reducer(state, {
      type: 'NextWeek',
    })

    expect(newState).toEqual({
      ...state,
      highlighted: new Date('2018-01-08 00:00:00'),
    })
  })

  it('PrevMonth', () => {
    const newState = reducer(state, {
      type: 'PrevMonth',
    })

    expect(newState).toEqual({
      ...state,
      highlighted: new Date('2017-12-01 00:00:00'),
    })
  })

  it('NextMonth', () => {
    const newState = reducer(state, {
      type: 'NextMonth',
    })

    expect(newState).toEqual({
      ...state,
      highlighted: new Date('2018-02-01 00:00:00'),
    })
  })

  it('StartOfWeek', () => {
    const newState = reducer(state, {
      type: 'StartOfWeek',
    })

    expect(newState).toEqual({
      ...state,
      highlighted: new Date('2017-12-31 00:00:00'),
    })
  })

  it('EndOfWeek', () => {
    const newState = reducer(state, {
      type: 'EndOfWeek',
    })

    expect(newState).toEqual({
      ...state,
      highlighted: new Date('2018-01-06 00:00:00'),
    })
  })
})
