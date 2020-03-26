import { reducer } from '../src/reducer'
import { RepickState } from '../src/types'
import {
  selectDateMulti,
  selectDateRange,
  selectDateSingle,
  dateIsSelectable,
} from '../src/utils'

jest.mock('../src/utils')

const mockedSelectDateSingle = selectDateSingle as jest.Mock
const mockedSelectDateMulti = selectDateMulti as jest.Mock
const mockedSelectDateRange = selectDateRange as jest.Mock
const mockedDateIsSelectable = dateIsSelectable as jest.Mock

const initialDate = new Date('2018-01-01 00:00:00')

const date = new Date('2018-01-05 00:00:00')

const dates = [
  new Date('2018-01-05 00:00:00'),
  new Date('2018-01-10 00:00:00'),
  new Date('2018-01-20 00:00:00'),
]

const dateRange = [
  new Date('2018-01-05 00:00:00'),
  new Date('2018-01-20 00:00:00'),
] as [Date, Date]

const stateSingle: RepickState = {
  date: initialDate,
  mode: 'single',
  selected: date,
}

const stateMulti: RepickState = {
  date: initialDate,
  mode: 'multi',
  selected: dates,
}

const stateRange: RepickState = {
  date: initialDate,
  mode: 'range',
  selected: dateRange,
}

describe('reducer', () => {
  beforeEach(() => {
    mockedDateIsSelectable.mockReturnValue(true)
  })

  describe('SelectDate', () => {
    it('mode: single', () => {
      const expectedDate = new Date('2018-01-10 00:00:00')

      mockedSelectDateSingle.mockReturnValue(expectedDate)

      const newState = reducer(stateSingle, {
        date: expectedDate,
        type: 'SelectDate',
      })

      expect(newState).toEqual({
        ...stateSingle,
        date: expectedDate,
        selected: expectedDate,
      })

      expect(mockedSelectDateSingle).toHaveBeenCalledWith(date, expectedDate)
    })

    it('mode: multi', () => {
      const expectedDate = new Date('2018-01-20 00:00:00')
      const expectedDates = [...dates, expectedDate]

      mockedSelectDateMulti.mockReturnValue(expectedDates)

      const newState = reducer(stateMulti, {
        date: expectedDate,
        type: 'SelectDate',
      })

      expect(newState).toEqual({
        ...stateMulti,
        date: expectedDate,
        selected: expectedDates,
      })

      expect(mockedSelectDateMulti).toHaveBeenCalledWith(dates, expectedDate)
    })

    it('mode: range', () => {
      const expectedDate = new Date('2018-01-20 00:00:00')
      const expectedDates = [expectedDate]

      mockedSelectDateRange.mockReturnValue(expectedDates)

      const newState = reducer(stateRange, {
        date: expectedDate,
        type: 'SelectDate',
      })

      expect(newState).toEqual({
        ...stateRange,
        date: expectedDate,
        selected: expectedDates,
      })

      expect(mockedSelectDateRange).toHaveBeenCalledWith(
        dateRange,
        expectedDate,
      )
    })

    it('unselectable date', () => {
      mockedDateIsSelectable.mockReturnValue(false)

      const date = new Date('2018-01-05 00:00:00')

      const state: RepickState = {
        date: initialDate,
        mode: 'single',
        selected: null,
      }

      const newState = reducer(state, {
        date: date,
        type: 'SelectDate',
      })

      expect(newState).toEqual(state)
      expect(mockedDateIsSelectable).toHaveBeenCalledWith(state, date)
    })
  })
  describe('SelectCurrent', () => {
    it('mode: single', () => {
      mockedSelectDateSingle.mockReturnValue(initialDate)

      const newState = reducer(stateSingle, {
        type: 'SelectCurrent',
      })

      expect(newState).toEqual({
        ...stateSingle,
        selected: initialDate,
      })

      expect(mockedSelectDateSingle).toHaveBeenCalledWith(date, initialDate)
    })

    it('mode: multi', () => {
      const expectedDates = [...dates, initialDate]

      mockedSelectDateMulti.mockReturnValue(expectedDates)

      const newState = reducer(stateMulti, {
        type: 'SelectCurrent',
      })

      expect(newState).toEqual({
        ...stateMulti,
        selected: expectedDates,
      })

      expect(mockedSelectDateMulti).toHaveBeenCalledWith(dates, initialDate)
    })

    it('mode: range', () => {
      const expectedDates = [initialDate]

      mockedSelectDateRange.mockReturnValue(expectedDates)

      const newState = reducer(stateRange, {
        type: 'SelectCurrent',
      })

      expect(newState).toEqual({
        ...stateRange,
        selected: expectedDates,
      })

      expect(mockedSelectDateRange).toHaveBeenCalledWith(dateRange, initialDate)
    })

    it('unselectable date', () => {
      mockedDateIsSelectable.mockReturnValue(false)

      const date = new Date('2018-01-05 00:00:00')

      const state: RepickState = {
        date,
        mode: 'single',
        selected: null,
      }

      const newState = reducer(state, {
        type: 'SelectCurrent',
      })

      expect(newState).toEqual(state)
      expect(mockedDateIsSelectable).toHaveBeenCalledWith(state, date)
    })
  })

  it('PrevDay', () => {
    const newState = reducer(stateSingle, {
      type: 'PrevDay',
    })

    expect(newState).toEqual({
      ...stateSingle,
      date: new Date('2017-12-31 00:00:00'),
    })
  })

  it('NextDay', () => {
    const newState = reducer(stateSingle, {
      type: 'NextDay',
    })

    expect(newState).toEqual({
      ...stateSingle,
      date: new Date('2018-01-02 00:00:00'),
    })
  })

  it('PrevWeek', () => {
    const newState = reducer(stateSingle, {
      type: 'PrevWeek',
    })

    expect(newState).toEqual({
      ...stateSingle,
      date: new Date('2017-12-25 00:00:00'),
    })
  })

  it('NextWeek', () => {
    const newState = reducer(stateSingle, {
      type: 'NextWeek',
    })

    expect(newState).toEqual({
      ...stateSingle,
      date: new Date('2018-01-08 00:00:00'),
    })
  })

  it('PrevMonth', () => {
    const newState = reducer(stateSingle, {
      type: 'PrevMonth',
    })

    expect(newState).toEqual({
      ...stateSingle,
      date: new Date('2017-12-01 00:00:00'),
    })
  })

  it('NextMonth', () => {
    const newState = reducer(stateSingle, {
      type: 'NextMonth',
    })

    expect(newState).toEqual({
      ...stateSingle,
      date: new Date('2018-02-01 00:00:00'),
    })
  })

  it('StartOfWeek', () => {
    const newState = reducer(stateSingle, {
      type: 'StartOfWeek',
    })

    expect(newState).toEqual({
      ...stateSingle,
      date: new Date('2017-12-31 00:00:00'),
    })
  })

  it('EndOfWeek', () => {
    const newState = reducer(stateSingle, {
      type: 'EndOfWeek',
    })

    expect(newState).toEqual({
      ...stateSingle,
      date: new Date('2018-01-06 00:00:00'),
    })
  })
})
