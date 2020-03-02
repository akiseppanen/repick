import { reducer } from '../src/reducer'
import { State } from '../src/types'
import {
  selectDateMulti,
  selectDateRange,
  selectDateSingle,
  arrayIncludes,
} from '../src/utils'
import isSameDay from 'date-fns/isSameDay'

jest.mock('../src/utils')

const mockedSelectDateSingle = selectDateSingle as jest.Mock
const mockedSelectDateMulti = selectDateMulti as jest.Mock
const mockedSelectDateRange = selectDateRange as jest.Mock
const mockedArrayIncludes = arrayIncludes as jest.Mock

const initialCurrent = new Date('2018-01-01 00:00:00')

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

const stateSingle: State = {
  current: initialCurrent,
  mode: 'single',
  selected: date,
}

const stateMulti: State = {
  current: initialCurrent,
  mode: 'multi',
  selected: dates,
}

const stateRange: State = {
  current: initialCurrent,
  mode: 'range',
  selected: dateRange,
}

describe('reducer', () => {
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
        current: expectedDate,
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
        current: expectedDate,
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
        current: expectedDate,
        selected: expectedDates,
      })

      expect(mockedSelectDateRange).toHaveBeenCalledWith(
        dateRange,
        expectedDate,
      )
    })

    it('disabled dates', () => {
      mockedArrayIncludes.mockReturnValue(true)

      const disabledDate = new Date('2018-01-05 00:00:00')

      const state: State = {
        current: initialCurrent,
        mode: 'single',
        selected: null,
        disabledDates: [disabledDate],
      }

      const newState = reducer(state, {
        date: disabledDate,
        type: 'SelectDate',
      })

      expect(newState).toEqual(state)
      expect(mockedArrayIncludes).toHaveBeenCalledWith(
        isSameDay,
        [disabledDate],
        disabledDate,
      )
    })
  })
  describe('SelectCurrent', () => {
    it('mode: single', () => {
      mockedSelectDateSingle.mockReturnValue(initialCurrent)

      const newState = reducer(stateSingle, {
        type: 'SelectCurrent',
      })

      expect(newState).toEqual({
        ...stateSingle,
        selected: initialCurrent,
      })

      expect(mockedSelectDateSingle).toHaveBeenCalledWith(date, initialCurrent)
    })

    it('mode: multi', () => {
      const expectedDates = [...dates, initialCurrent]

      mockedSelectDateMulti.mockReturnValue(expectedDates)

      const newState = reducer(stateMulti, {
        type: 'SelectCurrent',
      })

      expect(newState).toEqual({
        ...stateMulti,
        selected: expectedDates,
      })

      expect(mockedSelectDateMulti).toHaveBeenCalledWith(dates, initialCurrent)
    })

    it('mode: range', () => {
      const expectedDates = [initialCurrent]

      mockedSelectDateRange.mockReturnValue(expectedDates)

      const newState = reducer(stateRange, {
        type: 'SelectCurrent',
      })

      expect(newState).toEqual({
        ...stateRange,
        selected: expectedDates,
      })

      expect(mockedSelectDateRange).toHaveBeenCalledWith(
        dateRange,
        initialCurrent,
      )
    })

    it('disabled dates', () => {
      mockedArrayIncludes.mockReturnValue(true)

      const disabledDate = new Date('2018-01-05 00:00:00')

      const state: State = {
        current: disabledDate,
        mode: 'single',
        selected: null,
        disabledDates: [disabledDate],
      }

      const newState = reducer(state, {
        type: 'SelectCurrent',
      })

      expect(newState).toEqual(state)
      expect(mockedArrayIncludes).toHaveBeenCalledWith(
        isSameDay,
        [disabledDate],
        disabledDate,
      )
    })
  })

  it('PrevDay', () => {
    const newState = reducer(stateSingle, {
      type: 'PrevDay',
    })

    expect(newState).toEqual({
      ...stateSingle,
      current: new Date('2017-12-31 00:00:00'),
    })
  })

  it('NextDay', () => {
    const newState = reducer(stateSingle, {
      type: 'NextDay',
    })

    expect(newState).toEqual({
      ...stateSingle,
      current: new Date('2018-01-02 00:00:00'),
    })
  })

  it('PrevWeek', () => {
    const newState = reducer(stateSingle, {
      type: 'PrevWeek',
    })

    expect(newState).toEqual({
      ...stateSingle,
      current: new Date('2017-12-25 00:00:00'),
    })
  })

  it('NextWeek', () => {
    const newState = reducer(stateSingle, {
      type: 'NextWeek',
    })

    expect(newState).toEqual({
      ...stateSingle,
      current: new Date('2018-01-08 00:00:00'),
    })
  })

  it('PrevMonth', () => {
    const newState = reducer(stateSingle, {
      type: 'PrevMonth',
    })

    expect(newState).toEqual({
      ...stateSingle,
      current: new Date('2017-12-01 00:00:00'),
    })
  })

  it('NextMonth', () => {
    const newState = reducer(stateSingle, {
      type: 'NextMonth',
    })

    expect(newState).toEqual({
      ...stateSingle,
      current: new Date('2018-02-01 00:00:00'),
    })
  })

  it('StartOfWeek', () => {
    const newState = reducer(stateSingle, {
      type: 'StartOfWeek',
    })

    expect(newState).toEqual({
      ...stateSingle,
      current: new Date('2017-12-31 00:00:00'),
    })
  })

  it('EndOfWeek', () => {
    const newState = reducer(stateSingle, {
      type: 'EndOfWeek',
    })

    expect(newState).toEqual({
      ...stateSingle,
      current: new Date('2018-01-06 00:00:00'),
    })
  })
})
