import getDate from 'date-fns/get_date'
import startOfDay from 'date-fns/start_of_day'

import fiLocale from 'date-fns/locale/fi'

import { buildCalendar, buildDate, buildWeekdays } from '../src/calendar'

describe('buildWeekdays', () => {
  it('default locale', () => {
    expect(buildWeekdays()).toEqual([
      { long: 'Sunday', short: 'Sun' },
      { long: 'Monday', short: 'Mon' },
      { long: 'Tuesday', short: 'Tue' },
      { long: 'Wednesday', short: 'Wed' },
      { long: 'Thursday', short: 'Thu' },
      { long: 'Friday', short: 'Fri' },
      { long: 'Saturday', short: 'Sat' },
    ])
  })
  it('default locale starting monday', () => {
    expect(buildWeekdays({ weekStartsOn: 1 })).toEqual([
      { long: 'Monday', short: 'Mon' },
      { long: 'Tuesday', short: 'Tue' },
      { long: 'Wednesday', short: 'Wed' },
      { long: 'Thursday', short: 'Thu' },
      { long: 'Friday', short: 'Fri' },
      { long: 'Saturday', short: 'Sat' },
      { long: 'Sunday', short: 'Sun' },
    ])
  })
  it('finnish locale starting monday', () => {
    expect(buildWeekdays({ locale: fiLocale, weekStartsOn: 1 })).toEqual([
      { long: 'maanantai', short: 'ma' },
      { long: 'tiistai', short: 'ti' },
      { long: 'keskiviikko', short: 'ke' },
      { long: 'torstai', short: 'to' },
      { long: 'perjantai', short: 'pe' },
      { long: 'lauantai', short: 'la' },
      { long: 'sunnuntai', short: 'su' },
    ])
  })
})

describe('buildDate', () => {
  it('today', () => {
    const today = startOfDay(new Date())
    expect(
      buildDate(
        {
          date: today,
          selected: null,
        },
        today,
      ),
    ).toEqual({
      current: true,
      date: today,
      day: getDate(today),
      nextMonth: false,
      prevMonth: false,
      selected: false,
      today: true,
    })
  })

  it('selected, not current', () => {
    const date = new Date('2018-01-01')

    expect(
      buildDate(
        {
          date,
          selected: date,
        },
        date,
      ),
    ).toEqual({
      date,
      current: true,
      day: 1,
      nextMonth: false,
      prevMonth: false,
      selected: true,
      today: false,
    })
  })

  it('selected, current', () => {
    const date = new Date('2018-01-01')

    expect(
      buildDate(
        {
          date,
          selected: date,
        },
        date,
      ),
    ).toEqual({
      date,
      current: true,
      day: 1,
      nextMonth: false,
      prevMonth: false,
      selected: true,
      today: false,
    })
  })

  it('previous month', () => {
    const date = new Date('2018-01-01')

    expect(
      buildDate(
        {
          date: new Date('2018-02-01'),
          selected: null,
        },
        date,
      ),
    ).toEqual({
      date,
      current: false,
      day: 1,
      nextMonth: false,
      prevMonth: true,
      selected: false,
      today: false,
    })
  })

  it('next month', () => {
    const date = new Date('2018-02-02')

    expect(
      buildDate(
        {
          date: new Date('2018-01-01'),
          selected: null,
        },
        date,
      ),
    ).toEqual({
      date,
      current: false,
      day: 2,
      nextMonth: true,
      prevMonth: false,
      selected: false,
      today: false,
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
    date: expectedDate,
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

  expect(days[0]).toEqual({
    current: false,
    date: new Date('2017-12-31 00:00:00'),
    day: 31,
    nextMonth: false,
    prevMonth: true,
    selected: false,
    today: false,
  })

  expect(days[1]).toEqual({
    current: true,
    date: new Date('2018-01-01 00:00:00'),
    day: 1,
    nextMonth: false,
    prevMonth: false,
    selected: false,
    today: false,
  })

  expect(days[10]).toEqual({
    current: false,
    date: new Date('2018-01-10 00:00:00'),
    day: 10,
    nextMonth: false,
    prevMonth: false,
    selected: true,
    today: false,
  })

  expect(days[41]).toEqual({
    current: false,
    date: new Date('2018-02-10 00:00:00'),
    day: 10,
    nextMonth: true,
    prevMonth: false,
    selected: false,
    today: false,
  })
})
