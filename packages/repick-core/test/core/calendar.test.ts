import isSameDay from 'date-fns/isSameDay'
import MockDate from 'mockdate'

import {
  buildContext as buildContextCore,
  buildCalendarDay as buildCalendarDayCore,
} from '../../src/core/calendar'
import { RepickState } from '../../src/core/types'

type Extras = { hello: string }

describe('buildContext', () => {
  const mockedIsSelected = jest.fn<boolean, [Date | null, Date]>()
  const mockedBuildExtra = jest.fn<Extras, [RepickState<Date>, Date]>()

  beforeEach(() => {
    mockedBuildExtra.mockReturnValue({ hello: 'world' })
    mockedIsSelected.mockImplementation(
      (date1, date2) => !!date1 && isSameDay(date1, date2),
    )

    const date = new Date('2018-01-30')
    MockDate.set(date)
  })

  const buildCalendarDay = buildCalendarDayCore<RepickState<Date>, Extras>(
    mockedIsSelected,
    mockedBuildExtra,
  )

  const buildContext = buildContextCore(buildCalendarDay)

  const highlighted = new Date('2018-01-01 00:00:00')
  const selected = new Date('2018-01-10 00:00:00')
  const disabledDates = [new Date('2018-01-15'), new Date('2018-01-20')]

  it('single month', () => {
    expect(
      buildContext({
        disabledDates,
        highlighted,
        inputValue: '',
        isOpen: false,
        selected,
      }),
    ).toMatchSnapshot()
  })

  it('multiple months', () => {
    expect(
      buildContext({
        disabledDates,
        highlighted,
        inputValue: '',
        isOpen: false,
        monthCount: 2,
        selected,
      }),
    ).toMatchSnapshot()
  })
})
