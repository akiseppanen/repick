import MockDate from 'mockdate'

import {
  buildCalendarContext,
  buildCalendarContextDayGeneric,
  buildCalendarContextDaySingle,
  buildCalendarContextDayMulti,
  buildCalendarContextDayRange,
} from '../src/calendar'
import { RepickState } from '../src/types'

describe('buildCalendarContextDaySingle', () => {
  const date = new Date('2018-01-01')

  const state: RepickState = {
    current: date,
    mode: 'single',
    selected: date,
  }

  it('selected', () => {
    expect(buildCalendarContextDaySingle(state, date)).toMatchObject({
      selected: true,
    })
  })

  it('not selected', () => {
    expect(
      buildCalendarContextDaySingle(state, new Date('2018-02-01')),
    ).toMatchObject({
      selected: false,
    })
  })
})

describe('buildCalendarContextDayMulti', () => {
  const dates = [
    new Date('2018-01-01'),
    new Date('2018-01-02'),
    new Date('2018-01-03'),
  ]

  const state: RepickState = {
    current: new Date('2018-01-01'),
    mode: 'multi',
    selected: dates,
  }

  it('selected, 1st', () => {
    expect(buildCalendarContextDayMulti(state, dates[0])).toMatchObject({
      selected: true,
    })
  })
  it('selected, 2nd', () => {
    expect(buildCalendarContextDayMulti(state, dates[1])).toMatchObject({
      selected: true,
    })
  })
  it('selected, 3rd', () => {
    expect(buildCalendarContextDayMulti(state, dates[2])).toMatchObject({
      selected: true,
    })
  })
  it('not selected', () => {
    expect(
      buildCalendarContextDayMulti(state, new Date('2018-02-01')),
    ).toMatchObject({
      selected: false,
    })
  })
})

describe('buildCalendarContextDayRange', () => {
  const range = [new Date('2018-01-01'), new Date('2018-01-31')] as [Date, Date]

  const state: RepickState = {
    current: new Date('2018-01-01'),
    mode: 'range',
    selected: range,
  }

  it('selected 1st', () => {
    expect(buildCalendarContextDayRange(state, range[0])).toMatchObject({
      selected: true,
      rangeStart: true,
      rangeEnd: false,
    })
  })

  it('selected 2nd', () => {
    expect(buildCalendarContextDayRange(state, range[1])).toMatchObject({
      selected: true,
      rangeStart: false,
      rangeEnd: true,
    })
  })

  it('selected in range', () => {
    expect(
      buildCalendarContextDayRange(state, new Date('2018-01-15')),
    ).toMatchObject({
      selected: true,
      rangeStart: false,
      rangeEnd: false,
    })
  })

  it('not selected', () => {
    expect(
      buildCalendarContextDayRange(state, new Date('2018-02-01')),
    ).toMatchObject({
      selected: false,
      rangeStart: false,
      rangeEnd: false,
    })
  })
})

describe('buildCalendarContextDayGeneric', () => {
  it('today', () => {
    const date = new Date('2018-02-01')
    MockDate.set(date)

    expect(
      buildCalendarContextDayGeneric(() => ({}))(
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
      buildCalendarContextDayGeneric(() => ({}))(
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
      buildCalendarContextDayGeneric(() => ({}))(
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
      buildCalendarContextDayGeneric(() => ({}))(
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

  it('disabled', () => {
    const disabledDate = new Date('2018-02-01')

    expect(
      buildCalendarContextDayGeneric(() => ({}))(
        {
          current: new Date('2018-01-01'),
          mode: 'single',
          selected: null,
          disabledDates: [disabledDate],
        },
        disabledDate,
      ),
    ).toMatchObject({
      disabled: true,
    })
  })
})

describe('buildCalendarContext', () => {
  it('mode: single', () => {
    const expectedDate = new Date('2018-01-01 00:00:00')
    const expectedSelected = new Date('2018-01-10 00:00:00')
    const context = buildCalendarContext({
      current: expectedDate,
      mode: 'single',
      selected: expectedSelected,
    })

    expect(context).toMatchSnapshot()
  })

  it('mode: multi', () => {
    const expectedDate = new Date('2018-01-01 00:00:00')
    const expectedSelected = [
      new Date('2018-01-10 00:00:00'),
      new Date('2018-01-20 00:00:00'),
    ]
    const context = buildCalendarContext({
      current: expectedDate,
      mode: 'multi',
      selected: expectedSelected,
    })

    expect(context).toMatchSnapshot()
  })

  it('mode: range', () => {
    const expectedDate = new Date('2018-01-01 00:00:00')
    const expectedSelected = [
      new Date('2018-01-10 00:00:00'),
      new Date('2018-01-20 00:00:00'),
    ] as [Date, Date]

    const context = buildCalendarContext({
      current: expectedDate,
      mode: 'range',
      selected: expectedSelected,
    })

    expect(context).toMatchSnapshot()
  })
})
