import { arrayIncludes, dateIsSelectable } from '../src/utils'

describe('arrayIncludes', () => {
  it('returns correct value and comparison function called correct times', () => {
    const mockFn = jest.fn((a, b) => a === b)

    const array = [1, 4, 8]

    expect(arrayIncludes(mockFn, array, 4)).toBe(true)

    expect(mockFn.mock.calls).toEqual([
      [1, 4],
      [4, 4],
    ])

    mockFn.mockReset()

    expect(arrayIncludes(mockFn, array, 12)).toBe(false)

    expect(mockFn.mock.calls).toEqual([
      [1, 12],
      [4, 12],
      [8, 12],
    ])
  })
})

describe('dateIsSelectable', () => {
  const minDate = new Date('2018-01-05')
  const maxDate = new Date('2018-01-20')
  const enabledDates = [new Date('2018-01-09'), new Date('2018-01-12')]
  const disabledDates = [new Date('2018-01-08'), new Date('2018-01-10')]

  it('enabled date', () => {
    const options = { enabledDates }

    expect(dateIsSelectable(options, enabledDates[0])).toBe(true)
    expect(dateIsSelectable(options, enabledDates[1])).toBe(true)
    expect(dateIsSelectable(options, new Date('2018-01-15'))).toBe(false)
  })

  it('disabled date', () => {
    const options = { disabledDates }

    expect(dateIsSelectable(options, disabledDates[0])).toBe(false)
    expect(dateIsSelectable(options, disabledDates[1])).toBe(false)
    expect(dateIsSelectable(options, new Date('2018-01-15'))).toBe(true)
  })

  it('disabled date', () => {
    const options = { disabledDates }

    expect(dateIsSelectable(options, disabledDates[0])).toBe(false)
    expect(dateIsSelectable(options, disabledDates[1])).toBe(false)
    expect(dateIsSelectable(options, new Date('2018-01-15'))).toBe(true)
  })

  it('min date', () => {
    const options = { minDate }

    expect(dateIsSelectable(options, minDate)).toBe(true)
    expect(dateIsSelectable(options, new Date('2018-01-15'))).toBe(true)
    expect(dateIsSelectable(options, new Date('2018-01-04'))).toBe(false)
    expect(dateIsSelectable(options, new Date('2018-01-01'))).toBe(false)
  })

  it('max date', () => {
    const options = { maxDate }

    expect(dateIsSelectable(options, maxDate)).toBe(true)
    expect(dateIsSelectable(options, new Date('2018-01-15'))).toBe(true)
    expect(dateIsSelectable(options, new Date('2018-01-21'))).toBe(false)
    expect(dateIsSelectable(options, new Date('2018-01-25'))).toBe(false)
  })

  it('min date & max date', () => {
    const options = { minDate, maxDate }

    expect(dateIsSelectable(options, minDate)).toBe(true)
    expect(dateIsSelectable(options, maxDate)).toBe(true)
    expect(dateIsSelectable(options, new Date('2018-01-15'))).toBe(true)
    expect(dateIsSelectable(options, new Date('2018-01-04'))).toBe(false)
    expect(dateIsSelectable(options, new Date('2018-01-01'))).toBe(false)
  })

  it('disabled dates & min date & max date', () => {
    const options = { minDate, maxDate, disabledDates }

    expect(dateIsSelectable(options, disabledDates[0])).toBe(false)
    expect(dateIsSelectable(options, disabledDates[1])).toBe(false)
    expect(dateIsSelectable(options, new Date('2018-01-15'))).toBe(true)
    expect(dateIsSelectable(options, minDate)).toBe(true)
    expect(dateIsSelectable(options, maxDate)).toBe(true)
    expect(dateIsSelectable(options, new Date('2018-01-15'))).toBe(true)
    expect(dateIsSelectable(options, new Date('2018-01-04'))).toBe(false)
    expect(dateIsSelectable(options, new Date('2018-01-01'))).toBe(false)
  })

  it('filter dates', () => {
    const date = new Date('2018-01-01')
    const filterDates = jest.fn()

    const options = { filterDates }

    filterDates.mockReturnValueOnce(true)
    expect(dateIsSelectable(options, date)).toBe(false)
    expect(filterDates).toBeCalledWith(date)

    filterDates.mockReturnValueOnce(false)
    expect(dateIsSelectable(options, date)).toBe(true)
    expect(filterDates).toBeCalledWith(date)
  })
})
