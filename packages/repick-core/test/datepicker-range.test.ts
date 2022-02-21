import {
  selectDateRange,
  isSelectedRange,
  buildCalendarDayRangeExtra,
} from '../src/datepicker-range'
import { RepickState } from '../dist'

describe('selectDateRange', () => {
  it('empty selected, date is inserted', () => {
    expect(selectDateRange(null, new Date('2018-01-01'))).toEqual([
      [new Date('2018-01-01')],
      false,
    ])
    expect(selectDateRange(null, new Date('2018-01-05'))).toEqual([
      [new Date('2018-01-05')],
      false,
    ])
  })

  it('single date selected, date is inserted', () => {
    const selected: [Date] = [new Date('2018-01-05')]

    expect(selectDateRange(selected, new Date('2018-01-01'))).toEqual([
      [new Date('2018-01-01'), ...selected],
      true,
    ])
    expect(selectDateRange(selected, new Date('2018-01-10'))).toEqual([
      [...selected, new Date('2018-01-10')],
      true,
    ])
  })

  it('single date selected, same date is selected', () => {
    const date = new Date('2018-01-05')
    const selected: [Date] = [date]

    expect(selectDateRange(selected, date)).toEqual([selected, false])
  })

  it('multiple date selected, new date is selected', () => {
    const selected: [Date, Date] = [
      new Date('2018-01-05'),
      new Date('2018-01-10'),
    ]

    const newDate = new Date('2018-01-01')

    expect(selectDateRange(selected, newDate)).toEqual([[newDate], false])
  })
})

describe('isSelectedRange', () => {
  const range = [new Date('2018-01-01'), new Date('2018-01-31')] as [Date, Date]

  it('selected', () => {
    expect(isSelectedRange(range, range[0])).toEqual(true)
    expect(isSelectedRange(range, range[1])).toEqual(true)
  })

  it('not selected', () => {
    expect(isSelectedRange(range, new Date('2018-02-01'))).toEqual(false)
    expect(isSelectedRange(null, new Date('2018-02-01'))).toEqual(false)
    expect(isSelectedRange(range, new Date('2018-01-15'))).toEqual(false)
  })
})

describe('buildCalendarContextDayRange', () => {
  const range = [new Date('2018-01-01'), new Date('2018-01-31')] as [Date, Date]

  const state: RepickState<[Date] | [Date, Date]> = {
    activeDate: new Date('2018-01-01'),
    highlightedIndex: 0,
    selected: range,
    isOpen: false,
    inputValue: '',
  }

  it('rangeStart', () => {
    expect(buildCalendarDayRangeExtra(state, range[0])).toEqual({
      inRange: true,
      rangeStart: true,
      rangeEnd: false,
    })
  })

  it('rangeEnd', () => {
    expect(buildCalendarDayRangeExtra(state, range[1])).toEqual({
      inRange: true,
      rangeStart: false,
      rangeEnd: true,
    })
  })

  it('not selected', () => {
    expect(buildCalendarDayRangeExtra(state, new Date('2018-02-01'))).toEqual({
      inRange: false,
      rangeStart: false,
      rangeEnd: false,
    })
  })
})
