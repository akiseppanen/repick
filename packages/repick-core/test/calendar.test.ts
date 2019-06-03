import MockDate from 'mockdate'

import { buildCalendar, buildDate } from '../src/calendar'
import { State } from '../src/types'

describe('buildDate', () => {
  describe('mode: single', () => {
    const date = new Date('2018-01-01')

    const state: State = {
      current: date,
      mode: 'single',
      selected: date,
    }

    it('selected', () => {
      expect(buildDate(state, date)).toMatchObject({ selected: true })
    })

    it('not selected', () => {
      expect(buildDate(state, new Date('2018-02-01'))).toMatchObject({
        selected: false,
      })
    })
  })

  describe('mode: multi', () => {
    const dates = [
      new Date('2018-01-01'),
      new Date('2018-01-02'),
      new Date('2018-01-03'),
    ]

    const state: State = {
      current: new Date('2018-01-01'),
      mode: 'multi',
      selected: dates,
    }

    it('selected, 1st', () => {
      expect(buildDate(state, dates[0])).toMatchObject({ selected: true })
    })
    it('selected, 2nd', () => {
      expect(buildDate(state, dates[1])).toMatchObject({ selected: true })
    })
    it('selected, 3rd', () => {
      expect(buildDate(state, dates[2])).toMatchObject({ selected: true })
    })
    it('not selected', () => {
      expect(buildDate(state, new Date('2018-02-01'))).toMatchObject({
        selected: false,
      })
    })
  })

  describe('mode: range', () => {
    const range = [new Date('2018-01-01'), new Date('2018-01-31')] as [
      Date,
      Date,
    ]

    const state: State = {
      current: new Date('2018-01-01'),
      mode: 'multi',
      selected: range,
    }

    it('selected 1st', () => {
      expect(buildDate(state, range[0])).toMatchObject({ selected: true })
    })

    it('selected 2nd', () => {
      expect(buildDate(state, range[1])).toMatchObject({ selected: true })
    })

    it('selected in range', () => {
      expect(buildDate(state, new Date('2018-01-15'))).toMatchObject({
        selected: false,
      })
    })
    it('not selected', () => {
      expect(buildDate(state, new Date('2018-02-01'))).toMatchObject({
        selected: false,
      })
    })
  })

  it('today', () => {
    const date = new Date('2018-02-01')
    MockDate.set(date)

    expect(
      buildDate(
        {
          current: new Date('2018-01-01'),
          mode: 'single',
          selected: null,
        },
        date,
      ),
    ).toMatchObject({
      today: true,
    })

    MockDate.reset()
  })

  it('current', () => {
    const date = new Date('2018-02-01')

    expect(
      buildDate(
        {
          current: date,
          mode: 'single',
          selected: null,
        },
        date,
      ),
    ).toMatchObject({
      current: true,
    })
  })

  it('previous month', () => {
    const date = new Date('2018-01-01')

    expect(
      buildDate(
        {
          current: new Date('2018-02-01'),
          mode: 'single',
          selected: null,
        },
        date,
      ),
    ).toMatchObject({
      nextMonth: false,
      prevMonth: true,
    })
  })

  it('next month', () => {
    const date = new Date('2018-02-01')

    expect(
      buildDate(
        {
          current: new Date('2018-01-01'),
          mode: 'single',
          selected: null,
        },
        date,
      ),
    ).toMatchObject({
      nextMonth: true,
      prevMonth: false,
    })
  })
})

it('buildCalendar', () => {
  const expectedDate = new Date('2018-01-01 00:00:00')
  const expectedSelected = new Date('2018-01-10 00:00:00')
  const {
    month,
    monthLong,
    monthShort,
    selected,
    date,
    year,
    weekdays,
    days,
  } = buildCalendar({
    current: expectedDate,
    mode: 'single',
    selected: expectedSelected,
  })

  expect(month).toEqual(1)
  expect(monthLong).toEqual('January')
  expect(monthShort).toEqual('Jan')
  expect(selected).toEqual(expectedSelected)
  expect(date).toEqual(expectedDate)
  expect(year).toEqual(2018)
  expect(weekdays).toBeInstanceOf(Array)
  expect(weekdays).toHaveLength(7)
  expect(days).toBeInstanceOf(Array)
  expect(days).toHaveLength(42)

  expect(days[0]).toMatchObject({
    date: new Date('2017-12-31 00:00:00'),
  })

  expect(days[1]).toMatchObject({
    date: new Date('2018-01-01 00:00:00'),
  })

  expect(days[10]).toMatchObject({
    date: new Date('2018-01-10 00:00:00'),
  })

  expect(days[41]).toMatchObject({
    date: new Date('2018-02-10 00:00:00'),
  })
})
