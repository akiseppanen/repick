import {
  selectDateMulti,
  selectDateRange,
  selectDateSingle,
  arrayIncludes,
} from '../src/utils'

describe('arrayIncludes', () => {
  it.only('returns correct value and comparison function called correct times', () => {
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

describe('selectDateSingle', () => {
  it('return given date when dates does not match', () => {
    const date = new Date('2018-01-01')
    expect(selectDateSingle(new Date('2000-01-01'), date)).toEqual(date)
  })
  it('return given null when dates does match', () => {
    const date = new Date('2018-01-01')
    expect(selectDateSingle(date, date)).toEqual(null)
  })
})

describe('selectDateMulti', () => {
  const selected = [
    new Date('2018-01-01'),
    new Date('2018-01-10'),
    new Date('2018-01-20'),
    new Date('2018-01-30'),
  ]

  it('new date is inserted to array', () => {
    expect(selectDateMulti(selected, new Date('2018-01-05'))).toEqual([
      selected[0],
      new Date('2018-01-05'),
      selected[1],
      selected[2],
      selected[3],
    ])

    expect(selectDateMulti(selected, new Date('2018-01-25'))).toEqual([
      selected[0],
      selected[1],
      selected[2],
      new Date('2018-01-25'),
      selected[3],
    ])
  })

  it('date is removed', () => {
    expect(selectDateMulti(selected, selected[0])).toEqual([
      selected[1],
      selected[2],
      selected[3],
    ])
    expect(selectDateMulti(selected, selected[2])).toEqual([
      selected[0],
      selected[1],
      selected[3],
    ])
  })
})

describe('selectDateRange', () => {
  it('empty selected, date is inserted', () => {
    expect(selectDateRange(null, new Date('2018-01-01'))).toEqual([
      new Date('2018-01-01'),
    ])
    expect(selectDateRange(null, new Date('2018-01-05'))).toEqual([
      new Date('2018-01-05'),
    ])
  })

  it('single date selected, date is inserted', () => {
    const selected: [Date] = [new Date('2018-01-05')]

    expect(selectDateRange(selected, new Date('2018-01-01'))).toEqual([
      new Date('2018-01-01'),
      ...selected,
    ])
    expect(selectDateRange(selected, new Date('2018-01-10'))).toEqual([
      ...selected,
      new Date('2018-01-10'),
    ])
  })
  it('single date selected, same date is selected', () => {
    const date = new Date('2018-01-05')
    const selected: [Date] = [date]

    expect(selectDateRange(selected, date)).toEqual(selected)
  })
  it('multiple date selected, new date is selected', () => {
    const selected: [Date, Date] = [
      new Date('2018-01-05'),
      new Date('2018-01-10'),
    ]

    const newDate = new Date('2018-01-01')

    expect(selectDateRange(selected, newDate)).toEqual([newDate])
  })
})
