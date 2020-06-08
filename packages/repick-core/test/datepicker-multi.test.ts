import { selectDateMulti, isSelectedMulti } from '../src/datepicker-multi'

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

describe('isSelectedMulti', () => {
  const dates = [new Date('2018-01-01'), new Date('2018-01-10')]

  it('selected', () => {
    expect(isSelectedMulti(dates, dates[0])).toEqual(true)
    expect(isSelectedMulti(dates, dates[1])).toEqual(true)
  })
  it('not selected', () => {
    expect(isSelectedMulti(dates, new Date('2018-01-05'))).toEqual(false)
    expect(isSelectedMulti(null, dates[0])).toEqual(false)
  })
})
